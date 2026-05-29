import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '../lib/api';
import { useTranslation } from 'react-i18next';

const universities = ['Zhejiang', 'Tsinghua', 'Fudan', 'Other'];
const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const interestOptions = ['Language Exchange', 'AI', 'Sports', 'Design', 'Startups', 'Events', 'Music', 'Photography'];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function JoinWaitlistModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    university: universities[0],
    studentType: 'CHINESE',
    yearOfStudy: yearOptions[0],
    interests: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) setSuccess('');
  }, [open]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.interests.length) next.interests = 'Choose at least one interest';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSuccess('');
    try {
      await api.post('/waitlist', form);
      setSuccess(t('waitlist.success'));
      setForm({ ...form, fullName: '', email: '', interests: [] });
    } catch (err: any) {
      setErrors({ form: err?.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((x) => x !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">{t('waitlist.title')}</h2>
              <button onClick={onClose} className="rounded-full border border-slate-200 p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">{success}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium">Full Name</span>
                  <input
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                  {errors.fullName && <span className="text-sm text-rose-600">{errors.fullName}</span>}
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <span className="text-sm text-rose-600">{errors.email}</span>}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">University</span>
                  <select
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    value={form.university}
                    onChange={(e) => setForm({ ...form, university: e.target.value })}
                  >
                    {universities.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium">Year of Study</span>
                  <select
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    value={form.yearOfStudy}
                    onChange={(e) => setForm({ ...form, yearOfStudy: e.target.value })}
                  >
                    {yearOptions.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </label>

                <div className="md:col-span-2">
                  <span className="text-sm font-medium">Student Type</span>
                  <div className="mt-2 flex gap-3">
                    {[
                      ['CHINESE', 'Chinese Student'],
                      ['INTERNATIONAL', 'International Student']
                    ].map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
                        <input
                          type="radio"
                          checked={form.studentType === value}
                          onChange={() => setForm({ ...form, studentType: value })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm font-medium">Interests / Skills</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full border px-3 py-2 text-sm ${form.interests.includes(interest)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-700'}`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {errors.interests && <span className="text-sm text-rose-600">{errors.interests}</span>}
                </div>

                {errors.form && <div className="md:col-span-2 rounded-2xl bg-rose-50 p-3 text-rose-700">{errors.form}</div>}

                <div className="md:col-span-2 flex items-center justify-end gap-3">
                  <button onClick={onClose} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium">
                    {t('buttons.cancel')}
                  </button>
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : t('waitlist.submit')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
