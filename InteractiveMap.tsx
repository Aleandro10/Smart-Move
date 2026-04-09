import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, ArrowRight, Globe, User, Train, Bus, Plane, Sparkles } from 'lucide-react';
import { t } from '../i18n';

export interface UserProfile {
  firstName: string;
  lastName: string;
  language: string;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState('it');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;
    onComplete({ firstName: firstName.trim(), lastName: lastName.trim(), language });
  };

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-pink rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-white overflow-hidden"
          >
            {/* Vibrant Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, -50, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-pink-400 to-purple-500 blur-3xl opacity-30 mix-blend-multiply"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  x: [0, -50, 0],
                  y: [0, 50, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 blur-3xl opacity-30 mix-blend-multiply"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  x: [0, 30, 0],
                  y: [0, 30, 0]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 blur-3xl opacity-30 mix-blend-multiply"
              />
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              {/* Floating Icons Cluster */}
              <div className="relative w-full h-64 flex items-center justify-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="absolute z-20 bg-white p-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                >
                  <Navigation className="w-16 h-16 text-brand-blue" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                >
                  <Bus className="w-8 h-8 text-brand-pink" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-4 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                >
                  <Train className="w-8 h-8 text-brand-green" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-8 right-12 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50"
                >
                  <Plane className="w-8 h-8 text-brand-yellow" />
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-12 left-12"
                >
                  <Sparkles className="w-8 h-8 text-brand-yellow" />
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-10"
              >
                <h1 className="text-5xl font-extrabold tracking-tight text-brand-dark mb-4">
                  Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-pink">Move</span>
                </h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{t(language, 'introTitle')}</h2>
                <p className="text-gray-500 text-lg leading-relaxed px-4">{t(language, 'introDesc')}</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full space-y-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('form')}
                  className="w-full bg-brand-dark text-white font-bold text-xl py-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-3 group"
                >
                  {t(language, 'startNow')}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <div className="flex justify-center">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-100/50 backdrop-blur-sm border border-gray-200 rounded-full py-2 px-6 text-gray-600 font-medium focus:ring-2 focus:ring-brand-blue outline-none transition-all cursor-pointer appearance-none text-center hover:bg-gray-100"
                  >
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="bg-white rounded-[40px] shadow-2xl p-8 w-full max-w-md relative z-10"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="bg-brand-blue/10 p-3 rounded-2xl shadow-sm transform -rotate-6">
                <Navigation className="w-10 h-10 text-brand-pink" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark">SmartMove</h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">{t(language, 'welcome')}</h2>
              <p className="text-gray-500">{t(language, 'onboardingDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t(language, 'firstName')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t(language, 'firstNamePlaceholder')} 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-brand-dark font-semibold focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t(language, 'lastName')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t(language, 'lastNamePlaceholder')} 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-brand-dark font-semibold focus:ring-2 focus:ring-brand-blue focus:bg-white outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
              </motion.div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit" 
                disabled={!firstName.trim()}
                className="w-full bg-brand-dark text-white font-bold text-lg py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {t(language, 'start')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
