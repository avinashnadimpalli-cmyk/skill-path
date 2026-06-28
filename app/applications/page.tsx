'use client';

import { useEffect, useState } from 'react';

type ApplicationItem = {
  company: string;
  role: string;
  status: 'Draft' | 'Applied' | 'Interview' | 'Offer';
};

const starterApplications: ApplicationItem[] = [
  { company: 'Northstar Labs', role: 'Product Analyst', status: 'Applied' },
  { company: 'Elevate AI', role: 'Data Operations Lead', status: 'Interview' },
];

export default function ApplicationsPage() {
  const [items, setItems] = useState<ApplicationItem[]>(starterApplications);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<ApplicationItem['status']>('Draft');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('skill-path-applications');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem('skill-path-applications');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('skill-path-applications', JSON.stringify(items));
  }, [items]);

  const addApplication = () => {
    if (!company || !role) return;
    setItems((prev) => [{ company, role, status }, ...prev]);
    setCompany('');
    setRole('');
    setStatus('Draft');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Opportunity tracker</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Keep your applications moving.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Track each role clearly so the process feels manageable and your momentum stays visible.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationItem['status'])}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            >
              <option value="Draft">Draft</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
            </select>
          </div>
          <button
            onClick={addApplication}
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Add to tracker
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.company}-${index}`} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">{item.role}</p>
                <p className="text-sm text-slate-600">{item.company}</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
