import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/Icons";
import { education, experience, profile, projects, skills } from "@/data/profile";

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="section-head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
    </Reveal>
  );
}

export default function Home() {
  const [first, last] = profile.name.split(" ");

  return (
    <>
      <Nav />
      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="container hero-grid">
            <Reveal>
              <span className="eyebrow">
                <span className="dot" /> Open to new opportunities
              </span>
              <h1>
                Hi, I&apos;m {first} <em>{last}</em>
              </h1>
              <p className="role">{profile.role} · AI &amp; Cloud</p>
              <p className="lead">{profile.tagline}</p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  Get in touch <ArrowIcon size={16} />
                </a>
                <a href={profile.resume} className="btn" download>
                  <DownloadIcon size={16} /> Resume
                </a>
              </div>
              <div className="socials">
                <a className="icon-btn" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GitHubIcon />
                </a>
                <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a className="icon-btn" href={`mailto:${profile.email}`} aria-label="Email">
                  <MailIcon />
                </a>
              </div>
            </Reveal>

            <Reveal delay={150} className="portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.headshot} alt={`Portrait of ${profile.name}`} />
              <div className="badge">
                <strong>Currently @ J2W</strong>
                <span>Building an Assessment AI portal</span>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="container">
          <Reveal className="stats">
            {profile.stats.map((s) => (
              <div className="stat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </Reveal>

          {/* About */}
          <section id="about" className="section">
            <SectionHead kicker="About" title="Engineer who ships, end to end." />
            <div className="about-grid">
              <Reveal>
                {profile.summary.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}
              </Reveal>
              <Reveal delay={120} className="card edu">
                <div className="section-head" style={{ marginBottom: 12 }}>
                  <div className="kicker">Education</div>
                </div>
                <h3>{education.degree}</h3>
                <p className="meta">{education.school}</p>
                <p className="meta">{education.period}</p>
                <span className="chip gpa">GPA {education.gpa}</span>
                <div className="section-head" style={{ margin: "24px 0 8px" }}>
                  <div className="kicker">Languages</div>
                </div>
                <p className="meta">English · Telugu · Hindi</p>
              </Reveal>
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="section">
            <SectionHead kicker="Experience" title="Where I've been building." />
            <div className="timeline">
              {experience.map((job, i) => (
                <Reveal key={job.company} delay={i * 80}>
                  <article className="job">
                    <div className="job-when">
                      <div className="period">{job.period}</div>
                      <div className="company">{job.company}</div>
                    </div>
                    <div className="card">
                      <h3>
                        {job.role} <span className="at">@ {job.company}</span>
                      </h3>
                      <p className="intro">{job.intro}</p>
                      {job.highlights.length > 0 && (
                        <ul>
                          {job.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                      {job.engagements?.map((e) => (
                        <div className="engagement" key={e.name}>
                          <div className="engagement-head">
                            <h4>{e.name}</h4>
                            <span className={`status ${e.status === "Current" ? "live" : ""}`}>{e.status}</span>
                          </div>
                          <p>{e.summary}</p>
                          {e.points.length > 0 && (
                            <ul>
                              {e.points.map((pt) => (
                                <li key={pt}>{pt}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      <div className="chips">
                        {job.stack.map((s) => (
                          <span className="chip" key={s}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="section">
            <SectionHead kicker="Projects" title="Things I've made." />
            <div className="projects">
              {projects.map((p, i) => (
                <Reveal key={p.title} delay={i * 80} className="card project">
                  <div className="project-top">
                    <h3>{p.title}</h3>
                    {p.link && (
                      <a className="icon-btn" href={p.link} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}>
                        <ArrowIcon size={16} />
                      </a>
                    )}
                  </div>
                  <p>{p.description}</p>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="chips">
                    {p.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="section">
            <SectionHead kicker="Skills" title="My toolkit." />
            <div className="skills">
              {skills.map((g, i) => (
                <Reveal key={g.group} delay={i * 60} className="card">
                  <h3>{g.group}</h3>
                  <div className="chips">
                    {g.items.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact">
            <Reveal className="contact">
              <h2>Let&apos;s build something.</h2>
              <p>
                I&apos;m open to full-stack and AI engineering roles. The fastest way to reach me is email.
              </p>
              <div className="contact-actions">
                <a className="btn" href={`mailto:${profile.email}`}>
                  <MailIcon size={16} /> {profile.email}
                </a>
                <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noreferrer">
                  <LinkedInIcon size={16} /> LinkedIn
                </a>
                <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">
                  <GitHubIcon size={16} /> GitHub
                </a>
              </div>
            </Reveal>
          </section>

          <footer className="footer">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>Built with Next.js</span>
          </footer>
        </div>
      </main>
    </>
  );
}
