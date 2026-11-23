"use client";

// The painting as a real 3D scene (three.js).
// - The illustration is a textured plane; a perspective camera frames it so it
//   always covers the screen (cropping a little more from the right/bottom).
// - Focusing a place flies the camera in: a smooth eased dolly on a gentle arc
//   with a slight bank, so it feels like moving closer, not zooming a picture.
// - Day/night is a shader cross-fade between the two paintings, switched in sync
//   with the theme (so the circular reveal shows the new scene underneath).
// - HTML overlays (place labels, signpost, birds) are projected from 3D points
//   every frame, so they stay glued to the buildings while the camera moves.

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";

export type Anchor = { el: HTMLElement; x: number; y: number; scale?: boolean }; // x/y = % of the image

type Props = {
  day: string;
  night: string;
  aspect: number; // image width / height
  focus: { x: number; y: number; side?: "left" | "right" } | null; // % of the image (+ which side the card is on), or null for the overview
  anchors: React.RefObject<Map<string, Anchor>>;
  birds: React.RefObject<{ el: HTMLElement; top: number; dur: number; delay: number; dir: number; size: number }[]>;
  scrollZoom: MotionValue<number>; // 0..1 "fly in" amount from scrolling
  phone: boolean;
};

const FOV = 32;
const ZOOM = 1.38; // how much closer the camera gets to a place (gentle, like the reference)

