import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import DesignSwitcher from "@/components/DesignSwitcher";
import "./globals.css";
import "./designs.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// Fonts used by the alternative design options (see designs.css)
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: [profile.headshot],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1220" },
  ],
};

// Applies the saved theme and design option before paint to avoid a flash.
// Design can be forced with ?design=editorial|midnight|swiss|bento
const themeScript = `try{var d=document.documentElement,t=localStorage.getItem('theme');if(t)d.dataset.theme=t;var q=new URLSearchParams(location.search).get('design'),s=q||localStorage.getItem('design');if(s)d.dataset.design=s;if(q)localStorage.setItem('design',q)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [display, sans, grotesk, mono, bricolage].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <DesignSwitcher />
      </body>
    </html>
  );
}
