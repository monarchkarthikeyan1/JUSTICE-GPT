import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white/95 via-blue-50/95 to-amber-50/95 rounded-3xl shadow-2xl relative border border-white/50 backdrop-blur-sm p-8">
      {/* Loading Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <span className="text-white text-2xl">⚖️</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-slate-800 mb-2"
        >
          Analyzing Your Case
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          Our AI is examining the legal aspects of your situation...
        </motion.p>
      </div>

      {/* Loading Progress */}
      <div className="max-w-2xl mx-auto mb-8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-3 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full mb-4"
        />
        <div className="text-center text-sm text-slate-500">
          Processing legal information...
        </div>
      </div>

      {/* Loading Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: "🔍", title: "Case Classification", description: "Analyzing case type and jurisdiction" },
          { icon: "📚", title: "Legal Research", description: "Finding relevant laws and precedents" },
          { icon: "⚖️", title: "Analysis Generation", description: "Creating comprehensive legal analysis" }
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
            className="bg-white/80 rounded-2xl p-6 text-center shadow-lg border border-white/50"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              className="text-4xl mb-3"
            >
              {step.icon}
            </motion.div>
            <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Loading Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-8 text-center"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> The more detailed your case description, the more accurate our analysis will be.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
