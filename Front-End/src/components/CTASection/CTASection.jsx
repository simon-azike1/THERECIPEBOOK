import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { value: '15,000+', label: 'Active Cooks'  },
  { value: '50,000+', label: 'Recipes Shared' },
  { value: '4.9',     label: 'Average Rating' },
];

const CTASection = () => (
  <section className="relative py-24 overflow-hidden">
    {/* Full-bleed gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#3a5d8f] via-[#2c4a75] to-emerald-700" />

    {/* Dot pattern overlay */}
    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

    {/* Soft light blobs */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Left: copy ── */}
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>

          <p className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            Start for free
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.08] mb-5">
            Ready to take control
            <span className="block text-emerald-300">of your kitchen?</span>
          </h2>

          <p className="text-white/65 text-base leading-relaxed mb-8 max-w-md">
            Join thousands of home cooks who plan smarter, waste less and cook
            with more confidence — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-[#3a5d8f] font-black rounded-2xl shadow-xl text-sm transition-all">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/recipes"
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl text-sm transition-all">
                Browse Recipes
              </Link>
            </motion.div>
          </div>

          <p className="text-white/35 text-xs mt-4 font-medium">
            No credit card required · Free forever plan available
          </p>
        </motion.div>

        {/* ── Right: stats ── */}
        <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 gap-4">

          {STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.1 }}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4">
              <p className="text-white/60 text-sm font-semibold">{s.label}</p>
              <p className="text-3xl font-black text-white">{s.value}</p>
            </motion.div>
          ))}

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.55 }}
            className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-5">
            <p className="text-white/80 text-sm leading-relaxed italic mb-3">
              "TheRecipeBook completely changed how I approach meal prep.
              The shopping list alone saves me an hour every week."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-[#3a5d8f] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-black">S</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold">Sarah M.</p>
                <p className="text-white/40 text-[10px]">Home cook · Lagos</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  </section>
);

export default CTASection;