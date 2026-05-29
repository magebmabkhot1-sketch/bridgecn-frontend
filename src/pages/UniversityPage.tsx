import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { University } from '../types';
import { motion } from 'framer-motion';
import { CalendarDays, Users, ArrowRight } from 'lucide-react';

export function UniversityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University & { students: any[]; events: any[] } | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/universities/${slug}`).then((res) => setUniversity(res.data.university)).catch(() => setUniversity(null));
  }, [slug]);

  if (!university) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-slate-600">Loading university...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <img
              src={university.logoUrl || 'https://placehold.co/120x120?text=Uni'}
              alt={university.name}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div>
              <h1 className="text-4xl font-black text-slate-900">{university.name}</h1>
              <p className="mt-1 text-slate-500">{university.city}</p>
              <p className="mt-3 max-w-2xl text-slate-600">{university.description}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Join university <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Student count', university.studentsCount],
            ['Active users', university.activeUsers],
            ['Events this month', university.eventsThisMonth]
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-3xl border border-slate-200 p-5">
              <div className="text-sm text-slate-500">{label as string}</div>
              <div className="mt-2 text-3xl font-black">{value as number}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-black">Featured students</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {university.students.map((student) => (
              <div key={student.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <img src={student.avatarUrl || 'https://placehold.co/80x80'} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{student.fullName}</div>
                    <div className="text-sm text-slate-500">{student.yearOfStudy}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{student.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-black">Upcoming events</h2>
          <div className="mt-6 space-y-4">
            {university.events.map((event) => (
              <div key={event.id} className="flex items-start gap-4 rounded-3xl border border-slate-200 p-4">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm text-slate-500">{new Date(event.dateTime).toLocaleString()}</div>
                  <div className="mt-1 text-sm text-slate-600">{event.location}</div>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.attendeesCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
