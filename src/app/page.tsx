import Chrome from "@/components/world/Chrome";
import Cursor from "@/components/world/Cursor";
import SmoothScroll from "@/components/world/SmoothScroll";
import WorldHero from "@/components/world/WorldHero";
import Journey from "@/components/world/Journey";
import HowIGotHere from "@/components/world/HowIGotHere";
import CardBox from "@/components/world/CardBox";
import CaseFiles from "@/components/world/CaseFiles";
import GiftSkills from "@/components/world/GiftSkills";
import Corkboard from "@/components/world/Corkboard";
import KeyboardContact from "@/components/world/KeyboardContact";
import { Mark } from "@/components/world/Marks";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/profile";
import { tools } from "@/data/tools";
import { projects } from "@/data/projects";
import "./world.css";

export default function Home() {
  return (
    <div className="w">
      <Chrome name={profile.name} resume={profile.resume} />
      <Cursor />
      <SmoothScroll />

      <main>
        {/* The hero stays pinned while "How I got here" slides up over it */}
        <div className="hero-stack">
          <div className="hero-pin">
            <WorldHero name={profile.name} avatar={profile.headshot} />
          </div>
          <HowIGotHere
            companies={[
              { name: "J2W", color: "#1f6b4a", initial: "J" },
              { name: "CodingLimits", color: "#24408e", initial: "C" },
              { name: "FMS Solutions", color: "#c26a3a", initial: "F" },
            ]}
          />
        </div>

        <Journey />

        {/* Experience: what I did at each company, as case files */}
        <section id="experience" className="w-section cut">
          <Reveal className="w-head">
            <p className="kicker">On the job</p>
            <h2 className="wide-h">What I built for the companies I worked at.</h2>
            <p className="w-sub">Three companies, six industries, and the projects behind them. Pick a badge.</p>
          </Reveal>
          <CaseFiles />
        </section>

        {/* Work: project box */}
        <section id="work" className="w-section cut">
          <Reveal className="w-head">
            <p className="kicker">Selected work</p>
            <h2 className="wide-h">Things I built, and the numbers behind them.</h2>
            <p className="w-sub">Personal projects, built solo from frontend to deploy. Pick a card from the box.</p>
          </Reveal>
          <CardBox projects={projects} />
        </section>

        {/* Skills: toolkit gift, its own sheet */}
        <section id="skills" className="w-section cut">
          <Reveal className="w-head gift-head">
            <h2>
              Everything I know, <Mark kind="highlight" color="#93c5fd">unwrapped.</Mark>
            </h2>
            <p className="w-sub">{tools.length} tools I use, from the first commit to production.</p>
          </Reveal>
          <GiftSkills />
        </section>

        {/* About */}
        <section id="about" className="w-section cut">
          <Reveal className="statement">
            <p className="kicker">About me</p>
            <p className="statement-text">
              I started out studying <Mark kind="highlight" color="#93c5fd">computer science</Mark>, learning{" "}
              <Mark kind="circle" color="#e5533d">how systems work.</Mark> Then I got curious about{" "}
              <Mark kind="highlight" color="#fde047">why people use them.</Mark> Now I build{" "}
              <Mark kind="underline" color="#1f6b4a">AI products</Mark> end to end, and try to leave code that{" "}
              <Mark kind="highlight" color="#c4b5fd">makes the next developer smile.</Mark>
            </p>
          </Reveal>
          <Corkboard photo={profile.headshot} name={profile.name} />
        </section>

        {/* Contact */}
        <section id="contact" className="w-section sky">
          <div className="sky-clouds" aria-hidden="true" />
          <Reveal className="w-head center">
            <p className="kicker">Contact</p>
            <h2>
              Let&apos;s build something <Mark kind="highlight" color="#fbbf24">useful.</Mark>
            </h2>
            <p className="w-sub">Open to full-stack and AI engineering roles. I reply fast.</p>
          </Reveal>
          <KeyboardContact email={profile.email} linkedin={profile.linkedin} github={profile.github} resume={profile.resume} />
          <footer className="w-footer">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>Built with Next.js &amp; Motion</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
