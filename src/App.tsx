import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Sparkles, Zap, Star, ArrowLeft, History, X, User, Briefcase, Search, FileText, LogIn, LogOut } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageSelection from './components/LanguageSelection';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import RoleSelection from './components/RoleSelection';
import { LawyerCaseForm } from './components/LawyerCaseForm';
import { CommonPersonCaseForm } from './components/CommonPersonCaseForm';
import { AIAnalysis } from './components/AIAnalysis';
import { analyzeCaseWithAI } from './lib/gemini';
import { ToastContainer, ToastProps, ToastType } from './components/Toast';
import { Login } from './components/Login';
import { CaseTemplates } from './components/CaseTemplates';
import { SearchLegalArticles } from './components/SearchLegalArticles';
import { useAuth } from './contexts/AuthContext';

interface CaseInfo {
  incidentType: string;
  description: string;
  date: string;
  location: string;
}

interface PersonalDetails {
  name: string;
  age: string;
  email: string;
  contact: string;
}

interface CaseHistoryItem {
  id: string;
  type: string;
  description: string;
  date: string;
  analysis: string;
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi' | 'te' | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [userRole, setUserRole] = useState<'lawyer' | 'common' | null>(null);
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [caseHistory, setCaseHistory] = useState<CaseHistoryItem[]>([]);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showCaseTemplates, setShowCaseTemplates] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout, isLoading: authLoading } = useAuth();
  const hasAuthInitRef = useRef(false);

  useEffect(() => {
    if (!hasAuthInitRef.current) {
      hasAuthInitRef.current = true;
      return;
    }
    if (user) {
      addToast('success', 'Logged in', `Welcome, ${user.name}`);
      setShowLogin(false);
      // If still on welcome screen, advance to language selection automatically
      if (showWelcome) {
        setShowWelcome(false);
      }
    } else {
      addToast('info', 'Logged out');
    }
  }, [user]);

