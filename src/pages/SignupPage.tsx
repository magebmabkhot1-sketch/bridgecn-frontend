import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const universities = ['', 'zhejiang-university', 'tsinghua-university', 'fudan-university', 'Other'];
const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const interests = ['Language Exchange', 'AI', 'Sports', 'Design', 'Startups', 'Events', 'Music', 'Photography'];

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    universityId: '',
    studentType: 'CHINESE',
    yearOfStudy: 'Freshman',
    interests: [] as string[],
    bio: '',
    avatarUrl: '',
    language: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter((x) => x !== interest) : [...prev.interests, interest]
    }));
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', {
        ...form,
        universityId: form.universityId || null,
        avatarUrl: form.avatarUrl || null
      });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Create account</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })}>
            {universities.map((u) => <option key={u} value={u}>{u ? (u === 'zhejiang-university' ? 'Zhejiang University' : u === 'tsinghua-university' ? 'Tsinghua University' : u === 'fudan-university' ? 'Fudan University' : u) : 'Select university'}</option>)}
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.studentType} onChange={(e) => setForm({ ...form, studentType: e.target.value })}>
            <option value="CHINESE">Chinese Student</option>
            <option value="INTERNATIONAL">International Student</option>
          </select>
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
          <input className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
          <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-slate-700">Interests and skills</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button key={interest} type="button" onClick={() => toggle(interest)}
                  className={`rounded-full border px-3 py-2 text-sm ${form.interests.includes(interest) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}>
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error && <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-rose-700">{error}</div>}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <div className="mt-4 text-sm text-slate-500">
          Already have an account? <Link className="text-indigo-600" to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
