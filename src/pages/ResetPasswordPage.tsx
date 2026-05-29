import { useState } from 'react';
import { api } from '../lib/api';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const requestToken = async () => {
    const { data } = await api.post('/auth/forgot-password', { email });
    setToken(data.resetToken || '');
    setMessage('Reset token generated locally. Copy it below.');
  };

  const reset = async () => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    setMessage(data.message);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Reset password</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={requestToken} className="rounded-full border border-slate-200 px-4 py-3 font-medium">Get reset token</button>
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} />
          <input type="password" className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={reset} className="rounded-full bg-slate-900 px-4 py-3 font-medium text-white">Reset password</button>
        </div>
        {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-3 text-emerald-700">{message}</div>}
      </div>
    </div>
  );
}
