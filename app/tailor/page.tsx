'use client';

import { useEffect, useMemo, useState } from 'react';

const defaultProfile = {
  role: 'Product Analyst',
  strength: 'I turn messy data into decisions with strong storytelling.',
  voice: 'clear, concise, and evidence-led',
};

export default function TailorPage() {
  const [role, setRole] = useState(defaultProfile.role);
  const [strength, setStrength] = useState(defaultProfile.strength);
  const [voice, setVoice] = useState(defaultProfile.voice);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('skill-path-tailor');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRole(parsed.role || defaultProfile.role);
        setStrength(parsed.strength || defaultProfile.strength);
        setVoice(parsed.voice || defaultProfile.voice);
        setDraft(parsed.draft || '');
      } catch {
        window.localStorage.removeItem('skill-path-tailor');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('skill-path-tailor', JSON.stringify({ role, strength, voice, draft }));
  }, [draft, role, strength, voice]);

  const preview = useMemo(() => {
    if (!role && !strength) return 'Add a role and your strongest signal to generate your first tailored pitch.';
    return `For ${role || 'your target role'}, lead with ${strength || 'your edge'} and keep your tone ${voice || 'clear and confident'}. Focus on outcomes, evidence, and a crisp narrative around the problem you solved.`;
  }, [role, strength, voice]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Tailor your story</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Make your experience sound intentional.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This space turns your background into a sharper positioning statement for a specific role.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Your strongest signal</label>
            <textarea
              rows={4}
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tone</label>
            <input
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Live draft</p>
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {preview}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Notes</p>
          <textarea
            rows={8}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Capture bullets, story beats, and talking points here."
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
          />
        </div>
      </div>
    </div>
  );
}
