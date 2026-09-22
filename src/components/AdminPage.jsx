import React, { useState } from 'react';
import { AdminPanel } from './AdminPanel';
import { Lock, Key, ArrowLeft, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import { getStoredAdminPin, setAdminSessionActive, DEFAULT_ADMIN_PIN } from '../utils/storage';
import { ADMIN_EMAIL, signInWithGoogle } from '../firebase';

export const AdminPage = ({
  cards,
  codes,
  history,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onAddCode,
  onToggleCodeActive,
  onDeleteCode,
  onResetData,
  onNavigateHome,
  currentUser,
  isAdminSession,
  setIsAdminSession
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isGoogleAdmin = currentUser?.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isAuthorized = isAdminSession || isGoogleAdmin;

  const handleUnlockWithPin = (e) => {
    e.preventDefault();
    setError(null);
    const currentPin = getStoredAdminPin();
    if (pinInput.trim() === currentPin || pinInput.trim() === DEFAULT_ADMIN_PIN) {
      setAdminSessionActive(true);
      setIsAdminSession(true);
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
        setIsAdminSession(true);
      } else {
        setError(`Connecté avec ${res.user.email}. Seul l'administrateur (${ADMIN_EMAIL}) ou le détenteur du code secret peut accéder au panel.`);
      }
    } else {
      setError(res.error || 'Erreur lors de la connexion Google.');
    }
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col items-center justify-center p-4">
        
        {/* Back Link to Public Site */}
        <div className="w-full max-w-md mb-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au site public des spectateurs (/)</span>
          </button>
        </div>

        {/* Standalone Admin Gate Box */}
        <article className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <header className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 mx-auto flex items-center justify-center text-purple-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
              Lien dédié : /admin
            </span>
            <h1 className="font-['Rajdhani'] font-black uppercase text-2xl text-white tracking-wide">
              Espace Régie & Administration
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Cet espace est séparé du site public. Il permet au créateur de gérer le catalogue de cartes, les codes et OBS.
            </p>
          </header>

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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-purple-400 focus:outline-none text-white font-mono text-sm tracking-widest placeholder:text-slate-600 transition"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Rajdhani'] font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Accéder au Panel Admin</span>
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

          {/* Quick Google Sign in for Admin */}
          <button
            type="button"
            onClick={handleQuickGoogleAdmin}
            disabled={isLoggingIn}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isLoggingIn ? 'Connexion en cours...' : 'Connexion Google (romanferriere4@gmail.com)'}</span>
          </button>

        </article>

      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-4 sm:p-8 flex flex-col justify-between">
      <AdminPanel
        cards={cards}
        codes={codes}
        history={history}
        onAddCard={onAddCard}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
        onAddCode={onAddCode}
        onToggleCodeActive={onToggleCodeActive}
        onDeleteCode={onDeleteCode}
        onResetData={onResetData}
        onExitAdmin={onNavigateHome}
      />
    </div>
  );
};
