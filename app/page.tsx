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

const focusCopy: Record<string, { label: string; blurb: string; accent: string }> = {
  ops: { label: 'Operational leverage', blurb: 'You want your work to scale, not just look impressive.', accent: 'from-slate-900 to-indigo-700' },
  product: { label: 'Product storytelling', blurb: 'You are shaping how your work is understood and adopted.', accent: 'from-indigo-700 to-violet-700' },
  growth: { label: 'Growth positioning', blurb: 'You need a sharper market signal and stronger narrative.', accent: 'from-emerald-700 to-cyan-700' },
  tech: { label: 'Technical depth', blurb: 'You want the craft behind the work to feel undeniable.', accent: 'from-amber-700 to-rose-700' },
};

export default function Home() {
  const [resume, setResume] = useState(starterResume);
  const [targetJob, setTargetJob] = useState('Data Analyst');
  const [focus, setFocus] = useState('ops');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<SavedRun[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedResume = window.localStorage.getItem('skill-path-resume');
    const storedTarget = window.localStorage.getItem('skill-path-target');
    const storedFocus = window.localStorage.getItem('skill-path-focus');
    const storedHistory = window.localStorage.getItem('skill-path-history');

    if (storedResume) setResume(storedResume);
    if (storedTarget) setTargetJob(storedTarget);
    if (storedFocus) setFocus(storedFocus);
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
    window.localStorage.setItem('skill-path-focus', focus);
  }, [focus, resume, targetJob]);

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

  const activeFocus = focusCopy[focus] ?? focusCopy.ops;

  return (
    <main className="space-y-6">
      <section className={`relative overflow-hidden rounded-[36px] border border-slate-200 bg-gradient-to-br ${activeFocus.accent} p-8 text-white shadow-[0_24px_90px_-24px_rgba(15,23,42,0.75)]`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-orb absolute -left-10 top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="ambient-orb absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-indigo-300/10 blur-3xl" />
          <div className="absolute left-8 top-1/2 h-px w-24 -translate-y-1/2 bg-white/20" />
        </div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              Skill Path Studio • deliberate growth
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Turn your experience into a path that feels lived-in, not templated.
            </h1>
            <p className="max-w-xl text-base text-slate-200 sm:text-lg">
              This is where your background gets translated into a sharper role narrative, a focused skill map, and a short sprint you can actually ship.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-sm text-slate-100 backdrop-blur">
            <p className="font-medium text-white">Current focus</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold">{result?.matchScore ?? 72}%</p>
                <p className="text-slate-300">positioning signal</p>
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em]">
                {activeFocus.label}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Signal scan</p>
              <h2 className="text-2xl font-semibold text-slate-950">Frame the role you are aiming for</h2>
            </div>
            <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              Step 1 / 2
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
              <label className="mb-1 block text-sm font-medium text-slate-700">What is the pressure point?</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white"
              >
                <option value="ops">Operational leverage</option>
                <option value="product">Product storytelling</option>
                <option value="growth">Growth positioning</option>
                <option value="tech">Technical depth</option>
              </select>
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
              {loading ? 'Reading your signal…' : 'Generate my path'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">The lens</p>
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{activeFocus.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{activeFocus.blurb}</p>
            </div>
          </div>

          <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Recent attempts</p>
              <span className="text-sm text-slate-500">Saved locally</span>
            </div>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Your last scans will appear here once you generate a plan.
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

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Observe', 'You bring the messy reality of your work and the role you want to reach.'],
          ['Translate', 'The studio turns that into the right framing, gaps, and story beats.'],
          ['Ship', 'You leave with a short path you can actually build over the next few weeks.'],
        ].map(([title, body]) => (
          <div key={title} className="card-hover rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </div>
        ))}
      </section>

      {result ? (
        <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="card-hover rounded-[30px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Positioning readout</p>
            <div className={`mt-4 text-5xl font-semibold ${scoreTone}`}>{result.matchScore}%</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This score reflects how closely your current profile aligns with {targetJob} expectations, based on the experience you shared.
            </p>
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Constraint map</p>
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
                    Build sprint
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
                  Follow the trail of learning resources →
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
