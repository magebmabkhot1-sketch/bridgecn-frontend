import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-5xl font-black">404</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">Go home</Link>
    </div>
  );
}
