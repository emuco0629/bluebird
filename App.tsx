
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import LogPage from './pages/LogPage';
import ItemPage from './pages/ItemPage';
import ForestPage from './pages/ForestPage'; // Import new page
import HawkTopicModal from './components/HawkTopicModal';
import ForestConsentModal from './components/ForestConsentModal'; // Import new modal
import OnboardingPage from './pages/OnboardingPage';

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(() => localStorage.getItem('hasOnboarded') === 'true');

  const handleStart = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setHasOnboarded(true);
  };

  if (!hasOnboarded) {
    return <OnboardingPage onStart={handleStart} />;
  }

  return (
    <AppProvider>
      <HashRouter>
        <div className="bg-sky-50 text-gray-800 min-h-screen font-sans flex flex-col items-center">
          <div className="w-full max-w-md mx-auto flex flex-col h-screen">
            <header className="text-center py-4 border-b border-sky-200">
              <h1 className="text-2xl font-bold text-sky-600">BlueBird</h1>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 pb-20">
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/log" element={<LogPage />} />
                <Route path="/item" element={<ItemPage />} />
                <Route path="/forest" element={<ForestPage />} />
              </Routes>
            </main>

            <Navigation />
            <HawkTopicModal />
            <ForestConsentModal />
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
