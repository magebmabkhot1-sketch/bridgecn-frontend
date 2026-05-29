import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const universities = [
  { id: '', name: 'All universities' },
  { id: 'zhejiang-university', name: 'Zhejiang University' },
  { id: 'tsinghua-university', name: 'Tsinghua University' },
  { id: 'fudan-university', name: 'Fudan University' }
];

const years = ['All years', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const languages = ['All languages', 'en', 'zh'];

export function BrowseStudentsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ universityId: '', yearOfStudy: '', interest: '', language: '' });
  const [students, setStudents] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (nextPage = 1) => {
    const { data } = await api.get('/students', { params: { ...filters, page: nextPage, limit: 8 } });
    setStudents(data.students);
    setPage(data.page);
    setPages(data.pages);
  };

  useEffect(() => { load(1); }, []);
  useEffect(() => { load(1); }, [filters]);

  const connect = async (id: string) => {
    if (!user) return;
    await api.post(`/students/${id}/connect`);
    alert('Conversation started');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2 text-lg font-black"><Search className="h-5 w-5" /> Filters</div>
          <div className="mt-4 grid gap-4">
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.universityId} onChange={(e) => setFilters({ ...filters, universityId: e.target.value })}>
              {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.yearOfStudy} onChange={(e) => setFilters({ ...filters, yearOfStudy: e.target.value })}>
              {years.map((y) => <option key={y} value={y === 'All years' ? '' : y}>{y}</option>)}
            </select>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Interest, e.g. AI" value={filters.interest} onChange={(e) => setFilters({ ...filters, interest: e.target.value })} />
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
              {languages.map((l) => <option key={l} value={l === 'All languages' ? '' : l}>{l}</option>)}
            </select>
          </div>
        </aside>

        <section>
          <h1 className="text-3xl font-black">Browse students</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => (
              <div key={student.id} className="rounded-[2rem] bg-white p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <img src={student.avatarUrl || 'https://placehold.co/80x80'} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{student.fullName}</div>
                    <div className="text-sm text-slate-500">{student.university?.name || 'University'} · {student.yearOfStudy}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">{student.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(student.interestsJson) ? student.interestsJson : []).map((item: string) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{item}</span>
                  ))}
                </div>
                <button onClick={() => connect(student.id)} className="mt-5 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                  Connect
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button disabled={page <= 1} onClick={() => load(page - 1)} className="rounded-full border border-slate-200 px-4 py-2 disabled:opacity-50">Prev</button>
            <span className="text-sm text-slate-500">{page} / {pages}</span>
            <button disabled={page >= pages} onClick={() => load(page + 1)} className="rounded-full border border-slate-200 px-4 py-2 disabled:opacity-50">Next</button>
          </div>
        </section>
      </div>
    </div>
  );
}
