import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { number: 10000, suffix: '+', label: 'Active Users'    },
  { number: 50000, suffix: '+', label: 'Recipes Shared'  },
  { number: 100,   suffix: '+', label: 'Countries'       },
  { number: 4.8,   suffix: '',  label: 'Average Rating'  },
];

const VALUES = [
  {
    number: '01',
    title:  'Sustainability',
    desc:   'Promoting eco-friendly cooking practices and reducing food waste through better planning and ingredient awareness.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    number: '02',
    title:  'Community',
    desc:   'Building genuine connections through shared culinary experiences — across cultures, kitchens and skill levels.',
    accent: 'from-[#3a5d8f] to-blue-600',
  },
  {
    number: '03',
    title:  'Innovation',
    desc:   'Constantly refining our platform based on how real people cook — not how we assume they do.',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    number: '04',
    title:  'Quality',
    desc:   'Every feature, every recipe card and every interaction is held to a high standard of usefulness and clarity.',
    accent: 'from-violet-500 to-purple-600',
  },
];

const TEAM = [
  {
    initial: 'S',
    image:   '/src/assets/simon-azike.PNG',
    name:    'Simon Azike',
    role:    'Founder',
    bio:     'Passionate about bringing families together through shared meals and making home cooking more accessible for everyone.',
    accent:  'from-[#3a5d8f] to-blue-600',
  },
  {
    initial: 'K',
    image:   '/src/assets/keyinde-oluwafisayo.jpg',
    name:    'Keyinde Oluwafisayo',
    role:    'Marketer',
    bio:     'Connecting food lovers with delicious recipes and building a community of home cooks worldwide.',
    accent:  'from-emerald-500 to-teal-500',
  },
  {
    initial: 'Q',
    image:   '/src/assets/quadri-kobiowu.png',
    name:    'Quadri Kobiowu',
    role:    'Software Developer',
    bio:     'Building intuitive features that help home cooks plan meals, organize recipes and simplify their cooking journey.',
    accent:  'from-amber-400 to-orange-500',
  },
];

const FOOD_BG = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2070&q=80';

// ─── Animated counter ─────────────────────────────────────────────────────────
const AnimatedStat = ({ stat, delay }) => {
  const [val, setVal] = useState(0);
  const ref           = useRef(null);
  const inView        = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const duration  = 1800;
    const steps     = duration / 16;
    const increment = stat.number / steps;
    let current     = 0;
    const id = setInterval(() => {
      current = Math.min(current + increment, stat.number);
      setVal(current);
      if (current >= stat.number) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, stat.number]);

  const display = stat.label === 'Average Rating'
    ? val.toFixed(1)
    : `${Math.round(val).toLocaleString()}${stat.suffix}`;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.4 }}
      className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-md p-6 text-center">
      <p className="text-4xl font-black bg-gradient-to-br from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent leading-none mb-2">
        {display}
      </p>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
    </motion.div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
    {/* Dot pattern */}
    <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

    <Header />

    {/* ── Hero banner ── */}
    <div className="relative h-64 md:h-72 overflow-hidden">
      <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-50/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/30 to-emerald-900/20" />

      <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
        <p className="text-amber-300 text-[11px] font-bold tracking-widest uppercase mb-2">Since 2023</p>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
          Our <span className="text-emerald-400">Story</span>
        </h1>
      </div>
    </div>

    <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

      {/* ── Mission + Stats ── */}
      <section className="grid lg:grid-cols-2 gap-14 items-start">
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-4">Our mission</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5">
            Cooking is more than
            <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
              preparing meals
            </span>
          </h2>
          <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
            <p>
              At TheRecipeBook, we believe cooking is about creating memories, sharing
              traditions and bringing people together. Our platform is designed to inspire
              home cooks of all skill levels to explore new flavours and techniques while
              connecting with a global community of food lovers.
            </p>
            <p>
              We started with a simple observation — most people waste time, money and food
              because they lack the right tools. TheRecipeBook was built specifically to solve
              that problem: one organised space for recipes, meal planning and shopping.
            </p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => <AnimatedStat key={i} stat={s} delay={i * 0.1} />)}
        </div>
      </section>

      {/* ── Values ── */}
      <section>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-12">
          <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-3">What guides us</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Our values
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-md hover:shadow-xl p-7 transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <span className={`text-4xl font-black bg-gradient-to-br ${v.accent} bg-clip-text text-transparent leading-none opacity-25 group-hover:opacity-40 transition-opacity`}>
                  {v.number}
                </span>
                <div className={`w-6 h-1 rounded-full bg-gradient-to-r ${v.accent} mt-3`} />
              </div>
              <h3 className="font-black text-gray-900 text-base mb-2 group-hover:text-[#3a5d8f] transition-colors">
                {v.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-12">
          <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-3">The people</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Meet the team
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-md hover:shadow-xl p-7 transition-all duration-300 flex flex-col">
              {/* Avatar image */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-5 group-hover:shadow-lg transition-all">
                <img src={m.image} alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <h3 className="font-black text-gray-900 text-lg mb-0.5">{m.name}</h3>
              <p className={`text-xs font-black uppercase tracking-widest bg-gradient-to-r ${m.accent} bg-clip-text text-transparent mb-3`}>
                {m.role}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{m.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a5d8f] via-[#2c4a75] to-emerald-700" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-8 md:px-14 py-14">
            <div>
              <p className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-3">Get in touch</p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Have a question or suggestion?
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-md">
                We read every message. Whether it's a bug report, a feature idea or just
                a hello — our team is happy to hear from you.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Contact details — text only, no icons */}
              {[
                { label: 'Email',    value: 'support@therecipebook.com' },
                { label: 'Phone',    value: '+1 (234) 567-890'           },
                { label: 'Location', value: 'Cardiff, Wales'             },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3.5">
                  <span className="text-white/40 text-xs font-black uppercase tracking-widest w-16 flex-shrink-0">{c.label}</span>
                  <span className="text-white text-sm font-semibold">{c.value}</span>
                </div>
              ))}

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-1">
                <Link to="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-[#3a5d8f] font-black rounded-2xl shadow-xl text-sm transition-all">
                  Go to Contact Page
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>

    <Footer />
  </div>
);

export default About;