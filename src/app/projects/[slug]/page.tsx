import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import CaseToc, { type TocItem } from "@/components/CaseToc";
import ThemeToggle from "@/components/ThemeToggle";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import { buildSections, getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";

// Dashed "todo" notes show only while developing locally
const drafts = process.env.NODE_ENV !== "production";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} · Case study · ${profile.name}`, description: p.summary };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const sections = buildSections(p, drafts);
  const toc: TocItem[] = sections.flatMap((s) => [
    { id: s.id, title: s.title },
    ...s.subs.map((u) => ({ id: u.id, title: u.title, sub: true })),
  ]);
  const next = projects[(projects.indexOf(p) + 1) % projects.length];

  return (
    <>
      <header className="topbar scrolled">
        <ReadingProgress />
        <div className="container topbar-inner">
          <Link href="/#projects" className="case-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            All projects
          </Link>
          <Link href="/" className="brand case-name">
            <span className="brand-dot" aria-hidden="true" />
            <span className="serif">{profile.name}</span>
          </Link>
          <div className="topbar-right">
            <Link href={`/projects/${next.slug}`} className="case-next">
              Next: {next.title} →
            </Link>
            <ThemeToggle className="theme-toggle inline" />
          </div>
        </div>
      </header>

      <main className="container page">
        <section className="case-hero">
          <p className="mono-label">
            <span className="accent">case study</span> / {p.tag}
          </p>
          <h1 className="serif">{p.title}</h1>
          <p className="case-summary">{p.summary}</p>
          <div className="actions">
            {p.live && (
              <a className="btn btn-solid pill" href={p.live} target="_blank" rel="noreferrer">
                Live demo ↗
              </a>
            )}
            <a className="btn btn-ghost pill" href={p.code} target="_blank" rel="noreferrer">
              View code ↗
            </a>
            {p.docs && (
              <a className="btn btn-ghost pill" href={p.docs} target="_blank" rel="noreferrer">
                API docs ↗
              </a>
            )}
          </div>
        </section>

        <dl className="case-facts">
          <div>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{p.type}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{p.status}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{p.stack}</dd>
          </div>
        </dl>

        <Reveal className="case-cover">
          <Cover kind={p.slug} image={p.image} wide />
        </Reveal>

        <div className="case-layout">
          <CaseToc items={toc} />

          <article className="case-body">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="case-section">
                <p className="mono-label case-num">{s.num}</p>
                <h2 className="serif">{s.title}</h2>
                {s.paras?.map((t) => <p key={t}>{t}</p>)}
                {!!s.bullets?.length && (
                  <ul className="points">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {!!s.cards?.length && (
                  <div className="ai-cards">
                    {s.cards.map((c) => (
                      <div key={c.title}>
                        <b>{c.title}</b>
                        <span>{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!!s.flow?.length && (
                  <ol className="flow">
                    {s.flow.map((f, i) => (
                      <li key={f}>
                        <span className="step">
                          <b>{i + 1}</b>
                          {f}
                        </span>
                        {i < s.flow!.length - 1 && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {s.subs.map((u) => (
                  <div key={u.id} id={u.id} className="case-sub">
                    <h3>{u.title}</h3>
                    {u.paras?.map((t) => <p key={t}>{t}</p>)}
                    {!!u.bullets?.length && (
                      <ul className="points">
                        {u.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {drafts && u.todo && <p className="draft">{u.todo}</p>}
                  </div>
                ))}
                {drafts && s.todo && <p className="draft">{s.todo}</p>}
              </section>
            ))}

            <div className="case-end">
              <Link href="/#projects">← Back to all projects</Link>
              <Link href={`/projects/${next.slug}`} className="btn btn-solid pill">
                Next case study: {next.title}
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
