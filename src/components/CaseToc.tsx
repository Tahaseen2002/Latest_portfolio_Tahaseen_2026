"use client";

// Section menu for a case study.
// Highlights the section on screen (scroll-spy) and scrolls smoothly on click.
// Desktop: sticky column on the left. Phone: a swipeable strip at the top.

import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; title: string; sub?: boolean };

export default function CaseToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement>(null);
  // After a click, keep the clicked item highlighted while the page scrolls to it
  const lockUntil = useRef(0);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const last = items[items.length - 1]?.id;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntil.current) return;
        if (atBottom() && last) return setActive(last);
        // Pick the top-most visible section
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));

    // Short last sections never reach the top of the screen: at the bottom, highlight the last item
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      if (atBottom() && last) setActive(last);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  // On phones the menu scrolls sideways: keep the active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav className="toc" aria-label="Case study sections">
      <ol ref={listRef}>
        {items.map((i) => (
          <li key={i.id} className={i.sub ? "sub" : undefined}>
            <a
              href={`#${i.id}`}
              data-id={i.id}
              className={active === i.id ? "on" : undefined}
              aria-current={active === i.id ? "location" : undefined}
              onClick={() => {
                lockUntil.current = Date.now() + 1000;
                setActive(i.id);
              }}
            >
              <span className="dash" aria-hidden="true" />
              {i.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
