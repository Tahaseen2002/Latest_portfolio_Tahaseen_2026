import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ExperienceTabs from "@/components/ExperienceTabs";
import ProjectStack from "@/components/ProjectStack";
import { CopyEmail, Counter, Magnetic, Spotlight } from "@/components/Interactive";
import { education, experience, profile, skills } from "@/data/profile";
import { moreProjects, projects } from "@/data/projects";

function SectionHead({ index, kicker, title, note }: { index: string; kicker: string; title: React.ReactNode; note?: string }) {
  return (
    <Reveal className="section-head">
      <p className="mono-label">
        <span className="accent">{index}</span> / {kicker}
      </p>
      <h2 className="serif">{title}</h2>
      {note && <p className="section-note">{note}</p>}
    </Reveal>
  );
}

export default function Home() {
  const current = experience[0]?.engagements?.find((e) => e.status === "Current");
  const marquee = skills.flatMap((g) => g.items);

  return (
    <>
      <Nav name={profile.name} resume={profile.resume} />

      <main className="container page">
        {/* ---------- Intro: bento grid ---------- */}
        <section id="top" className="bento" aria-label="Introduction">
          <Reveal onLoad className="tile tile-intro">
            <Spotlight className="tile-inner">
              <p className="status">Open to full-stack &amp; AI engineering roles</p>
              <h1 className="serif">
                I build <em>intelligent</em> products, from idea to handover.
              </h1>
              <p className="lead">{profile.intro}</p>
              <div className="actions">
                <Magnetic>
                  <a className="btn btn-solid pill" href="#projects">
                    See my work
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost pill" href={`mailto:${profile.email}`}>
                    Say hello
                  </a>
                </Magnetic>
              </div>
            </Spotlight>
          </Reveal>

          <Reveal onLoad className="tile tile-photo" delay={100}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.headshot} alt={`Portrait of ${profile.name}`} />
            <p className="photo-tag">
              <span className="serif">{profile.name}</span>
              <small>
                {profile.role} · {profile.location}
              </small>
            </p>
          </Reveal>

          {current && (
            <Reveal onLoad className="tile tile-now" delay={150}>
              <Spotlight className="tile-inner">
                <p className="mono-label">
                  <span className="pulse" aria-hidden="true" /> Now building
                </p>
                <p className="serif now-title">{current.name}</p>
                <p className="now-sub">@ {experience[0].company} · {experience[0].role}</p>
              </Spotlight>
            </Reveal>
          )}

          {profile.stats.map((s, i) => (
            <Reveal onLoad key={s.label} className="tile tile-stat" delay={200 + i * 60}>
              <Spotlight className="tile-inner">
                <b className="serif">
                  <Counter value={s.value} />
                </b>
                <span className="stat-label">{s.label}</span>
              </Spotlight>
            </Reveal>
          ))}

          <Reveal onLoad className="tile tile-marquee" delay={300}>
            <div className="marquee" aria-label="Technologies I use">
              <div className="marquee-track">
                {[...marquee, ...marquee].map((m, i) => (
                  <span key={i} aria-hidden={i >= marquee.length ? true : undefined}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- Experience ---------- */}
        <section id="experience" className="section">
          <SectionHead index="01" kicker="experience" title="Where I've been building." note="Pick a company to see what I built there." />
          <Reveal>
            <ExperienceTabs jobs={experience} />
          </Reveal>
          <Reveal className="edu-line">
            <span className="mono-label">Education</span>
            <span>
              {education.degree} · {education.school} · {education.period} · GPA {education.gpa}
            </span>
          </Reveal>
        </section>

        {/* ---------- Personal projects ---------- */}
        <section id="projects" className="section">
          <SectionHead index="02" kicker="personal projects" title="Things I've built on my own." note="Scroll through, then open any case study." />
          <ProjectStack projects={projects} />

          <Reveal className="more">
            <p className="mono-label">More on GitHub</p>
            <div className="more-cards">
              {moreProjects.map((m) => (
                <Spotlight key={m.title} className="more-card">
                  <a href={m.href} target="_blank" rel="noreferrer">
                    <small>{m.meta}</small>
                    <b className="serif">{m.title}</b>
                    <span>{m.text}</span>
                  </a>
                </Spotlight>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ---------- Toolkit ---------- */}
        <section id="toolkit" className="section">
          <SectionHead index="03" kicker="toolkit" title="What I work with." />
          <div className="toolkit">
            {skills.map((g, i) => (
              <Reveal key={g.group} className="tile" delay={i * 60}>
                <Spotlight className="tile-inner">
                  <p className="mono-label">{g.group}</p>
                  <div className="chips">
                    {g.items.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="section">
          <Reveal className="contact">
            <p className="mono-label">
              <span className="accent">04</span> / contact
            </p>
            <h2 className="serif">
              Let&apos;s build something <em>together.</em>
            </h2>
            <p>I&apos;m open to full-stack and AI engineering roles. Email is the fastest way to reach me.</p>
            <div className="actions center">
              <Magnetic strength={0.35}>
                <a className="btn btn-solid pill lg" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </Magnetic>
              <CopyEmail email={profile.email} />
            </div>
            <div className="contact-links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={profile.resume} download>
                Résumé ↓
              </a>
            </div>
          </Reveal>
        </section>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="mono-label">Built with Next.js &amp; Motion</span>
        </footer>
      </main>
    </>
  );
}
