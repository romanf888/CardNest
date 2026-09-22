import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  X, 
  LogOut, 
  Cloud, 
  ShieldAlert, 
  Crown,
  ChevronDown,
  Lock
} from 'lucide-react';
import { isSoundEnabled, toggleSound } from '../utils/audio';
import { signInWithGoogle, signOutUser, ADMIN_EMAIL } from '../firebase';

export const Navbar = ({
  activeTab,
  onTabChange,
  collectedCount,
  currentUser,
  isAdminSession,
  onOpenAdminGate
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    setIsSigningIn(false);
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await signOutUser();
  };

  const isUserAdmin = (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || isAdminSession;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div
            onClick={() => onTabChange('redeem')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-['Rajdhani'] font-black text-xl tracking-wider text-white uppercase leading-none flex items-center gap-1">
                Live<span className="text-amber-400">Cards</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                Collection Stream
              </span>
            </div>
          </div>

          {/* Navigation Controls (Pure Viewer Focus: Drops & Classeur) */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
            
            <button
              onClick={() => onTabChange('redeem')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'redeem'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Entrer un Code</span>
            </button>

            <button
              onClick={() => onTabChange('binder')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 relative ${
                activeTab === 'binder'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mon Classeur</span>
              {collectedCount > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'binder' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400 text-slate-950'
                }`}>
                  {collectedCount}
                </span>
              )}
            </button>

          </nav>

          {/* Right Action Icons & Google Account Integration */}
          <div className="flex items-center gap-2">
            
            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title={soundOn ? 'Couper les effets sonores' : 'Activer les effets sonores'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Help / Guide */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title="Comment ça fonctionne ?"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </button>

            {/* Google Account Section */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'Compte'} 
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-lg object-cover ring-1 ring-amber-400/50"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white leading-tight max-w-[100px] truncate">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5">
                      <Cloud className="w-2.5 h-2.5" /> Synchronisé
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.displayName || 'Utilisateur'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {currentUser.email}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Cartes sauvegardées :</span>
                        <span className="font-mono font-bold text-amber-400">{collectedCount}</span>
                      </div>
                    </div>

                    {/* If Admin / Streamer */}
                    {isUserAdmin && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onTabChange('admin');
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-2 transition"
                      >
                        <Crown className="w-4 h-4 text-purple-400" />
                        <span>Ouvrir Régie & Panel Admin</span>
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="hidden sm:inline">{isSigningIn ? 'Connexion...' : 'Compte Google'}</span>
                <span className="sm:hidden">Connexion</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Guide / How it Works Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-['Rajdhani'] font-black uppercase text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Fonctionnement du Système LiveCards
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block font-semibold mb-1">🎮 1. Pour les spectateurs & abonnés :</strong>
                Pendant le live stream, le streamer annonce un code de drop (ex: <code className="text-amber-400 font-bold font-mono">BIENVENUE</code>). Tu le saisis dans "Entrer un Code" pour déballer ta carte avec une animation 3D et l'ajouter à ton classeur virtuel avec son numéro de tirage unique !
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block font-semibold mb-1">☁️ 2. Synchronisation Multi-Appareils :</strong>
                Connecte-toi avec ton compte Google en 1 clic pour synchroniser toutes tes cartes gagnées sur ton téléphone, tablette ou PC !
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <strong className="text-white block font-semibold mb-1">✨ 3. Cartes Holographiques Interactives :</strong>
                Toutes les cartes réagissent en temps réel à l'inclinaison de ta souris avec des reflets prismatiques foil et des effets de dorure pour les cartes Mythiques.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase transition"
            >
              J'ai compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
