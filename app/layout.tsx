import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Copilot",
  description: "A clear career-planning workspace for role transitions and tailored positioning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-900">
        <header className="border-b border-white/10 bg-slate-950/70 px-6 py-4 text-slate-100 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold tracking-tight">Career Copilot</p>
              <p className="text-sm text-slate-400">A clearer way to shape what comes next.</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <a href="/" className="rounded-full px-3 py-2 transition hover:bg-white/10">Plan</a>
              <a href="/tailor" className="rounded-full px-3 py-2 transition hover:bg-white/10">Resume</a>
              <a href="/profile" className="rounded-full px-3 py-2 transition hover:bg-white/10">Profile</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
