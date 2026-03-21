import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name:     'Emily Chen',
    role:     'Home Chef · London',
    initial:  'E',
    rating:   5,
    quote:    'TheRecipeBook completely changed how I organise my weekly cooking. The meal planner and auto-generated shopping list alone save me over an hour every week.',
  },
  {
    name:     'Marcus Rodriguez',
    role:     'Food Enthusiast · Lagos',
    initial:  'M',
    rating:   5,
    quote:    "I've discovered dishes from cultures I've never cooked before. The community here is genuinely supportive and the recipe quality is consistently high.",
  },
  {
    name:     'Sarah Johnson',
    role:     'Food Blogger · Accra',
    initial:  'S',
    rating:   5,
    quote:    'As someone who shares recipes professionally, the platform is exactly what I needed. Clean, intuitive and it actually gets out of the way and lets me cook.',
  },
];

const Stars = ({ count }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => (
  <section className="relative py-24 bg-gradient-to-br from-stone-50 via-blue-50/30 to-emerald-50/40 overflow-hidden">
    {/* Dot pattern */}
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

    {/* Blobs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3a5d8f]/4 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-4">
          Community voices
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.08] mb-4">
          What our cooks
          <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
            are saying
          </span>
        </h2>
        <p className="text-gray-500 text-base leading-relaxed">
          Real feedback from people who cook with TheRecipeBook every day.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            whileHover={{ y: -4 }}
            className="group bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-md hover:shadow-xl hover:shadow-[#3a5d8f]/8 p-7 transition-all duration-300 flex flex-col"
          >
            {/* Stars */}
            <Stars count={t.rating} />

            {/* Quote */}
            <blockquote className="flex-1 mt-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                "{t.quote}"
              </p>
            </blockquote>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#3a5d8f]/15 via-emerald-500/15 to-transparent mb-5" />

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-sm font-black">{t.initial}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-gray-400 text-[11px]">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom trust bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ delay: 0.35 }}
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 px-8 py-5">
        {[
          { value: '4.9 / 5',   label: 'Average rating'     },
          { value: '15,000+',   label: 'Active cooks'        },
          { value: '50,000+',   label: 'Recipes shared'      },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-black bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
              {item.value}
            </p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Testimonials;