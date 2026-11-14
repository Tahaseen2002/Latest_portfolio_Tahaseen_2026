import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { education, experience, profile, projects, skills } from "@/data/profile";

// "Dec 2025 – Present" -> "2025–", "May 2024 – Jul 2025" -> "2024"
function startYear(period: string) {
  const year = period.match(/\d{4}/)?.[0] ?? "";
  return /present/i.test(period) ? `${year}–` : year;
}

const ordinals = ["No. 1", "No. 2", "No. 3", "No. 4", "No. 5", "No. 6"];

export default function Home() {
  const [current, ...earlier] = experience;

  return (
    <>
      <Nav name={profile.name} />
      <main id="top" className="container">
        {/* Hero */}
        <section className="hero">
          <Reveal className="hero-figure">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.headshot} alt={`Portrait of ${profile.name}`} />
              <figcaption>
                {profile.name}, {profile.role}.
              </figcaption>
            </figure>
          </Reveal>
          <Reveal className="hero-text" delay={120}>
            <p className="label">Full Stack · AI · Cloud</p>
            <h1 className="serif">
              Building <em>intelligent</em> products, from idea to handover.
            </h1>
            <p className="lead">{profile.intro}</p>
            <p className="status">Open to full-stack &amp; AI engineering roles</p>
            <div className="actions">
              <a className="btn btn-solid" href={`mailto:${profile.email}`}>
                Write to me
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="btn" href={profile.resume} download>
                Résumé
              </a>
            </div>
          </Reveal>
        </section>

        {/* Stats band */}
        <Reveal className="stats">
          {profile.stats.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </Reveal>

        {/* Work */}
        <section id="work" className="section">
          <Reveal>
            <h2 className="section-title serif">The Work</h2>
          </Reveal>

          <Reveal>
            <article className="job">
              <div className="job-meta">
                <p className="job-year">{startYear(current.period)}</p>
                <p className="label">{current.company}</p>
                <p className="label">{current.period}</p>
              </div>
              <div className="job-body">
                <p className="job-role">{current.role}</p>
                <p>{current.intro}</p>
                {current.engagements?.map((e) => (
                  <div className="engagement" key={e.name}>
                    <h3 className="serif">
                      {e.name} <em>· {e.status.toLowerCase()}</em>
                    </h3>
                    <p>{e.summary}</p>
                    {e.points.length > 0 && (
                      <ul className="points">
                        {e.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <p className="tags">{current.stack.join(" · ")}</p>
              </div>
            </article>
          </Reveal>

          <Reveal>
            <blockquote className="pullquote">“{profile.quote}”</blockquote>
          </Reveal>

          {earlier.map((job) => (
            <Reveal key={job.company}>
              <article className="job">
                <div className="job-meta">
                  <p className="job-year">{startYear(job.period)}</p>
                  <p className="label">{job.company}</p>
                  <p className="label">{job.period}</p>
                </div>
                <div className="job-body">
                  <p className="job-role">{job.role}</p>
                  <p>{job.intro}</p>
                  <ul className="points">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <p className="tags">{job.stack.join(" · ")}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        {/* Projects */}
        <section id="projects" className="section">
          <Reveal>
            <h2 className="section-title serif">Selected Projects</h2>
          </Reveal>
          <div className="projects">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="project">
                  <p className="no">{ordinals[i]}</p>
                  <h3 className="serif">{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="points">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <p className="tags">{p.stack.join(" · ")}</p>
                  {p.link && (
                    <a className="more" href={p.link} target="_blank" rel="noreferrer">
                      View project →
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Toolkit & education */}
        <section id="toolkit" className="section">
          <Reveal>
            <h2 className="section-title serif">The Toolkit</h2>
          </Reveal>
          <div className="toolkit">
            <Reveal className="skill-groups">
              {skills.map((g) => (
                <div className="skill-row" key={g.group}>
                  <span className="label">{g.group}</span>
                  <p>{g.items.join(" · ")}</p>
                </div>
              ))}
            </Reveal>
            <Reveal className="edu" delay={120}>
              <p className="label">Education</p>
              <h3 className="serif">{education.degree}</h3>
              <p>{education.school}</p>
              <p>
                {education.period} · GPA {education.gpa}
              </p>
              <p className="label" style={{ marginTop: 16 }}>
                Languages
              </p>
              <p>English · Telugu · Hindi</p>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <Reveal className="contact">
            <h2 className="serif">
              Let&apos;s <em>talk.</em>
            </h2>
            <p>I&apos;m open to full-stack and AI engineering roles. Email is the fastest way to reach me.</p>
            <a className="email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="links">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={profile.resume} download>
                Résumé
              </a>
            </div>
          </Reveal>
        </section>

        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </footer>
      </main>
    </>
  );
}
