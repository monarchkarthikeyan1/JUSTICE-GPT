import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Star, Sparkles, Zap, ArrowRight, Scale, Gavel } from 'lucide-react';

interface WelcomeScreenProps {
  onEnter: () => void;
  t: Record<string, string>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-amber-700 relative overflow-hidden flex items-center justify-center"
    >
      {/* Simple Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Simple Floating Legal Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Shield, BookOpen, Star, Scale, Gavel].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Icon size={24 + i * 8} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Container - Properly structured with flexbox */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center gap-8">
        {/* Logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 40px rgba(245, 158, 11, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Scale className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </motion.div>
          
          {/* Simple Orbiting Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-amber-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                marginLeft: "-6px",
                marginTop: "-6px",
              }}
              animate={{
                x: [0, 80 * Math.cos((i * 60 * Math.PI) / 180)],
                y: [0, 80 * Math.sin((i * 60 * Math.PI) / 180)],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.div className="text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t.appName.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-4 bg-gradient-to-r from-amber-200 via-blue-200 to-amber-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8 + i * 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-amber-200 font-medium max-w-2xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Enter Button */}
        <motion.div className="relative">
          <motion.button
            onClick={onEnter}
            className="group relative px-8 md:px-16 py-6 md:py-8 bg-gradient-to-r from-blue-600 via-blue-500 to-amber-600 text-white font-bold text-lg md:text-2xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2, type: "spring", stiffness: 200 }}
            whileHover={{
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button Content */}
            <div className="relative flex items-center gap-4">
              <span>Enter</span>
              <ArrowRight className="w-6 h-6" />
            </div>
            
            {/* Simple Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 40px rgba(245, 158, 11, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        {/* Features Row - Now properly aligned */}
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          {[
            { icon: Shield, text: "Legal Protection", color: "text-blue-300" },
            { icon: BookOpen, text: "Expert Analysis", color: "text-amber-300" },
            { icon: Star, text: "AI Powered", color: "text-blue-300" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 + i * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className={`${feature.color} text-2xl`}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <feature.icon size={32} />
              </motion.div>
              <span className="text-white/80 text-sm font-medium text-center">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Background Animation */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen; 