'use client';

import { useEffect, useState } from 'react';

type ProfileState = {
  name: string;
  headline: string;
  location: string;
  years: string;
  focus: string;
};

const defaultProfile: ProfileState = {
  name: 'Alex Rivera',
  headline: 'Strategic operator who builds clarity from complexity',
  location: 'Remote • London',
  years: '6 years',
  focus: 'Analytics, product strategy, and growth systems',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('skill-path-profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem('skill-path-profile');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('skill-path-profile', JSON.stringify(profile));
  }, [profile]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Career profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Keep your identity clear and easy to understand.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This helps the app frame your experience in a way that feels consistent and relevant to the roles you want.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Headline</label>
            <input
              value={profile.headline}
              onChange={(e) => setProfile((prev) => ({ ...prev, headline: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
            <input
              value={profile.location}
              onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Years of experience</label>
            <input
              value={profile.years}
              onChange={(e) => setProfile((prev) => ({ ...prev, years: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current focus</label>
            <textarea
              rows={4}
              value={profile.focus}
              onChange={(e) => setProfile((prev) => ({ ...prev, focus: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Profile snapshot</p>
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{profile.name}</p>
          <p className="mt-4 text-sm text-slate-600">{profile.headline}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-1 font-medium text-slate-900">{profile.location}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Experience</p>
              <p className="mt-1 font-medium text-slate-900">{profile.years}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Focus</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{profile.focus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
