import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';

const FOOD_BG = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2070&q=80';

const CONTACT_DETAILS = [
  { label: 'Email',    value: 'support@therecipebook.com', href: 'mailto:support@therecipebook.com' },
  { label: 'Phone',    value: '+1 (234) 567-890',          href: 'tel:+1234567890'                  },
  { label: 'Hours',    value: 'Mon – Fri, 9am – 6pm',      href: null                               },
  { label: 'Location', value: 'Cardiff, Wales',             href: null                               },
];

const FAQS = [
  {
    id: 1,
    q: 'How do I generate a shopping list?',
    a: 'Assign recipes to your weekly meal plan, then open the Shopping List panel on the Meal Planning page and click "Generate from this week\'s plan". It pulls all ingredients automatically.'
  },
  {
    id: 2,
    q: 'How do I create a meal plan?',
    a: 'Go to the Meal Planning page, pick a week using the date navigator, then click any empty slot to assign a recipe from your saved collection.'
  },
  {
    id: 3,
    q: 'Can I customise dietary preferences?',
    a: 'Yes — when creating or editing a recipe, you can tag it with dietary labels like Vegan, Gluten-Free, Halal and more. You can also filter by these tags on the Recipes page.'
  },
  {
    id: 4,
    q: 'Is there a mobile version?',
    a: 'TheRecipeBook is fully responsive and works on any device through your browser. A dedicated mobile app is on the roadmap.'
  },
  {
    id: 5,
    q: 'How do I share a recipe?',
    a: 'Any recipe you create is visible to the community on the public Recipes page once published. Social sharing features are coming in a future update.'
  },
  {
    id: 6,
    q: 'Is my data secure?',
    a: 'All data is transmitted over HTTPS and passwords are hashed. We do not sell or share your personal data with third parties.'
  },
];

const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all';
const labelCls = 'block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5';

const ContactPage = () => {
  const [formData,    setFormData]    = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [openFaq,     setOpenFaq]     = useState(null);

  const onInput = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent! We will reply shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <Header />

      {/* ── Hero banner ── */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-stone-50/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />

        {/* Online indicator */}
        <div className="absolute top-6 left-4 sm:left-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white text-[11px] font-bold">Support team online</span>
          </div>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
          <p className="text-amber-300 text-[11px] font-bold tracking-widest uppercase mb-2">We're here to help</p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Let's start a <span className="text-emerald-400">conversation</span>
          </h1>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* ── Main grid: form + info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">

            {/* Card header */}
            <div className="px-8 py-6 border-b border-gray-100 bg-white/30">
              <h2 className="font-black text-gray-900 text-xl">Send us a message</h2>
              <p className="text-gray-400 text-sm mt-0.5">We reply to every message within 24 hours.</p>
            </div>

            <div className="p-8">
              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <p className="font-bold text-emerald-800 text-sm">Message sent successfully!</p>
                    <p className="text-emerald-600 text-xs mt-0.5">We'll get back to you within 24 hours.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full name *</label>
                    <input type="text" name="name" required placeholder="e.g. Sarah Johnson"
                      value={formData.name} onChange={onInput} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email address *</label>
                    <input type="email" name="email" required placeholder="you@example.com"
                      value={formData.email} onChange={onInput} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Subject *</label>
                  <input type="text" name="subject" required placeholder="What is this about?"
                    value={formData.subject} onChange={onInput} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Message *</label>
                  <textarea name="message" required rows={5} placeholder="Tell us how we can help…"
                    value={formData.message} onChange={onInput}
                    className={`${inputCls} resize-none`} />
                  <p className="text-[10px] text-gray-300 text-right mt-1">{formData.message.length} / 1000</p>
                </div>

                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                  {submitting
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    : <>Send Message <ArrowRight className="w-4 h-4" /></>
                  }
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Info column */}
          <div className="lg:col-span-5 flex flex-col gap-5">

            {/* Contact details */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-white/30">
                <h3 className="font-black text-gray-900 text-base">Direct contact</h3>
              </div>
              <div className="divide-y divide-gray-100/80">
                {CONTACT_DETAILS.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-20 flex-shrink-0">{c.label}</span>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-semibold text-gray-800 hover:text-[#3a5d8f] transition-colors text-right">
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-gray-800 text-right">{c.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What to expect */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6">
              <h3 className="font-black text-gray-900 text-base mb-4">What to expect</h3>
              <div className="space-y-3">
                {[
                  { step: '01', text: 'Submit your message using the form' },
                  { step: '02', text: 'We review and assign to the right team' },
                  { step: '03', text: 'You receive a reply within 24 hours'   },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-black bg-gradient-to-br from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent w-6 flex-shrink-0">
                      {s.step}
                    </span>
                    <p className="text-sm text-gray-500 font-medium">{s.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="relative h-40 rounded-3xl overflow-hidden border border-white/60 shadow-lg">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="Cardiff, Wales" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-black text-sm">Cardiff, Wales</p>
                <p className="text-white/60 text-xs">United Kingdom</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-3">Common questions</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Frequently asked
              <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, i) => (
              <motion.div key={faq.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/50 transition-colors">
                  <span className="font-bold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180 text-[#3a5d8f]' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;