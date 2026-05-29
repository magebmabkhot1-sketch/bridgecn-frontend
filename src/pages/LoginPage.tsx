import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('demo@bridgecn.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Login</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Email</span>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Password</span>
            <input type="password" className="rounded-2xl border border-slate-200 px-4 py-3" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        {error && <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-rose-700">{error}</div>}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="mt-4 flex justify-between text-sm text-slate-500">
          <Link to="/signup">Create account</Link>
          <Link to="/reset-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}
