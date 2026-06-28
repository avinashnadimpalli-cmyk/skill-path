'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

type WeekPlan = {
  weekNumber: number;
  focus: string;
  skills: string[];
  project: string;
  resourceSearchQuery: string;
};

type ResultData = {
  matchScore: number;
  gaps: string[];
  weeks: WeekPlan[];
};

type SavedRun = {
  targetJob: string;
  createdAt: string;
  matchScore: number;
  gaps: string[];
};

const starterResume = `I have spent the last 5 years building data products and internal tools. My work has included analytics pipelines, BI dashboards, automation, and product-facing reporting. I am strongest in SQL, Python, stakeholder communication, and operational thinking.`;

const pageAccent = 'from-slate-900 to-indigo-700';

export default function Home() {
  const [resume, setResume] = useState(starterResume);
  const [targetJob, setTargetJob] = useState('Data Analyst');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<SavedRun[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedResume = window.localStorage.getItem('skill-path-resume');
    const storedTarget = window.localStorage.getItem('skill-path-target');
    const storedHistory = window.localStorage.getItem('skill-path-history');

    if (storedResume) setResume(storedResume);
    if (storedTarget) setTargetJob(storedTarget);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        window.localStorage.removeItem('skill-path-history');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('skill-path-resume', resume);
    window.localStorage.setItem('skill-path-target', targetJob);
  }, [resume, targetJob]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, targetJob }),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error || 'Network response failed';
        throw new Error(msg);
      }

      setResult(data);
      const nextRun: SavedRun = {
        targetJob,
        createdAt: new Date().toLocaleString(),
        matchScore: data.matchScore,
        gaps: data.gaps,
      };
      setHistory((prev) => {
        const updated = [nextRun, ...prev].slice(0, 4);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('skill-path-history', JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Could not reach the AI skill engine';
      alert(message || 'Failed to connect to Gemini API. Make sure your .env.local file has your key!');
    }

    setLoading(false);
  };

  const scoreTone = useMemo(() => {
    if (!result) return 'text-slate-700';
    if (result.matchScore >= 70) return 'text-emerald-600';
    if (result.matchScore >= 45) return 'text-amber-600';
    return 'text-rose-600';
  }, [result]);

  return (
    <main className="space-y-6">
      <section className={`relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br ${pageAccent} p-8 text-white shadow-[0_24px_90px_-24px_rgba(15,23,42,0.75)]`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-orb absolute -left-10 top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="ambient-orb absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-indigo-300/10 blur-3xl" />
        </div>
        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              Career Copilot • AI career planning
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn your experience into a clear plan for your next role.
            </h1>
            <p className="max-w-xl text-base text-slate-200 sm:text-lg">
              Paste your background, choose the role, and get a practical roadmap with the skills, projects, and next steps that actually matter.
            </p>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {['Share your background', 'Pick the target role', 'Get a focused plan'].map((step) => (
                <div key={step} className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-slate-100 backdrop-blur">
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm text-slate-100 backdrop-blur">
            <p className="font-medium text-white">What you will receive</p>
            <ul className="mt-3 space-y-2 text-slate-200">
              <li>• A realistic fit score for the target role</li>
              <li>• The strongest blockers to address first</li>
              <li>• A short 4-week action plan with real projects</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Build your plan</p>
              <h2 className="text-2xl font-semibold text-slate-950">Tell us where you are headed</h2>
            </div>
            <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              Step 1 of 2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target role</label>
              <input
                type="text"
                required
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="Analytics Engineer"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Your background</label>
              <textarea
                required
                rows={10}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your experience, wins, and current context here."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'Analyzing your profile…' : 'Generate my plan'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Recent plans</p>
              <span className="text-sm text-slate-500">Saved on this device</span>
            </div>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your saved plans will appear here after you generate one.
                </p>
              ) : (
                history.map((item, index) => (
                  <div key={`${item.targetJob}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">{item.targetJob}</p>
                      <span className="text-sm font-medium text-slate-600">{item.matchScore}%</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.gaps[0] ?? 'Clear next move ready'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {result ? (
        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Fit score</p>
            <div className={`mt-4 text-5xl font-semibold ${scoreTone}`}>{result.matchScore}%</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This reflects how well your current profile aligns with {targetJob}, based on the background you shared.
            </p>
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Main blockers</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.gaps.map((gap) => (
                  <li key={gap} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {result.weeks.map((week) => (
              <div key={week.weekNumber} className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-600">Week {week.weekNumber}</p>
                    <h3 className="text-xl font-semibold text-slate-950">{week.focus}</h3>
                  </div>
                  <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                    Focus sprint
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {week.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Project</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{week.project}</p>
                </div>

                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(week.resourceSearchQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-700"
                >
                  Explore learning resources →
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[30px] border border-slate-200/70 bg-white/80 p-8 text-center shadow-[0_18px_50px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <p className="text-lg font-semibold text-slate-900">Your plan will appear here once you generate it.</p>
          <p className="mt-2 text-sm text-slate-600">Use the form above to turn your background into a role-specific action plan.</p>
        </section>
      )}
    </main>
  );
}
