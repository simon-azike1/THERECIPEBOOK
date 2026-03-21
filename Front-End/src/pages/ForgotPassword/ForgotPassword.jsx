import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendResetEmail } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FOOD_BG = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2053&q=80';

const ForgotPassword = () => {
  const dispatch         = useDispatch();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(sendResetEmail(email)).unwrap();
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 flex items-center justify-center px-4">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#3a5d8f]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl overflow-hidden">

        {/* Header strip */}
        <div className="relative h-36 overflow-hidden">
          <img src={FOOD_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/85 to-emerald-700/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">TheRecipeBook</p>
            <h1 className="text-white text-2xl font-black text-center">Forgot Password</h1>
            <p className="text-white/60 text-xs mt-1 text-center">
              Enter your email and we'll send a reset link
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <AnimatePresence mode="wait">

            {/* ── Sent confirmation ── */}
            {sent ? (
              <motion.div key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4">

                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-xl shadow-[#3a5d8f]/25">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>

                <h2 className="font-black text-gray-900 text-lg mb-2">Check your inbox</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-1">
                  We've sent a password reset link to
                </p>
                <p className="font-bold text-[#3a5d8f] text-sm mb-5">{email}</p>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Didn't receive it? Check your spam folder or try again in a few minutes.
                </p>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSent(false)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-2xl text-sm border border-gray-200 transition-all">
                  Try a different email
                </motion.button>
              </motion.div>

            ) : (

              /* ── Form ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                      Email address *
                    </label>
                    <input type="email" required placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all" />
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      We'll send a reset link to this address.
                    </p>
                  </div>

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                      : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                    }
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to login */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <Link to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#3a5d8f] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;