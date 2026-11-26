import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bitter, Figtree } from "next/font/google";
import "./tokens.css";
import "./globals.css";

// Mark's "Sketchbook" design system: Figtree for headings and UI, Bitter for reading.
// next/font downloads these at build time and serves them from this app,
// so visitors' browsers never contact Google.
const figtree = Figtree({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-figtree" });
const bitter = Bitter({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-bitter" });

export const metadata: Metadata = {
  title: "Open Incidents · PagerDuty + Next.js",
  description: "A small Next.js + TypeScript app that lists open PagerDuty incidents.",
};

// Same as the portfolio: apply dark mode before the page paints, based on a saved
// choice or the system setting, to avoid a flash of light mode.
const themeScript = `(function(){var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${bitter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
