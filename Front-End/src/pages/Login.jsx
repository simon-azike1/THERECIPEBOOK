import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from './../features/auth/authSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const FOOD_IMG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80';

const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all';
const labelCls = 'block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, isSuccess, isError, message } = useSelector((s) => s.auth);

  const [formData,      setFormData]      = useState({ email: '', password: '', rememberMe: false });
  const [showPassword,  setShowPassword]  = useState(false);
  const [emailTouched,  setEmailTouched]  = useState(false);

  const emailValid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const emailBorder  = emailTouched
    ? emailValid ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : '';

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && user?._id) {
      toast.success('Welcome back!');
      navigate('/my-recipes');
    } else if (isSuccess && !user && message) {
      toast(message, { icon: 'ℹ️' });
    }
    return () => { dispatch(reset()); };
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onInput = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(p => ({ ...p, [e.target.name]: val }));
    if (e.target.name === 'email') setEmailTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 flex items-center justify-center px-4 py-12">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Blobs */}
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

          <div className="mb-8">
            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-2">Welcome back</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Sign in to your account</h1>
            <p className="text-gray-400 text-sm mt-1">Access your recipes, meal plans and community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className={labelCls}>Email address *</label>
              <input type="email" name="email" required placeholder="you@example.com"
                value={formData.email} onChange={onInput}
                className={`${inputCls} ${emailBorder}`} />
              {emailTouched && !emailValid && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls} style={{ marginBottom: 0 }}>Password *</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-[#3a5d8f] hover:text-emerald-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" required
                  placeholder="Enter your password"
                  value={formData.password} onChange={onInput}
                  className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3a5d8f] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" name="rememberMe"
                checked={formData.rememberMe} onChange={onInput}
                className="w-4 h-4 rounded border-gray-300 text-[#3a5d8f] focus:ring-[#3a5d8f]/20" />
              <label htmlFor="rememberMe" className="text-xs font-semibold text-gray-500 cursor-pointer">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all mt-2">
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </motion.button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#3a5d8f] hover:text-emerald-600 transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* ── Right: image panel ── */}
        <div className="hidden md:block relative overflow-hidden">
          <img src={FOOD_IMG} alt="Cooking" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a5d8f]/85 via-[#2c4a75]/70 to-emerald-700/80" />

          {/* Dot pattern on dark */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative h-full flex flex-col justify-between p-10">
            <div>
              <p className="text-emerald-300 text-[11px] font-black uppercase tracking-widest mb-3">TheRecipeBook</p>
              <h2 className="text-white text-3xl font-black leading-tight mb-3">
                Your kitchen,
                <span className="block text-emerald-300">organised.</span>
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Plan your meals, manage your recipes and generate shopping lists — all in one place.
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {[
                { value: '200+', label: 'Recipes shared'  },
                { value: '100+', label: 'Active cooks'    },
                { value: '4.5 / 5', label: 'Average rating'  },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
                  <span className="text-white/55 text-xs font-semibold">{s.label}</span>
                  <span className="text-white font-black text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;