export default function WorldGL({ day, night, aspect, focus, anchors, birds, scrollZoom, phone }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const focusRef = useRef(focus);
  const phoneRef = useRef(phone);
  focusRef.current = focus;
  phoneRef.current = phone;

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const el = host.current;
      if (!el || disposed) return;

      const PW = 16;
      const PH = PW / aspect;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ---- renderer (falls back to a plain image if WebGL is unavailable) ----
      let renderer: InstanceType<typeof THREE.WebGLRenderer> | null = null;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        el.classList.add("gl-failed");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // pass the painting's colours straight through
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf3c9a8);
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

      // ---- the painting: day/night textures cross-faded in a shader ----
      const loader = new THREE.TextureLoader();
      const tex = (url: string) => {
        const t = loader.load(url, () => {
          el.classList.add("gl-ready");
        });
        t.colorSpace = THREE.NoColorSpace;
        t.anisotropy = renderer!.capabilities.getMaxAnisotropy();
        t.minFilter = THREE.LinearMipmapLinearFilter;
        return t;
      };
      const isNight = () => {
        const t = document.documentElement.dataset.theme;
        return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      };
      const uniforms = { uDay: { value: tex(day) }, uNight: { value: tex(night || day) }, uMix: { value: isNight() ? 1 : 0 } };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform sampler2D uDay; uniform sampler2D uNight; uniform float uMix; varying vec2 vUv; void main(){ gl_FragColor = mix(texture2D(uDay, vUv), texture2D(uNight, vUv), uMix); }",
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), material);
      scene.add(plane);

      // switch instantly with the theme (the circular reveal animates it)
      const mo = new MutationObserver(() => {
        uniforms.uMix.value = isNight() ? 1 : 0;
        (scene.background as InstanceType<typeof THREE.Color>).set(isNight() ? 0x0b1024 : 0xf3c9a8);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // ---- sizing ----
      let W = 1;
      let H = 1;
      const resize = () => {
        W = el.clientWidth;
        H = el.clientHeight;
        renderer!.setSize(W, H, false);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // ---- camera framing ----
      const toWorld = (px: number, py: number) => ({ x: (px / 100 - 0.5) * PW, y: (0.5 - py / 100) * PH });
      const coverZ = () => Math.min(PH, PW / camera.aspect) / (2 * tanHalf);
      const clampView = (x: number, y: number, z: number) => {
        const vh = 2 * z * tanHalf;
        const vw = vh * camera.aspect;
        const mx = Math.max(0, (PW - vw) / 2);
        const my = Math.max(0, (PH - vh) / 2);
        return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)), z };
      };
      let pan = 0; // phone drag offset (world units)
      const baseView = () => {
        const z = coverZ();
        const vh = 2 * z * tanHalf;
        const vw = vh * camera.aspect;
        // crop more from the right and bottom, keeping the signpost and sky
        const x = -PW / 2 + vw / 2 + Math.max(0, PW - vw) * (phoneRef.current ? 0.5 : 0.3) + pan;
        const y = PH / 2 - vh / 2 - Math.max(0, PH - vh) * 0.15;
        return clampView(x, y, z);
      };
      const focusView = (f: { x: number; y: number; side?: "left" | "right" }) => {
        const z = coverZ() / ZOOM;
        const vh = 2 * z * tanHalf;
        const vw = vh * camera.aspect;
        const p = toWorld(f.x, f.y);
        // put the place beside the card (card on the left → place at 66%; card on the right → 34%);
        // on phones, centred near the top
        const sx = phoneRef.current ? 0.5 : f.side === "right" ? 0.34 : 0.66;
        const sy = phoneRef.current ? 0.32 : 0.55;
        return clampView(p.x - (sx - 0.5) * vw, p.y + (sy - 0.5) * vh, z);
      };

      // ---- flight between views ----
      const cur = { ...baseView(), bank: 0 };
      let from = { ...cur };
      let to = { ...cur };
      let t0 = 0;
      let dur = 1;
      let lastKey = "base";
      const ease = (t: number) => 1 - Math.pow(1 - t, 4); // quick start, long soft landing
      const startFlight = (target: { x: number; y: number; z: number }, now: number) => {
        from = { ...cur };
        to = { ...target, bank: 0 };
        t0 = now;
        const dist = Math.hypot(to.x - from.x, to.y - from.y, to.z - from.z);
        dur = reduce ? 1 : Math.min(1050, 700 + dist * 35);
      };

      // ---- mouse parallax & phone drag ----
      let mxT = 0;
      let myT = 0;
      let mx = 0;
      let my = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        mxT = (e.clientX - r.left) / r.width - 0.5;
        myT = (e.clientY - r.top) / r.height - 0.5;
      };
      let drag: { x: number; pan: number } | null = null;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse" || focusRef.current) return;
        drag = { x: e.clientX, pan };
      };
      const onDrag = (e: PointerEvent) => {
        if (!drag) return;
        const vw = 2 * coverZ() * tanHalf * camera.aspect;
        // keep the view inside the picture
        const x0 = -PW / 2 + vw / 2 + Math.max(0, PW - vw) * 0.5;
        const lim = Math.max(0, (PW - vw) / 2);
        pan = Math.min(lim - x0, Math.max(-lim - x0, drag.pan - ((e.clientX - drag.x) / W) * vw));
      };
      const onUp = () => (drag = null);
      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onDrag, { passive: true });
      window.addEventListener("pointerup", onUp);

      // ---- render loop ----
      const v = new THREE.Vector3();
      let raf = 0;
      const t00 = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const f = focusRef.current;
        const key = f ? `${f.x},${f.y}` : "base";
        if (key !== lastKey) {
          lastKey = key;
          startFlight(f ? focusView(f) : baseView(), now);
        }
        // follow a moving base (resize / scroll / drag) when not flying
        const t = Math.min(1, (now - t0) / dur);
        if (t >= 1 && !f) to = { ...baseView(), bank: 0 };
        else if (t >= 1 && f) to = { ...focusView(f), bank: 0 };
        const k = ease(t);
        // a gentle arc: pull back a little mid-flight, and bank toward the direction of travel
        // after arriving, keep drifting in very slowly (a living camera, not a frozen one)
        const drift = f && !reduce ? Math.min(1, Math.max(0, now - t0 - dur) / 14000) : 0;
        const driftK = 1 - Math.pow(1 - drift, 2);
        cur.x = from.x + (to.x - from.x) * k;
        cur.y = from.y + (to.y - from.y) * k;
        cur.z = (from.z + (to.z - from.z) * k) * (1 - 0.045 * driftK);
        cur.bank = 0;

        // parallax and scroll fly-in
        mx += (mxT - mx) * 0.05;
        my += (myT - my) * 0.05;
        const fly = 1 - 0.09 * scrollZoom.get();
        const z = cur.z * fly;
        const vh = 2 * z * tanHalf;
        const vw = vh * camera.aspect;
        const sway = f ? 0.25 : 1;
        // mouse sway, then clamp the FINAL view so it never looks past the painting's edges
        const fin = clampView(cur.x + mx * vw * 0.012 * sway, cur.y - my * vh * 0.012 * sway, z);
        camera.position.set(fin.x, fin.y, fin.z);
        camera.rotation.set(0, 0, 0);
        camera.updateMatrixWorld();
        renderer!.render(scene, camera);

        // project the HTML overlays onto the buildings
        const ppu = H / (2 * camera.position.z * tanHalf); // pixels per world unit at the plane
        const base = H / (2 * coverZ() * tanHalf);
        const s = ppu / base;
        anchors.current?.forEach((a) => {
          const w = toWorld(a.x, a.y);
          v.set(w.x, w.y, 0).project(camera);
          const sx = ((v.x + 1) / 2) * W;
          const sy = ((1 - v.y) / 2) * H;
          a.el.style.transform = `translate3d(${sx}px, ${sy}px, 0)${a.scale ? ` scale(${s})` : ""}`;
        });
        const secs = (now - t00) / 1000;
        birds.current?.forEach((b) => {
          const p = (((secs - b.delay) / b.dur) % 1 + 1) % 1;
          const bx = b.dir > 0 ? -PW / 2 - 0.6 + p * (PW + 1.2) : PW / 2 + 0.6 - p * (PW + 1.2);
          const by = (0.5 - b.top / 100) * PH + Math.sin(secs * 1.3 + b.delay) * 0.08;
          v.set(bx, by, 0.4).project(camera); // a little in front of the painting
          b.el.style.transform = `translate3d(${((v.x + 1) / 2) * W}px, ${((1 - v.y) / 2) * H}px, 0) scale(${s})`;
        });
      };
      raf = requestAnimationFrame(loop);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        mo.disconnect();
        window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onDrag);
        window.removeEventListener("pointerup", onUp);
        uniforms.uDay.value.dispose();
        uniforms.uNight.value.dispose();
        material.dispose();
        plane.geometry.dispose();
        renderer!.dispose();
        renderer!.domElement.remove();
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, night, aspect]);

  return (
    <div ref={host} className="world-gl">
      {/* shown until the textures load, and if WebGL is unavailable */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gl-poster art-day" src={day} alt="" aria-hidden="true" />
      {night && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="gl-poster art-night" src={night} alt="" aria-hidden="true" />
      )}
    </div>
  );
}
