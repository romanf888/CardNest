import React, { useState, useEffect } from 'react';
import { 
  getStoredCards, 
  saveStoredCards, 
  getStoredCodes, 
  saveStoredCodes, 
  getStoredCollection, 
  getRedemptionHistory,
  saveStoredCollection, 
  subscribeToLiveEvents,
  redeemDropCode,
  resetToDefaults,
  isAdminSessionActive,
  setAdminSessionActive,
  mergeCollections
} from './utils/storage';
import { 
  auth, 
  ADMIN_EMAIL, 
  subscribeToUserCloudCollection, 
  saveUserCollectionToCloud 
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { CodeRedeemSection } from './components/CodeRedeemSection';
import { CardBinder } from './components/CardBinder';
import { AdminPanel } from './components/AdminPanel';
import { CardRevealModal } from './components/CardRevealModal';
import { AdminGateModal } from './components/AdminGateModal';
import { playSuccessChime } from './utils/audio';
import { Lock, Sparkles, Shield, Cloud } from 'lucide-react';

export default function App() {
  const [cards, setCards] = useState(() => getStoredCards());
  const [codes, setCodes] = useState(() => getStoredCodes());
  const [collection, setCollection] = useState(() => getStoredCollection());
  const [history, setHistory] = useState(() => getRedemptionHistory());
  const [activeTab, setActiveTab] = useState('redeem'); // 'redeem' | 'binder' | 'admin'
  
  // User Auth & Session
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminSession, setIsAdminSession] = useState(() => isAdminSessionActive());
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);

  // Reveal modal state
  const [revealData, setRevealData] = useState(null);

  // 1. Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // If user logged in as admin email, grant admin session automatically
        if (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdminSession(true);
          setAdminSessionActive(true);
        }

        // Subscribe to real-time Firestore user collection
        const unsubscribeCloudCollection = subscribeToUserCloudCollection(user.uid, (cloudCollection) => {
          if (Array.isArray(cloudCollection)) {
            const currentLocal = getStoredCollection();
            const merged = mergeCollections(currentLocal, cloudCollection);
            setCollection(merged);
            saveStoredCollection(merged);
          }
        });

        // Initial sync: push any local cards up to cloud
        const localNow = getStoredCollection();
        if (localNow.length > 0) {
          saveUserCollectionToCloud(user.uid, localNow);
        }

        return () => unsubscribeCloudCollection();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Broadcast and multi-window live sync
  useEffect(() => {
    const unsubscribe = subscribeToLiveEvents(() => {
      setCards(getStoredCards());
      setCodes(getStoredCodes());
      setCollection(getStoredCollection());
      setHistory(getRedemptionHistory());
      setIsAdminSession(isAdminSessionActive());
    });

    // Check URL parameters for direct drop code (e.g. ?code=BIENVENUE) or admin route (?admin)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code');
      const isAdminRoute = params.has('admin');

      if (isAdminRoute) {
        if (isAdminSessionActive()) {
          setActiveTab('admin');
        } else {
          setIsAdminGateOpen(true);
        }
      }

      if (urlCode) {
        setTimeout(() => {
          const res = redeemDropCode(urlCode, currentUser?.uid, currentUser?.displayName || currentUser?.email);
          if (res.success && res.card) {
            playSuccessChime();
            setCards(getStoredCards());
            setCodes(getStoredCodes());
            setCollection(getStoredCollection());
            setHistory(getRedemptionHistory());
            setRevealData({
              card: res.card,
              collected: res.collectedCard,
              isAlreadyOwned: res.isAlreadyOwned
            });
          }
        }, 300);
      }
    }

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddCard = (newCard) => {
    const updated = [newCard, ...cards];
    setCards(updated);
    saveStoredCards(updated);
  };

  const handleDeleteCard = (cardId) => {
    const updated = cards.filter(c => c.id !== cardId);
    setCards(updated);
    saveStoredCards(updated);
  };

  const handleAddCode = (newCode) => {
    const updated = [newCode, ...codes];
    setCodes(updated);
    saveStoredCodes(updated);
  };

  const handleToggleCodeActive = (codeId) => {
    const updated = codes.map(c => 
      c.id === codeId ? { ...c, isActive: !c.isActive } : c
    );
    setCodes(updated);
    saveStoredCodes(updated);
  };

  const handleDeleteCode = (codeId) => {
    const updated = codes.filter(c => c.id !== codeId);
    setCodes(updated);
    saveStoredCodes(updated);
  };

  const handleCardRedeemed = (result) => {
    if (result.card) {
      setCards(getStoredCards());
      setCodes(getStoredCodes());
      const updatedColl = getStoredCollection();
      setCollection(updatedColl);
      setHistory(getRedemptionHistory());
      setRevealData({
        card: result.card,
        collected: result.collectedCard,
        isAlreadyOwned: result.isAlreadyOwned
      });

      // Also persist to cloud if user is logged in
      if (currentUser?.uid) {
        saveUserCollectionToCloud(currentUser.uid, updatedColl);
      }
    }
  };

  const handleResetData = () => {
    resetToDefaults();
    setCards(getStoredCards());
    setCodes(getStoredCodes());
    setCollection(getStoredCollection());
    setHistory(getRedemptionHistory());
  };

  const handleTabChange = (targetTab) => {
    if (targetTab === 'admin') {
      const isAuthorized = isAdminSession || (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      if (isAuthorized) {
        setActiveTab('admin');
      } else {
        setIsAdminGateOpen(true);
      }
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleAdminGateSuccess = () => {
    setIsAdminSession(true);
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-['Outfit',sans-serif]">
      
      {/* Background Ambience Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collectedCount={collection.length}
        currentUser={currentUser}
        isAdminSession={isAdminSession}
        onOpenAdminGate={() => setIsAdminGateOpen(true)}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        
        {/* VIEW 1: REDEEM CODE (USER SIDE) */}
        {activeTab === 'redeem' && (
          <CodeRedeemSection
            activeCodes={codes.filter(c => c.isActive)}
            onCardRedeemed={handleCardRedeemed}
            onOpenBinder={() => setActiveTab('binder')}
            collectedCount={collection.length}
            currentUserId={currentUser?.uid}
            userDisplayName={currentUser?.displayName || currentUser?.email}
          />
        )}

        {/* VIEW 2: USER BINDER (USER SIDE) */}
        {activeTab === 'binder' && (
          <CardBinder
            allCards={cards}
            collection={collection}
            onSelectCodeMode={() => setActiveTab('redeem')}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 3: ADMIN PANEL (CREATOR / STREAMER SIDE) */}
        {activeTab === 'admin' && (
          <AdminPanel
            cards={cards}
            codes={codes}
            history={history}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onAddCode={handleAddCode}
            onToggleCodeActive={handleToggleCodeActive}
            onDeleteCode={handleDeleteCode}
            onResetData={handleResetData}
            onExitAdmin={() => setActiveTab('redeem')}
          />
        )}
      </main>

      {/* Card Reveal 3D Opening Modal */}
      {revealData && (
        <CardRevealModal
          card={revealData.card}
          collectedCard={revealData.collected}
          isAlreadyOwned={revealData.isAlreadyOwned}
          onClose={() => setRevealData(null)}
          onOpenBinder={() => {
            setRevealData(null);
            setActiveTab('binder');
          }}
        />
      )}

      {/* Secret Admin Gate Lock Modal */}
      <AdminGateModal
        isOpen={isAdminGateOpen}
        onClose={() => setIsAdminGateOpen(false)}
        onSuccess={handleAdminGateSuccess}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900/90 bg-[#070A10]/90 py-6 text-center text-xs text-slate-500 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Rajdhani'] font-black uppercase text-amber-400 text-sm tracking-wider">LiveCards</span>
            <span>• Collection exclusive pour le stream</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('redeem')}
              className={`hover:text-amber-400 transition ${activeTab === 'redeem' ? 'text-amber-400 font-bold' : ''}`}
            >
              Entrer un code
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('binder')}
              className={`hover:text-amber-400 transition ${activeTab === 'binder' ? 'text-amber-400 font-bold' : ''}`}
            >
              Mon Classeur ({collection.length})
            </button>
            <span>•</span>
            {/* Discrete Streamer Access */}
            <button
              onClick={() => {
                if (isAdminSession || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                  setActiveTab('admin');
                } else {
                  setIsAdminGateOpen(true);
                }
              }}
              className="text-slate-500 hover:text-purple-400 transition flex items-center gap-1.5"
              title="Accès réservé au créateur / streamer"
            >
              <Lock className="w-3 h-3" />
              <span>Régie Streamer</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
