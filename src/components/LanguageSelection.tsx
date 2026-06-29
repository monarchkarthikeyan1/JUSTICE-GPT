import React from 'react';
import { motion } from 'framer-motion';

interface LanguageSelectionProps {
  onSelect: (lang: 'en' | 'hi' | 'te') => void;
  onBack: () => void;
  t: Record<string, string>;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect, onBack, t }) => (
  <motion.div
    key="lang-select"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.7 }}
    className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-800 to-amber-700"
  >
    <motion.h2
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
    >
      {t.selectLanguage}
    </motion.h2>
    <div className="flex gap-6 mb-8">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('en')}
        className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl shadow-lg text-xl transition-all duration-300 hover:bg-blue-100 hover:text-slate-900"
      >
        {t.english}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('hi')}
        className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl shadow-lg text-xl transition-all duration-300 hover:bg-blue-100 hover:text-slate-900"
      >
        {t.hindi}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect('te')}
        className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl shadow-lg text-xl transition-all duration-300 hover:bg-blue-100 hover:text-slate-900"
      >
        {t.telugu}
      </motion.button>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onBack}
      className="mt-2 px-6 py-2 bg-white text-slate-700 font-semibold rounded-full shadow transition-all duration-300 hover:bg-blue-100 hover:text-slate-900"
    >
       Back
    </motion.button>
  </motion.div>
);

export default LanguageSelection; 