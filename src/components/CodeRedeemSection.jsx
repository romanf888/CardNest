import React, { useState } from 'react';
import { redeemDropCode } from '../utils/storage';
import { playSuccessChime, playErrorBeep, playCardFlip } from '../utils/audio';
import { 
  Sparkles, 
  Send, 
  Flame, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Gift, 
  ArrowRight,
  Clock,
  Radio,
  Copy
} from 'lucide-react';

export const CodeRedeemSection = ({
  activeCodes,
  onCardRedeemed,
  onOpenBinder,
  collectedCount,
  currentUserId,
  userDisplayName
}) => {
  const [codeInputValue, setCodeInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanCode = codeInputValue.trim().toUpperCase();
    if (!cleanCode) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const result = redeemDropCode(cleanCode, currentUserId, userDisplayName);
      setIsSubmitting(false);

      if (result.success) {
        playCardFlip();
        setTimeout(() => playSuccessChime(), 300);
        setCodeInputValue('');
        onCardRedeemed(result);
      } else {
        playErrorBeep();
        setErrorMessage(result.message);
      }
    }, 250);
  };

  const handleQuickCodeClick = (code) => {
    setCodeInputValue(code);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-4">
      
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>Drops de Cartes en Direct de Stream</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-['Rajdhani'] font-black uppercase text-white tracking-wide">
          Débloque tes <span className="text-amber-400">Cartes Exclusives</span>
        </h1>
        
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Le streamer a partagé un code secret pendant le live ? Saisis-le ci-dessous pour déballer ta carte de collection et l'ajouter à ton classeur !
        </p>
      </div>

      {/* Main Redeem Box */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-500/20 via-slate-800 to-slate-900 shadow-2xl">
        <div className="rounded-[22px] bg-[#0A0E17] p-6 md:p-8 space-y-6 border border-slate-800/80">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <input
                  type="text"
                  value={codeInputValue}
                  onChange={(e) => {
                    setCodeInputValue(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="ENTRE TON CODE (EX: BIENVENUE)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-amber-400 focus:outline-none text-white font-mono font-bold text-base md:text-lg tracking-wider uppercase placeholder:text-slate-600 transition shadow-inner"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !codeInputValue.trim()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-40 disabled:hover:from-amber-400 disabled:cursor-not-allowed text-slate-950 font-['Rajdhani'] font-black text-base uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition transform active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    <span>Déballer la Carte</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>

          {/* Quick Active Codes Shortcuts */}
          {activeCodes.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Codes Actifs en Direct ({activeCodes.length}) :
                </span>
                <span className="text-[11px] text-slate-500">Clique pour tester immédiatement</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeCodes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleQuickCodeClick(c.code)}
                    className="group px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400/60 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
                  >
                    <span className="font-mono font-bold text-amber-400">{c.code}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate max-w-[130px]">
                      {c.title}
                    </span>
                    <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono">
                      {c.maxUses === -1 ? '∞' : `${c.usedCount}/${c.maxUses}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Binder Banner Link */}
      <div className="p-5 rounded-2xl bg-[#0D121F]/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Consulter ta collection de cartes</h4>
            <p className="text-xs text-slate-400">
              {collectedCount === 0 
                ? 'Tu n\'as pas encore de cartes. Rentre un code ci-dessus pour démarrer !' 
                : `Tu possèdes actuellement ${collectedCount} carte(s) dans ton classeur personnel.`
              }
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBinder}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
        >
          <span>Ouvrir mon Classeur</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

    </div>
  );
};
