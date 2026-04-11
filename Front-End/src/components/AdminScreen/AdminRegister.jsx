import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin, reset } from '../../features/auth/adminSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, Loader2, BookOpen, Sparkles, UserPlus, CheckCircle } from 'lucide-react';

const FOOD_BG = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80';

const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all';
const labelCls = 'block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5';

const AdminRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  
  const emailBorder = emailTouched
    ? emailValid ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : '';
  const passwordBorder = passwordTouched
    ? passwordValid ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : '';
  const confirmBorder = confirmTouched
    ? passwordsMatch ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-400/20' : 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
    : '';

  const isFormValid = emailValid && passwordValid && passwordsMatch;

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || admin) {
      toast.success('Admin registered successfully!');
      navigate('/admin/login');
    }
    return () => { dispatch(reset()); };
  }, [isError, isSuccess, admin, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') setEmailTouched(true);
    if (e.target.name === 'password') setPasswordTouched(true);
    if (e.target.name === 'confirmPassword') setConfirmTouched(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    dispatch(registerAdmin(formData));
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

        {/* ── Left: Branding ── */}
        <div className="relative p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-[#2b4c7e] to-[#1a365d] overflow-hidden">
          {/* Background images */}
          <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b4c7e]/90 to-[#1a365d]/90" />
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <div className="absolute bottom-4 right-8 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center rotate-12">
            <Sparkles className="w-6 h-6 text-white/30" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-base text-white">TheRecipeBook</span>
            </div>

            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                Admin Zone
              </span>
              <h1 className="text-4xl font-black text-white leading-tight">
                Create Admin <span className="text-emerald-400">Account</span>
              </h1>
              <p className="text-white/60 text-sm mt-3 max-w-xs">
                Register a new admin account to access the dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2 text-white/40 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure registration</span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"
              alt="" className="w-9 h-9 rounded-xl object-cover shadow-md" />
            <span className="font-black text-base bg-gradient-to-r from-gray-900 via-[#3a5d8f] to-emerald-600 bg-clip-text text-transparent">
              TheRecipeBook
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-2">New Account</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Register Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Create credentials for admin access.</p>
          </div>

          {isError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl mb-4">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold">!</span>
              <span className="text-sm text-red-600 font-medium">{message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className={labelCls}>Email address *</label>
              <input 
                type="email" 
                name="email" 
                required 
                placeholder="admin@example.com"
                value={formData.email} 
                onChange={handleChange}
                className={`${inputCls} ${emailBorder}`} 
              />
              {emailTouched && !emailValid && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  required 
                  placeholder="Create a password"
                  value={formData.password} 
                  onChange={handleChange}
                  className={`${inputCls} ${passwordBorder}`} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordTouched && !passwordValid && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  Must have: uppercase, lowercase, number, symbol (@#$%^&*!), min 8 chars
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelCls}>Confirm Password *</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="confirmPassword" 
                required 
                placeholder="Confirm your password"
                value={formData.confirmPassword} 
                onChange={handleChange}
                className={`${inputCls} ${confirmBorder}`} 
              />
              {confirmTouched && !passwordsMatch && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">Passwords do not match.</p>
              )}
            </div>

            {/* Password requirements */}
            <div className="p-3 bg-gray-50 rounded-2xl space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password requirements</p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div className={`flex items-center gap-1 ${formData.password.match(/[a-z]/) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 ${formData.password.match(/[a-z]/) ? 'fill-emerald-100' : ''}`} /> Lowercase
                </div>
                <div className={`flex items-center gap-1 ${formData.password.match(/[A-Z]/) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 ${formData.password.match(/[A-Z]/) ? 'fill-emerald-100' : ''}`} /> Uppercase
                </div>
                <div className={`flex items-center gap-1 ${formData.password.match(/\d/) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 ${formData.password.match(/\d/) ? 'fill-emerald-100' : ''}`} /> Number
                </div>
                <div className={`flex items-center gap-1 ${formData.password.match(/[@#$%^&*!]/) ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <CheckCircle className={`w-3 h-3 ${formData.password.match(/[@#$%^&*!]/) ? 'fill-emerald-100' : ''}`} /> Symbol
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button type="submit" disabled={isLoading || !isFormValid}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 transition-all">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin Account</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account? <Link className="font-semibold text-[#3a5d8f] hover:text-emerald-600 transition-colors" to="/admin/login">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
