import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    number:  '01',
    title:   'Recipe Management',
    pain:    'Recipes scattered across notebooks, apps and bookmarks',
    fix:     'One organised library',
    desc:    'Add, categorise and edit recipes with ingredients, steps and photos — structured the way a real kitchen thinks.',
    accent:  'from-[#3a5d8f] to-blue-600',
    tag:     'text-[#3a5d8f] bg-[#3a5d8f]/8 border-[#3a5d8f]/15',
  },
  {
    number:  '02',
    title:   'Weekly Meal Planner',
    pain:    'No idea what to cook from Monday through Sunday',
    fix:     'Plan your whole week in minutes',
    desc:    'Assign recipes to any meal slot across a 7-day calendar. Plans are saved automatically to your account.',
    accent:  'from-emerald-500 to-teal-500',
    tag:     'text-emerald-700 bg-emerald-500/8 border-emerald-200',
  },
  {
    number:  '03',
    title:   'Smart Shopping List',
    pain:    'Forgetting ingredients at the grocery store',
    fix:     'Shopping list built from your plan',
    desc:    'Generate a complete grocery list from your weekly meals in one click. Check items off as you go.',
    accent:  'from-amber-400 to-orange-500',
    tag:     'text-amber-700 bg-amber-400/8 border-amber-200',
  },
  {
    number:  '04',
    title:   'Community & Ratings',
    pain:    'Cooking the same meals with no fresh inspiration',
    fix:     'Discover dishes from your community',
    desc:    'Browse shared recipes, leave star ratings and written reviews. Improve your cooking based on real feedback.',
    accent:  'from-rose-500 to-pink-500',
    tag:     'text-rose-700 bg-rose-500/8 border-rose-200',
  },
  {
    number:  '05',
    title:   'Quick & Intuitive',
    pain:    'Wasting time navigating complex cooking apps',
    fix:     'Simple enough for anyone',
    desc:    'Create a full recipe in under two minutes. Every screen is designed around how people actually cook — not how developers think they do.',
    accent:  'from-violet-500 to-purple-600',
    tag:     'text-violet-700 bg-violet-500/8 border-violet-200',
  },
  {
    number:  '06',
    title:   'Cultural Inclusivity',
    pain:    'Limited support for diverse and cultural foods',
    fix:     'Every cuisine is welcome',
    desc:    'From Jollof Rice to Japanese Ramen — no cuisine is treated as secondary. Multilingual support is on the roadmap.',
    accent:  'from-[#3a5d8f] to-emerald-500',
    tag:     'text-[#3a5d8f] bg-[#3a5d8f]/8 border-[#3a5d8f]/15',
  },
];

const Features = () => (
  <section className="relative py-24 bg-gradient-to-br from-stone-50 via-blue-50/30 to-emerald-50/40 overflow-hidden">
    {/* Dot pattern */}
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

    {/* Soft blobs */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#3a5d8f]/5 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="max-w-3xl mb-16">
        <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-4">
          Why TheRecipeBook
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-5">
          Built to solve real
          <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
            kitchen problems
          </span>
        </h2>
        <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
          Most people waste time, money and food because they lack the right tools.
          Every feature here was designed around a specific, everyday frustration.
        </p>
      </motion.div>

      {/* ── Pain vs Solution strip ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.15 }}
        className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm p-5 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {[
            { before: 'Scattered recipes',   after: 'One organised library'      },
            { before: 'No weekly meal plan', after: 'Planner + auto shopping list' },
            { before: 'Food & money wasted', after: 'Shop only what you need'    },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1 px-6 py-3 first:pl-0 last:pr-0">
              <p className="text-xs text-red-400 font-semibold line-through">{item.before}</p>
              <p className="text-sm font-bold text-gray-900">{item.after}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Feature cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {FEATURES.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-md hover:shadow-xl hover:shadow-[#3a5d8f]/8 p-7 transition-all duration-300 flex flex-col"
          >
            {/* Number + title row */}
            <div className="flex items-start justify-between mb-4">
              <span className={`text-4xl font-black bg-gradient-to-br ${f.accent} bg-clip-text text-transparent leading-none opacity-30 group-hover:opacity-50 transition-opacity`}>
                {f.number}
              </span>
              {/* Accent bar */}
              <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${f.accent} mt-3`} />
            </div>

            <h3 className="font-black text-gray-900 text-lg mb-3 group-hover:text-[#3a5d8f] transition-colors">
              {f.title}
            </h3>

            {/* Pain label */}
            <p className={`text-[11px] font-bold px-2.5 py-1 rounded-full border w-fit mb-3 line-through opacity-70 ${f.tag}`}>
              {f.pain}
            </p>

            {/* Fix */}
            <p className={`text-xs font-black mb-3 bg-gradient-to-r ${f.accent} bg-clip-text text-transparent`}>
              → {f.fix}
            </p>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed flex-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ── CTA ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm px-8 py-6">
        <div>
          <p className="font-black text-gray-900 text-lg">Ready to take back control of your kitchen?</p>
          <p className="text-gray-400 text-sm mt-0.5">Free to get started. No credit card required.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-shrink-0">
          <Link to="/register"
            className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all whitespace-nowrap">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default Features;