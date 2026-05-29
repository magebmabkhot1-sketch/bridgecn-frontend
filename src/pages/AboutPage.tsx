import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, MessageCircle, CalendarDays, Users, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  ['Verified Profiles', 'Every profile is tied to a campus and student details.', ShieldCheck],
  ['Smart Matching', 'Find students with matching goals, interests, and language needs.', Search],
  ['Events', 'Discover mixers, talks, and workshops near you.', CalendarDays],
  ['Messaging', 'Start conversations and stay connected in real time.', MessageCircle]
];

const testimonials = [
  ['BridgeCN made it easy to find local friends and study partners.', 'Alex, Graduate Student'],
  ['The university network feels focused and trustworthy.', 'Li, Undergraduate'],
  ['Events and chats help me feel at home in China.', 'Sara, Exchange Student']
];

const faqs = [
  ['Who can join BridgeCN?', 'Chinese and international university students in China.'],
  ['Is the network verified?', 'Yes, profiles are designed around university and student verification.'],
  ['Can organizers create events?', 'Yes, organizers can publish events and manage RSVPs.']
];

export function AboutPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">About BridgeCN</p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">A student network built for connection, trust, and opportunity.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Our mission is to help students in China form meaningful friendships, find collaborators, and join campus life without language barriers getting in the way.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ['Step 1', 'Create a verified profile'],
            ['Step 2', 'Get matched by interests and language'],
            ['Step 3', 'Join events and start conversations']
          ].map(([title, desc], idx) => (
            <div key={title} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">{idx + 1}</div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {features.map(([title, desc, Icon]) => (
          <div key={title as string} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <Icon className="h-6 w-6 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold">{title as string}</h3>
            <p className="mt-2 text-slate-600">{desc as string}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-[2rem] bg-slate-900 p-8 text-white">
        <h2 className="text-3xl font-black">What students say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, author]) => (
            <div key={author} className="rounded-3xl bg-white/10 p-5">
              <p className="leading-7 text-white/85">“{quote}”</p>
              <div className="mt-4 text-sm font-semibold text-cyan-300">{author}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-black">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faqs.map(([q, a], idx) => (
            <button
              key={q}
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full rounded-2xl border border-slate-200 p-5 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">{q}</span>
                <span>{open === idx ? '−' : '+'}</span>
              </div>
              {open === idx && <p className="mt-3 text-slate-600">{a}</p>}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black">Ready to join the network?</h2>
          <p className="mt-2 text-white/90">Create your profile and start connecting today.</p>
        </div>
        <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900">
          Join BridgeCN <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
