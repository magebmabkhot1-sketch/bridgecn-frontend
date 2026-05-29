import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Users, Globe2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JoinWaitlistModal } from '../components/JoinWaitlistModal';

const universities = [
  {
    name: 'Zhejiang University',
    slug: 'zhejiang-university',
    city: 'Hangzhou',
    description: 'Innovation, culture, and a vibrant student life.'
  },
  {
    name: 'Tsinghua University',
    slug: 'tsinghua-university',
    city: 'Beijing',
    description: 'Research excellence with a global community.'
  },
  {
    name: 'Fudan University',
    slug: 'fudan-university',
    city: 'Shanghai',
    description: 'A cosmopolitan campus where ideas move fast.'
  }
];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Verified university network
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setOpen(true)}
                className="rounded-full bg-slate-900 px-6 py-4 font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
              >
                {t('hero.joinWaitlist')}
              </button>
              <button
                onClick={() => navigate('/about')}
                className="rounded-full border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 shadow-sm"
              >
                {t('hero.learnMore')}
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['1,000+', 'Verified students', Users],
                ['3', 'Top universities', GraduationCap],
                ['24/7', 'Smart matching', Globe2]
              ].map(([value, label, Icon]) => (
                <div key={label as string} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                  <Icon className="h-5 w-5 text-indigo-600" />
                  <div className="mt-3 text-2xl font-bold">{value as string}</div>
                  <div className="text-sm text-slate-500">{label as string}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-indigo-900 to-cyan-800 p-6 text-white">
              <div className="text-sm opacity-80">BridgeCN</div>
              <div className="mt-3 text-3xl font-black">Connect Beyond Language</div>
              <p className="mt-3 max-w-md text-white/80">
                Discover friends, mentors, events, and projects across China.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {universities.map((uni) => (
                <Link
                  key={uni.slug}
                  to={`/universities/${uni.slug}`}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{uni.name}</div>
                      <div className="text-sm text-slate-500">{uni.city}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{uni.description}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {universities.map((uni) => (
            <motion.div
              key={uni.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-lg font-bold text-white">
                {uni.name.slice(0, 2)}
              </div>
              <h3 className="mt-4 text-xl font-bold">{uni.name}</h3>
              <p className="mt-2 text-slate-600">{uni.description}</p>
              <Link to={`/universities/${uni.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600">
                Explore campus <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <JoinWaitlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