const translations = {
  en: {
    appName: 'Justice GPT',
    subtitle: 'Your AI-powered Legal Education Portal',
    enter: 'Enter',
    selectLanguage: 'Which language do you prefer?',
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు',
    caseInfo: 'Case Information',
    analyzeCase: 'Analyze Case',
    aiAnalysis: 'AI Analysis',
    caseSummary: 'Case Summary',
    type: 'Type',
    description: 'Description',
    date: 'Date',
    location: 'Location',
    noAnalysis: 'No analysis yet.',
    analyzing: 'Analyzing case with AI...',
    copyright: 'For educational purposes only.',
    personalDetails: 'Personal Details',
    name: 'Name',
    contact: 'Contact',
    age: 'Age',
    continue: 'Continue'
  }, hi: {
    appName: 'जस्टिस GPT',
    subtitle: 'आपका एआई-संचालित कानूनी शिक्षा पोर्टल',
    enter: 'प्रवेश करें',
    selectLanguage: 'आप किस भाषा को पसंद करते हैं?',
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు',
    caseInfo: 'मामले की जानकारी',
    analyzeCase: 'मामले का विश्लेषण करें',
    aiAnalysis: 'एआई विश्लेषण',
    caseSummary: 'मामले का सारांश',
    type: 'प्रकार',
    description: 'विवरण',
    date: 'तारीख',
    location: 'स्थान',
    noAnalysis: 'अभी तक कोई विश्लेषण नहीं।',
    analyzing: 'एआई के साथ मामले का विश्लेषण किया जा रहा है...',
    copyright: 'केवल शैक्षिक उद्देश्यों के लिए।',
    personalDetails: 'व्यक्तिगत विवरण',
    name: 'नाम',
    contact: 'संपर्क',
    age: 'आयु',
    continue: 'जारी रखें'
  },
  te: {
    appName: 'జస్టిస్ GPT',
    subtitle: 'మీ AI ఆధారిత న్యాయ విద్యా పోర్టల్',
    enter: 'ప్రవేశించండి',
    selectLanguage: 'మీరు ఏ భాషను ఇష్టపడుతున్నారు?',
    english: 'ఇంగ్లీష్',
    hindi: 'హిందీ',
    telugu: 'తెలుగు',
    caseInfo: 'కేసు సమాచారం',
    analyzeCase: 'కేసును విశ్లేషించండి',
    aiAnalysis: 'AI విశ్లేషణ',
    caseSummary: 'కేసు సారాంశం',
    type: 'రకం',
    description: 'వివరణ',
    date: 'తేదీ',
    location: 'స్థానం',
    noAnalysis: 'ఇంకా విశ్లేషణ లేదు.',
    analyzing: 'AI తో కేసును విశ్లేషిస్తున్నారు...',
    copyright: 'విద్యా ప్రయోజనాల కోసం మాత్రమే.',
    personalDetails: 'వ్యక్తిగత వివరాలు',
    name: 'పేరు',
    contact: 'సంప్రదింపు',
    age: 'వయస్సు',
    continue: 'కొనసాగించండి'
  }
};

  const t = translations[language || 'en'];

  useEffect(() => {
    // Load user-specific case history when auth state changes
    if (user) {
      const savedHistory = localStorage.getItem(`caseHistory:${user.id}`);
      if (savedHistory) {
        try {
          setCaseHistory(JSON.parse(savedHistory));
        } catch {
          setCaseHistory([]);
        }
      } else {
        setCaseHistory([]);
      }
    } else {
      setCaseHistory([]);
    }
  }, [user]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString();
    const newToast: ToastProps = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const saveToHistory = (caseInfo: CaseInfo, analysis: string) => {
    if (!user) {
      addToast('error', 'Login required', 'Please sign in to save your case');
      setShowLogin(true);
      return;
    }
    const newItem: CaseHistoryItem = {
      id: Date.now().toString(),
      type: caseInfo.incidentType,
      description: caseInfo.description,
      date: caseInfo.date,
      analysis
    };
    const updatedHistory = [newItem, ...caseHistory.slice(0, 9)];
    setCaseHistory(updatedHistory);
    localStorage.setItem(`caseHistory:${user.id}`, JSON.stringify(updatedHistory));
    addToast('success', 'Case Saved', 'Your case has been saved to history');
  };

  const handleWelcomeEnter = () => {
    if (!user) {
      addToast('info', 'Sign in required', 'Please sign in or create an account to continue');
      setShowLogin(true);
      return;
    }
    setShowWelcome(false);
  };

  const handleLanguageSelect = (lang: 'en' | 'hi' | 'te') => {
    setLanguage(lang);
  };

  const handlePersonalDetailsSubmit = (details: PersonalDetails) => {
    setPersonalDetails(details);
  };

  const handleRoleSelect = (role: 'lawyer' | 'common') => {
    setUserRole(role);
  };

  const handleCaseSubmit = async (info: CaseInfo) => {
    setCaseInfo(info);
    setIsLoading(true);
    addToast('info', 'Analyzing Case', 'Our AI is analyzing your case...');
    
    try {
      const result = await analyzeCaseWithAI(info);
      setAnalysis(result);
      saveToHistory(info, result);
      addToast('success', 'Analysis Complete', 'Your case analysis is ready!');
    } catch (error) {
      console.error('Error generating analysis:', error);
      
      // More specific error handling
      let errorMessage = 'Sorry, there was an error generating your analysis. ';
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          errorMessage += 'Please check your API configuration.';
          addToast('error', 'API Error', 'Please check your API configuration');
        } else if (error.message.includes('network')) {
          errorMessage += 'Please check your internet connection.';
          addToast('error', 'Network Error', 'Please check your internet connection');
        } else {
          errorMessage += 'Please try again later.';
          addToast('error', 'Analysis Failed', 'Please try again later');
        }
      }
      
      setAnalysis(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (analysis) {
      setAnalysis(null);
      setCaseInfo(null);
    } else if (caseInfo) {
      setCaseInfo(null);
    } else if (userRole) {
      setUserRole(null);
    } else if (personalDetails) {
      setPersonalDetails(null);
    } else if (language) {
      setLanguage(null);
    } else {
      setShowWelcome(true);
    }
  };

  const handleHistoryItemClick = (item: CaseHistoryItem) => {
    setCaseInfo({
      incidentType: item.type,
      description: item.description,
      date: item.date,
      location: ''
    });
    setAnalysis(item.analysis);
  };

  const handleClearHistory = () => {
    if (!user) {
      addToast('error', 'Login required', 'Sign in to manage your history');
      setShowLogin(true);
      return;
    }
    setCaseHistory([]);
    localStorage.removeItem(`caseHistory:${user.id}`);
    addToast('info', 'History Cleared', 'All case history has been cleared');
  };

  const handleCaseTemplateSelect = (template: any) => {
    setShowCaseTemplates(false);
    addToast('success', 'Template Selected', `Using ${template.title} template`);
    // Here you would populate the case form with template data
  };

  const handleSearchClose = () => {
    setShowSearch(false);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-amber-50 relative overflow-hidden">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Simple Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
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

      {/* Simple Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Scale, Sparkles, Star, Zap].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/20"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Icon size={20 + i * 6} />
          </motion.div>
        ))}
          </div>

      {/* Header */}
      {!showWelcome && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative z-30 bg-gradient-to-r from-white/90 via-blue-50/90 to-amber-50/90 backdrop-blur-xl border-b border-white/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-amber-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </motion.button>

            {/* Title */}
            <motion.h1
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-amber-700 bg-clip-text text-transparent"
            >
              Justice GPT
            </motion.h1>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <motion.button
                onClick={() => setShowSearch(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                <Search className="w-5 h-5" />
                Search
              </motion.button>

              {/* Case Templates Button */}
              <motion.button
                onClick={() => setShowCaseTemplates(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                <FileText className="w-5 h-5" />
                Templates
              </motion.button>

              {/* Case History Button */}
              <motion.button
                onClick={() => setShowHistory(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-slate-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <History className="w-5 h-5" />
                History
              </motion.button>

              {/* Auth Controls */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-white/80 text-slate-700 font-medium rounded-xl border border-white/60 shadow">
                    Hi, {user.name}
                  </div>
                  <motion.button
                    onClick={() => logout()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-rose-700 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-rose-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowLogin(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-300"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </motion.header>
      )}

      {/* Case History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-white via-blue-50 to-amber-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-blue-700 to-amber-600 bg-clip-text text-transparent"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Case History
                </motion.h2>
                <motion.button
                  onClick={() => setShowHistory(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 text-2xl font-bold text-blue-700 hover:text-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 transition-all duration-200"
                  aria-label="Close case history"
                  tabIndex={0}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Case History List */}
              <motion.div className="space-y-4 max-h-96 overflow-y-auto">
                {caseHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 text-slate-500"
                  >
                    <History className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No cases in history yet</p>
                  </motion.div>
                ) : (
                  caseHistory.map((item, index) => (
                <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleHistoryItemClick(item)}
                      className="bg-gradient-to-r from-white to-blue-50/80 rounded-2xl p-4 shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:from-blue-50 hover:to-amber-50/80 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{item.type}</h3>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.description}</p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                        <div className="text-blue-600">
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </motion.div>
                  ))
              )}
              </motion.div>

              {/* Clear History Button */}
              {caseHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 pt-4 border-t border-slate-200"
                >
                  <motion.button
                    onClick={handleClearHistory}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    Clear All History
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="w-full h-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {showWelcome && (
            <WelcomeScreen key="welcome" onEnter={handleWelcomeEnter} t={t} />
          )}

          {!showWelcome && !language && (
            <div className="w-full max-w-md">
              <LanguageSelection
                key="lang-select"
                onSelect={handleLanguageSelect}
                onBack={() => setShowWelcome(true)}
                t={t}
              />
            </div>
          )}

          {!showWelcome && language && !personalDetails && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md"
            >
              <PersonalDetailsForm
                onSubmit={handlePersonalDetailsSubmit}
                onBack={() => setLanguage(null)}
                t={t}
              />
            </motion.div>
          )}

          {!showWelcome && language && personalDetails && !userRole && (
            <div className="w-full max-w-2xl">
              <RoleSelection
                key="role-select"
                onSelect={handleRoleSelect}
                onBack={() => setPersonalDetails(null)}
                t={t}
              />
            </div>
          )}

          {!showWelcome && language && personalDetails && userRole && !caseInfo && !analysis && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-4xl"
            >
              {userRole === 'lawyer' ? (
                <LawyerCaseForm
                  onSubmit={handleCaseSubmit}
                  t={t}
                />
              ) : (
                <CommonPersonCaseForm
                  onSubmit={handleCaseSubmit}
                  t={t}
                />
              )}
            </motion.div>
          )}

          {!showWelcome && language && personalDetails && userRole && caseInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-6xl h-full"
            >
              <AIAnalysis
                analysis={analysis}
                isLoading={isLoading}
                t={t}
                userRole={userRole}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simple Background Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} />
        )}
      </AnimatePresence>

      {/* Case Templates Modal */}
      <AnimatePresence>
        {showCaseTemplates && (
          <CaseTemplates 
            onSelectTemplate={handleCaseTemplateSelect}
            onClose={() => setShowCaseTemplates(false)}
          />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <SearchLegalArticles onClose={handleSearchClose} />
        )}
      </AnimatePresence>
    </div>
  );
}

