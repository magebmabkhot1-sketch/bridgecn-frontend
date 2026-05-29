import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    universityId: null as string | null,
    yearOfStudy: 'Freshman',
    bio: '',
    interests: [] as string[],
    avatarUrl: '',
    language: 'en' as 'en' | 'zh'
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        universityId: user.universityId || null,
        yearOfStudy: user.yearOfStudy || 'Freshman',
        bio: user.bio || '',
        interests: Array.isArray(user.interestsJson) ? user.interestsJson : [],
        avatarUrl: user.avatarUrl || '',
        language: user.language || 'en'
      });
    }
  }, [user]);

  const save = async () => {
    await api.put('/auth/profile', { ...form, avatarUrl: form.avatarUrl || null });
    await refreshMe();
    alert('Profile saved');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Profile</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="Avatar URL" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })} />
          <textarea className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as 'en' | 'zh' })} />
        </div>
        <button onClick={save} className="mt-6 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">Save changes</button>
      </div>
    </div>
  );
}
