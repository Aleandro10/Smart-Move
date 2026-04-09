import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Home, Ticket as TicketIcon, Building2, LogOut, CreditCard, Loader2, CheckCircle2, X } from 'lucide-react';
import RouteSearch from './components/RouteSearch';
import Tickets from './components/Tickets';
import Companies from './components/Companies';
import Onboarding, { UserProfile } from './components/Onboarding';
import { RouteOption } from './services/gemini';
import { t } from './i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'companies'>('home');
  const [tickets, setTickets] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartmove_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [paymentState, setPaymentState] = useState<{
    isOpen: boolean;
    route: RouteOption | null;
    status: 'idle' | 'processing' | 'success';
  }>({ isOpen: false, route: null, status: 'idle' });

  const handleOnboardingComplete = (profile: UserProfile) => {
    localStorage.setItem('smartmove_profile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem('smartmove_profile');
    setUserProfile(null);
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const handleBook = (route: RouteOption) => {
    setPaymentState({ isOpen: true, route, status: 'idle' });
  };

  const confirmPayment = () => {
    if (!paymentState.route) return;
    
    setPaymentState(prev => ({ ...prev, status: 'processing' }));
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentState(prev => ({ ...prev, status: 'success' }));
      
      // Add ticket and close modal after success
      setTimeout(() => {
        const newTicket = {
          ...paymentState.route,
          date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        setTickets(prev => [newTicket, ...prev]);
        setPaymentState({ isOpen: false, route: null, status: 'idle' });
        setActiveTab('tickets');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50 font-sans selection:bg-brand-pink selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand-blue to-brand-pink p-2 rounded-xl shadow-sm transform -rotate-6">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-dark leading-none">SmartMove</h1>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {t(userProfile.language, 'hello')} {userProfile.firstName}!
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            title="Cambia utente"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === 'home' && <RouteSearch onBook={handleBook} lang={userProfile.language} />}
            {activeTab === 'tickets' && <Tickets tickets={tickets} userProfile={userProfile} />}
            {activeTab === 'companies' && <Companies lang={userProfile.language} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentState.isOpen && paymentState.route && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl p-6 w-full max-w-sm relative overflow-hidden"
            >
              {paymentState.status === 'idle' && (
                <>
                  <button 
                    onClick={() => setPaymentState({ isOpen: false, route: null, status: 'idle' })}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="text-center mb-6 mt-2">
                    <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-brand-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-dark">{t(userProfile.language, 'payment')}</h3>
                    <p className="text-gray-500 mt-1">{paymentState.route.company} - {paymentState.route.type}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-medium">Totale</span>
                      <span className="text-2xl font-bold text-brand-dark">{paymentState.route.price}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <input 
                      type="text" 
                      placeholder={t(userProfile.language, 'cardPlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-blue outline-none"
                      defaultValue="**** **** **** 4242"
                    />
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-blue outline-none"
                        defaultValue="12/28"
                      />
                      <input 
                        type="text" 
                        placeholder="CVC"
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-blue outline-none"
                        defaultValue="123"
                      />
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmPayment}
                    className="w-full bg-brand-dark text-white font-bold text-lg py-4 rounded-2xl shadow-md flex items-center justify-center gap-2"
                  >
                    {t(userProfile.language, 'payNow')} {paymentState.route.price}
                  </motion.button>
                </>
              )}

              {paymentState.status === 'processing' && (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-brand-blue animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-brand-dark">{t(userProfile.language, 'processing')}</h3>
                </div>
              )}

              {paymentState.status === 'success' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="bg-brand-green/20 p-4 rounded-full mb-4">
                    <CheckCircle2 className="w-16 h-16 text-brand-green" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark">{t(userProfile.language, 'paymentSuccess')}</h3>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-0 w-full z-50 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full flex justify-around p-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-full transition-colors w-20 ${activeTab === 'home' ? 'text-brand-pink' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'home' && (
                <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-brand-pink/10 rounded-full" />
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative z-10 flex flex-col items-center gap-1">
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t(userProfile.language, 'navFind')}</span>
              </motion.div>
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-full transition-colors w-20 ${activeTab === 'tickets' ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'tickets' && (
                <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-brand-blue/10 rounded-full" />
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative z-10 flex flex-col items-center gap-1">
                <div className="relative">
                  <TicketIcon className="w-6 h-6" />
                  {tickets.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {tickets.length}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t(userProfile.language, 'navTickets')}</span>
              </motion.div>
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-full transition-colors w-20 ${activeTab === 'companies' ? 'text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'companies' && (
                <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-brand-green/10 rounded-full" />
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative z-10 flex flex-col items-center gap-1">
                <Building2 className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t(userProfile.language, 'navCompanies')}</span>
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
