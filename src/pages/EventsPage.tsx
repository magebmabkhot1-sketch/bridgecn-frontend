import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, MapPin, Users } from 'lucide-react';

export function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', dateTime: '', location: '', universityId: '' });

  const load = async () => {
    const { data } = await api.get('/events');
    setEvents(data.events);
  };

  useEffect(() => { load(); }, []);

  const rsvp = async (id: string, status: 'GOING' | 'INTERESTED' | 'NOT_GOING') => {
    await api.post(`/events/${id}/rsvp`, { status });
    load();
  };

  const createEvent = async () => {
    await api.post('/events', { ...form, dateTime: new Date(form.dateTime).toISOString() });
    setForm({ title: '', description: '', dateTime: '', location: '', universityId: '' });
    load();
  };

  const grouped = events.reduce((acc: Record<string, any[]>, event) => {
    const key = new Date(event.dateTime).toDateString();
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-black">Events</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-3 text-center text-sm text-slate-600">{i + 1}</div>
              ))}
            </div>
          </div>

          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="rounded-[2rem] bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black">{date}</h2>
              <div className="mt-4 space-y-4">
                {items.map((event: any) => (
                  <div key={event.id} className="rounded-3xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold">{event.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" /> {new Date(event.dateTime).toLocaleTimeString()}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {event.location}</div>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 flex items-center gap-1">
                        <Users className="h-3 w-3" /> {event.attendeesCount}
                      </div>
                    </div>
                    <p className="mt-3 text-slate-600">{event.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => rsvp(event.id, 'GOING')} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">Going</button>
                      <button onClick={() => rsvp(event.id, 'INTERESTED')} className="rounded-full border border-slate-200 px-4 py-2 text-sm">Interested</button>
                      <button onClick={() => rsvp(event.id, 'NOT_GOING')} className="rounded-full border border-slate-200 px-4 py-2 text-sm">Not going</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {user?.role === 'ORGANIZER' || user?.role === 'ADMIN' ? (
          <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black">Create event</h2>
            <div className="mt-4 grid gap-3">
              <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3" type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} />
              <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <button onClick={createEvent} className="rounded-full bg-slate-900 px-4 py-3 font-semibold text-white">Publish</button>
            </div>
          </aside>
        ) : (
          <aside className="rounded-[2rem] bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black">Organizer access</h2>
            <p className="mt-2 text-slate-600">Organizers can publish campus events and manage RSVPs.</p>
          </aside>
        )}
      </div>
    </div>
  );
}
