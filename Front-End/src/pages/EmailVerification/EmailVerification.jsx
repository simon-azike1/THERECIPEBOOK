import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../../features/auth/authSlice';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FOOD_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((s) => s.auth);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      dispatch(verifyEmail(token));
    } else {
      toast.error('Verification token is missing');
      navigate('/login');
    }
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/login');
    }
    if (isSuccess) {
      toast.success('Email verified! Please log in to continue.');
      navigate('/login');
    }
    return () => { dispatch(reset()); };
  }, [isSuccess, isError, message, navigate, dispatch]);

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

        {/* Header image strip */}
        <div className="relative h-32 overflow-hidden">
          <img src={FOOD_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/85 to-emerald-700/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest text-center mb-1">
                TheRecipeBook
              </p>
              <h1 className="text-white text-2xl font-black text-center">Email Verification</h1>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-10 text-center">
          {isLoading ? (
            <>
              {/* Spinner */}
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-14 h-14 border-4 border-[#3a5d8f]/20 border-t-[#3a5d8f] rounded-full"
                />
              </div>
              <h2 className="font-black text-gray-900 text-xl mb-2">Verifying your email…</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Please wait while we confirm your email address.
              </p>
            </>
          ) : (
            <>
              {/* Envelope visual — pure CSS, no SVG icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-xl shadow-[#3a5d8f]/25">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>

              <h2 className="font-black text-gray-900 text-xl mb-2">Verifying your email address</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You will be redirected to the login page shortly.<br />
                If nothing happens, click the button below.
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-[#3a5d8f] to-emerald-500 rounded-full"
                />
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                Go to Login
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;