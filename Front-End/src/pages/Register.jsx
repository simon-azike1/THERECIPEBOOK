import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from './../features/auth/authSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const FOOD_IMG = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80';

const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all';
const labelCls = 'block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5';

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)                           s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw))    s++;
  if (/\d/.test(pw))                            s++;
  if (/[^a-zA-Z0-9]/.test(pw))                 s++;
  return s;
};

const STRENGTH_MAP = {
  0: { label: '',         bar: 'w-0',    color: '' },
  1: { label: 'Weak',     bar: 'w-1/4',  color: 'bg-red-500'     },
  2: { label: 'Fair',     bar: 'w-1/2',  color: 'bg-amber-500'   },
  3: { label: 'Good',     bar: 'w-3/4',  color: 'bg-emerald-400' },
  4: { label: 'Strong',   bar: 'w-full', color: 'bg-emerald-600' },
};

const Register = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw,   setShowPw]   = useState(false);
  const [showCPw,  setShowCPw]  = useState(false);
  const [touched,  setTouched]  = useState({ name: false, email: false, password: false, confirmPassword: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const nameValid  = formData.name.trim().length >= 2;
  const pwStrength = getStrength(formData.password);
  const pwMatch    = formData.password === formData.confirmPassword;

  useEffect(() => {
    if (isError)   toast.error(message);
    if (isSuccess) {
      toast.success('Account created! Please verify your email before logging in.');
      navigate('/login');
    }
    return () => { dispatch(reset()); };
  }, [isSuccess, isError, message, navigate, dispatch]);

  const onInput = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    setTouched(p => ({ ...p, [e.target.name]: true }));
  };

  const borderFor = (field, valid) => {
    if (!touched[field]) return '';
    return valid
      ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20'
      : 'border-red-400 focus:border-red-400 focus:ring-red-400/20';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pwMatch)              { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    dispatch(register(formData));
  };

  const sm = STRENGTH_MAP[pwStrength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 flex items-center justify-center px-4 py-12">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#3a5d8f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ── Left: form ── */}
        <div className="p-8 md:p-12 flex flex-col justify-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"
              alt="" className="w-9 h-9 rounded-xl object-cover shadow-md" />
            <span className="font-black text-base bg-gradient-to-r from-gray-900 via-[#3a5d8f] to-emerald-600 bg-clip-text text-transparent">
              TheRecipeBook
            </span>
          </Link>

          <div className="mb-7">
            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-2">Get started</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Create your account</h1>
            <p className="text-gray-400 text-sm mt-1">Join thousands of home cooks sharing their recipes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className={labelCls}>Full name *</label>
              <input type="text" name="name" required placeholder="e.g. Sarah Johnson"
                value={formData.name} onChange={onInput}
                className={`${inputCls} ${borderFor('name', nameValid)}`} />
              {touched.name && !nameValid && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Name must be at least 2 characters.</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email address *</label>
              <input type="email" name="email" required placeholder="you@example.com"
                value={formData.email} onChange={onInput}
                className={`${inputCls} ${borderFor('email', emailValid)}`} />
              {touched.email && !emailValid && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" required
                  placeholder="Min. 6 characters"
                  value={formData.password} onChange={onInput}
                  className={`${inputCls} pr-12 ${borderFor('password', pwStrength >= 3)}`} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3a5d8f] transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {touched.password && formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-400 ${sm.bar} ${sm.color}`} />
                  </div>
                  <p className={`text-[11px] font-bold ${pwStrength <= 1 ? 'text-red-500' : pwStrength === 2 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {sm.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className={labelCls}>Confirm password *</label>
              <div className="relative">
                <input type={showCPw ? 'text' : 'password'} name="confirmPassword" required
                  placeholder="Repeat your password"
                  value={formData.confirmPassword} onChange={onInput}
                  className={`${inputCls} pr-12 ${borderFor('confirmPassword', pwMatch && formData.confirmPassword.length > 0)}`} />
                <button type="button" onClick={() => setShowCPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3a5d8f] transition-colors">
                  {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.confirmPassword && formData.confirmPassword && !pwMatch && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords do not match.</p>
              )}
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all mt-1">
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : <>Create Account <ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#3a5d8f] hover:text-emerald-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Right: image panel ── */}
        <div className="hidden md:block relative overflow-hidden">
          <img src={FOOD_IMG} alt="Cooking" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a5d8f]/85 via-[#2c4a75]/70 to-emerald-700/80" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative h-full flex flex-col justify-between p-10">
            <div>
              <p className="text-emerald-300 text-[11px] font-black uppercase tracking-widest mb-3">Join the community</p>
              <h2 className="text-white text-3xl font-black leading-tight mb-3">
                Cook more,
                <span className="block text-emerald-300">waste less.</span>
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Create recipes, plan your weekly meals and generate shopping lists — all from one account.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                { step: '01', text: 'Create and organise your recipe library'    },
                { step: '02', text: 'Plan your meals week by week'                },
                { step: '03', text: 'Auto-generate your grocery shopping list'    },
                { step: '04', text: 'Share and rate recipes with the community'   },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
                  <span className="text-emerald-300 text-[11px] font-black w-5 flex-shrink-0">{b.step}</span>
                  <p className="text-white/75 text-xs font-medium">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;