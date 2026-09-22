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
import { AdminPage } from './components/AdminPage';
import { CardRevealModal } from './components/CardRevealModal';
import { playSuccessChime } from './utils/audio';
import { Lock, Sparkles, Shield, Cloud, ArrowRight } from 'lucide-react';

function getInitialRoute() {
  if (typeof window === 'undefined') return 'public';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  if (path.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
    return 'admin';
  }
  return 'public';
}

export default function App() {
  const [cards, setCards] = useState(() => getStoredCards());
  const [codes, setCodes] = useState(() => getStoredCodes());
  const [collection, setCollection] = useState(() => getStoredCollection());
  const [history, setHistory] = useState(() => getRedemptionHistory());
  
  // High-Level Route: 'public' | 'admin'
  const [route, setRoute] = useState(() => getInitialRoute());
  
  // Public sub-tabs: 'redeem' | 'binder'
  const [publicTab, setPublicTab] = useState('redeem');

  // User Auth & Admin Session
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminSession, setIsAdminSession] = useState(() => isAdminSessionActive());

  // Reveal modal state
  const [revealData, setRevealData] = useState(null);

  // Synchronize browser history / URL with route
  const navigateTo = (targetRoute) => {
    setRoute(targetRoute);
    if (typeof window !== 'undefined') {
      if (targetRoute === 'admin') {
        window.history.pushState({ route: 'admin' }, '', '/admin');
      } else {
        window.history.pushState({ route: 'public' }, '', '/');
      }
    }
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

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

    // Check URL parameters for direct drop code (e.g. ?code=BIENVENUE)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code');

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

  // Card Management Actions (Add, Update, Delete)
  const handleAddCard = (newCard) => {
    const updated = [newCard, ...cards];
    setCards(updated);
    saveStoredCards(updated);
  };

  const handleUpdateCard = (updatedCard) => {
    const updated = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
    setCards(updated);
    saveStoredCards(updated);
  };

  const handleDeleteCard = (cardId) => {
    const updated = cards.filter(c => c.id !== cardId);
    setCards(updated);
    saveStoredCards(updated);
  };

  // Code Management Actions
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

  // ================= ROUTE 1: DEDICATED SEPARATE ADMIN PAGE (/admin) =================
  if (route === 'admin') {
    return (
      <AdminPage
        cards={cards}
        codes={codes}
        history={history}
        onAddCard={handleAddCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onAddCode={handleAddCode}
        onToggleCodeActive={handleToggleCodeActive}
        onDeleteCode={handleDeleteCode}
        onResetData={handleResetData}
        onNavigateHome={() => navigateTo('public')}
        currentUser={currentUser}
        isAdminSession={isAdminSession}
        setIsAdminSession={setIsAdminSession}
      />
    );
  }

  // ================= ROUTE 2: PUBLIC VIEWER SITE (/) =================
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-['Outfit',sans-serif]">
      
      {/* Background Ambience Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation (Pure Viewer Focus) */}
      <Navbar
        activeTab={publicTab}
        onTabChange={(tab) => {
          if (tab === 'admin') {
            navigateTo('admin');
          } else {
            setPublicTab(tab);
          }
        }}
        collectedCount={collection.length}
        currentUser={currentUser}
        isAdminSession={isAdminSession}
        onOpenAdminGate={() => navigateTo('admin')}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        
        {/* PUBLIC VIEW 1: REDEEM CODE */}
        {publicTab === 'redeem' && (
          <CodeRedeemSection
            activeCodes={codes.filter(c => c.isActive)}
            onCardRedeemed={handleCardRedeemed}
            onOpenBinder={() => setPublicTab('binder')}
            collectedCount={collection.length}
            currentUserId={currentUser?.uid}
            userDisplayName={currentUser?.displayName || currentUser?.email}
          />
        )}

        {/* PUBLIC VIEW 2: USER BINDER */}
        {publicTab === 'binder' && (
          <CardBinder
            allCards={cards}
            collection={collection}
            onSelectCodeMode={() => setPublicTab('redeem')}
            currentUser={currentUser}
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
            setPublicTab('binder');
          }}
        />
      )}

      {/* Public Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900/90 bg-[#070A10]/90 py-6 text-center text-xs text-slate-500 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Rajdhani'] font-black uppercase text-amber-400 text-sm tracking-wider">LiveCards</span>
            <span>• Collection exclusive pour le stream</span>
          </div>

          <nav className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setPublicTab('redeem')}
              className={`hover:text-amber-400 transition cursor-pointer ${publicTab === 'redeem' ? 'text-amber-400 font-bold' : ''}`}
            >
              Entrer un code
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setPublicTab('binder')}
              className={`hover:text-amber-400 transition cursor-pointer ${publicTab === 'binder' ? 'text-amber-400 font-bold' : ''}`}
            >
              Mon Classeur ({collection.length})
            </button>
            <span>•</span>
            {/* Direct Separate Link to /admin */}
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('admin');
              }}
              className="text-slate-500 hover:text-purple-400 transition flex items-center gap-1.5 font-medium cursor-pointer"
              title="Accéder au panel d'administration séparé (/admin)"
            >
              <Lock className="w-3 h-3" />
              <span>Accès Régie (/admin)</span>
            </a>
          </nav>
        </div>
      </footer>

    </div>
  );
}
