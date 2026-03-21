import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 lg:bottom-8 lg:right-8 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-br from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white rounded-2xl shadow-lg shadow-[#3a5d8f]/30 hover:shadow-xl hover:shadow-[#3a5d8f]/40 border-0 focus:outline-none focus:ring-4 focus:ring-[#3a5d8f]/25 transition-all duration-300 lg:hover:-translate-y-1"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 lg:w-6 lg:h-6" />
    </motion.button>
  );
};

export default ScrollToTop;

