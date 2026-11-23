import Chrome from "@/components/world/Chrome";
import WorldHero from "@/components/world/WorldHero";
import Journey from "@/components/world/Journey";
import HowIGotHere from "@/components/world/HowIGotHere";
import CardBox from "@/components/world/CardBox";
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

        {/* Work: project box + toolkit gift */}
        <section id="work" className="w-section paper-bg torn">
          <Reveal className="w-head">
            <p className="kicker">Selected work</p>
            <h2>
              Things I built, from <Mark kind="underline" color="#e5533d">frontend to deploy.</Mark>
            </h2>
            <p className="w-sub">Personal projects, each built solo. Pick a card from the box.</p>
          </Reveal>
          <CardBox projects={projects} />

          <Reveal className="w-head gift-head">
            <h2>
              Everything I know, <Mark kind="highlight" color="#93c5fd">unwrapped.</Mark>
            </h2>
            <p className="w-sub">{tools.length} tools I use, from the first commit to production.</p>
          </Reveal>
          <GiftSkills />
        </section>

        {/* About */}
        <section id="about" className="w-section torn">
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
