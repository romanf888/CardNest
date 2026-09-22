import React, { useState } from 'react';
import { ShieldAlert, Key, Lock, ArrowRight, X, AlertCircle, Sparkles } from 'lucide-react';
import { getStoredAdminPin, setAdminSessionActive, DEFAULT_ADMIN_PIN } from '../utils/storage';
import { ADMIN_EMAIL, signInWithGoogle } from '../firebase';

export const AdminGateModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const currentPin = getStoredAdminPin();
  const isAdminEmail = currentUser && currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleUnlockWithPin = (e) => {
    e.preventDefault();
    setError(null);
    if (pinInput.trim() === currentPin || pinInput.trim() === DEFAULT_ADMIN_PIN) {
      setAdminSessionActive(true);
      onSuccess();
      onClose();
    } else {
      setError('Code de sécurité incorrect. Vérifie ton code créateur.');
    }
  };

  const handleQuickGoogleAdmin = async () => {
    setIsLoggingIn(true);
    setError(null);
    const res = await signInWithGoogle();
    setIsLoggingIn(false);
    if (res.success && res.user) {
      if (res.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setAdminSessionActive(true);
        onSuccess();
        onClose();
      } else {
        setError(`Connecté avec ${res.user.email}. Seul l'administrateur (${ADMIN_EMAIL}) ou le détenteur du code secret peut accéder au panel.`);
      }
    } else {
      setError(res.error || 'Erreur lors de la connexion Google.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-['Rajdhani'] font-black uppercase text-2xl text-white tracking-wide">
            Espace Créateur & Régie OBS
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Cet espace d'administration est réservé au streamer pour créer des cartes et gérer les drops en live.
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleUnlockWithPin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Code Secret Streamer (Master Key)</span>
              <span className="text-[10px] text-amber-400/80 font-mono">Défaut: {DEFAULT_ADMIN_PIN}</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Entre le code créateur..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 focus:outline-none text-white font-mono text-sm tracking-widest placeholder:text-slate-600 transition"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!pinInput.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition"
          >
            <span>Déverrouiller le Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-950 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            OU
          </span>
        </div>

        {/* Quick Google Sign in */}
        <button
          onClick={handleQuickGoogleAdmin}
          disabled={isLoggingIn}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>{isLoggingIn ? 'Connexion en cours...' : 'Connexion rapide Google Créateur'}</span>
        </button>

      </div>
    </div>
  );
};
