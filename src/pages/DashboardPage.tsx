import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, MessageCircle, Users, PenSquare, PlusCircle, Search } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    api.get('/students?limit=3').then((r) => setStudents(r.data.students));
    api.get('/events').then((r) => setEvents(r.data.events.slice(0, 3)));
    api.get('/messages/conversations').then((r) => setMessages(r.data.conversations));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">Welcome back, {user?.fullName}</h1>
          <p className="mt-2 text-slate-600">Your profile is {user?.profileCompletion || 0}% complete.</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500" style={{ width: `${user?.profileCompletion || 0}%` }} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['Edit Profile', PenSquare, '/profile'],
              ['Browse Students', Users, '/students'],
              ['Create Post', PlusCircle, '/feed']
            ].map(([label, Icon, to]) => (
              <Link key={label as string} to={to as string} className="rounded-3xl border border-slate-200 p-5">
                <Icon className="h-6 w-6 text-indigo-600" />
                <div className="mt-3 font-semibold">{label as string}</div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-black">Recommended connections</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {students.map((student) => (
                <div key={student.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <img src={student.avatarUrl || 'https://placehold.co/80x80'} className="h-12 w-12 rounded-full" />
                    <div>
                      <div className="font-semibold">{student.fullName}</div>
                      <div className="text-sm text-slate-500">{student.university?.name || 'University'}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{student.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h3 className="text-xl font-black">Recent messages</h3>
            <div className="mt-4 space-y-3">
              {messages.map((conversation: any) => {
                const other = conversation.participantAId === user?.id ? conversation.participantB : conversation.participantA;
                const latest = conversation.messages?.[0];
                return (
                  <div key={conversation.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="font-semibold">{other.fullName}</div>
                    <div className="text-sm text-slate-500">{latest?.content || 'No messages yet'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h3 className="text-xl font-black">Upcoming events</h3>
            <div className="mt-4 space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" /> {new Date(event.dateTime).toLocaleDateString()}
                  </div>
                  <div className="mt-1 font-semibold">{event.title}</div>
                  <div className="text-sm text-slate-600">{event.location}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
