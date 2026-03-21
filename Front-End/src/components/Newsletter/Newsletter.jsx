import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Weekly curated recipes',
    desc:  'Hand-picked dishes every week based on season, trend and community votes.',
  },
  {
    title: 'Exclusive cooking tips',
    desc:  'Technique breakdowns and kitchen shortcuts from experienced home cooks.',
  },
  {
    title: 'Early access to features',
    desc:  'Be first to try new tools — meal planning upgrades, AI suggestions and more.',
  },
];

const Newsletter = () => {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-stone-50 via-blue-50/30 to-emerald-50/40 overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3a5d8f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: copy + benefits ── */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}>

            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-4">
              Stay in the loop
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.08] mb-4">
              Join our cooking
              <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
                community
              </span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-md">
              Weekly recipes, cooking tips and feature updates delivered straight
              to your inbox. No spam — ever.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {BENEFITS.map((b, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:border-[#3a5d8f]/20 transition-all">
                  {/* Number accent */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-md">
                    <span className="text-white text-[11px] font-black">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.15 }}>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-8">

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* Success state */
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">You're subscribed!</h3>
                    <p className="text-gray-500 text-sm">Welcome to the community. Check your inbox for a confirmation.</p>
                    <button onClick={() => setSubmitted(false)}
                      className="mt-5 text-xs font-bold text-[#3a5d8f] hover:underline">
                      Subscribe another email
                    </button>
                  </motion.div>
                ) : (
                  /* Form */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-black text-gray-900 text-xl mb-1">Get the newsletter</h3>
                    <p className="text-gray-400 text-sm mb-6">Join 15,000+ cooks already subscribed.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                          First name
                        </label>
                        <input type="text" placeholder="e.g. Sarah"
                          className="w-full px-4 py-3 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all" />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                          Email address *
                        </label>
                        <input type="email" placeholder="you@example.com"
                          value={email} onChange={e => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all" />
                      </div>

                      {/* Submit */}
                      <motion.button type="submit" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                        {loading ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Subscribing…</>
                        ) : (
                          <>Subscribe <ArrowRight className="w-4 h-4" /></>
                        )}
                      </motion.button>
                    </form>

                    <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
                      No spam. Unsubscribe at any time. Your data is never shared.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;