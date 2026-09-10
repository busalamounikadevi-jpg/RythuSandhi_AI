/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, FarmerProfile, BuyerDemand, ChatMessage } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ChatTab, INITIAL_MESSAGES_EN, INITIAL_MESSAGES_TE, INITIAL_MESSAGES_HI } from './components/chat/ChatTab';
import { MatrimonyTab } from './components/matrimony/MatrimonyTab';
import { SecurityTab } from './components/security/SecurityTab';
import { DirectoryTab } from './components/directory/DirectoryTab';
import { LiveNotificationToast } from './components/modals/LiveNotificationToast';
import { LIVE_BUYER_DEMANDS } from './data/mockData';
import { warmupSpeechVoices, stopSpeaking } from './utils/speech';
import { LayoutDashboard, Smartphone, Sparkles, ArrowRight } from 'lucide-react';

// Pleasant zero-dependency Web Audio chime for push notifications
function playAlertChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // ignore audio block
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [activeLanguage, setActiveLanguage] = useState('en');
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';
  const [desktopViewMode, setDesktopViewMode] = useState<'dual' | 'phone-only' | 'dashboard-only'>('dual');
  
  // Persisted chat history across all tab switches
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES_EN);
  const [buyerMatches, setBuyerMatches] = useState<any[]>([]);

  // Default smallholder farmer profile (0.5 to 1.5 acres demonstrates FPO pooling rule)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>({
    name: 'Satish Kumar',
    phone: '+91 94401 56789',
    district: 'Anantapur, Andhra Pradesh',
    state: 'Andhra Pradesh',
    landSize: 0.5,
    selectedCrops: ['Aloe Vera (Barbadensis)', 'Gourmet Microgreens'],
    isOptedIn: true,
    optInDate: new Date().toLocaleDateString()
  });

  const [liveAlert, setLiveAlert] = useState<BuyerDemand | null>(null);
  const [prefilledBuyerForOutreach, setPrefilledBuyerForOutreach] = useState<BuyerDemand | null>(null);
  const [matrimonyCropFilter, setMatrimonyCropFilter] = useState<string | undefined>(undefined);

  // Initialize and warm up SpeechSynthesis voices asynchronously on app startup
  useEffect(() => {
    document.title = 'RythuSandhi AI - Pre-Harvest Buyer Connect & Advisory';
    warmupSpeechVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        warmupSpeechVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      try {
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      } catch (e) {
        // ignore
      }
      return () => {
        try {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        } catch (e) {
          // ignore
        }
      };
    }
  }, []);

  const handleUpdateProfile = (updated: Partial<FarmerProfile>) => {
    setFarmerProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleChangeLanguage = (lang: string) => {
    setActiveLanguage(lang);
    // If messages are just the initial welcome message, switch to localized welcome
    if (messages.length === 1 && messages[0].id === 'msg-init-1') {
      if (lang === 'te') {
        setMessages(INITIAL_MESSAGES_TE);
      } else if (lang === 'hi') {
        setMessages(INITIAL_MESSAGES_HI);
      } else {
        setMessages(INITIAL_MESSAGES_EN);
      }
    }
  };

  // Simulate an event-driven push alert from an institutional buyer
  const handleTriggerSimulationAlert = () => {
    playAlertChime();
    const sampleDemand = LIVE_BUYER_DEMANDS[0] || LIVE_BUYER_DEMANDS[1];
    setLiveAlert({
      ...sampleDemand,
      id: `DEMAND-ALERT-${Date.now()}`,
      isUrgent: true
    });
  };

  const handleNavigateToMatrimony = (cropFilter?: string) => {
    setMatrimonyCropFilter(cropFilter);
    setActiveTab('matrimony');
  };

  const handleSelectBuyerForOutreach = (buyer: BuyerDemand) => {
    setPrefilledBuyerForOutreach(buyer);
    setActiveTab('security');
  };

  const handleAskChatAboutCrop = (cropName: string) => {
    setActiveTab('chat');
  };
  
  const handleSendMessage = async (text: string) => {
    // 1. Instantly append the user's message to the chat message history state
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);

    // 2. Make an asynchronous POST fetch request to the server agronomist API
    // Passing query, full conversation history, language, and farmerId
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text,
          message: text,
          history: [...messages, userMessage],
          farmerId: 'farmer_001',
          language: activeLanguage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 3. Update the chat message state with the backend's "answer"
      // and update the buyer card/carousel state with the returned "buyerMatches" array.
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer || data.reply || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        buyerMatches: data.buyerMatches || [],
        fpoMessage: data.fpoMessage,
        citations: data.citations
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.buyerMatches && Array.isArray(data.buyerMatches)) {
        setBuyerMatches(data.buyerMatches);
        if (data.buyerMatches.length > 0) {
          playAlertChime();
        }
      } else {
        setBuyerMatches([]);
      }
    } catch (error) {
      // 4. If the fetch fails (or the backend is offline), catch the error, log it,
      // and append a friendly fallback message referencing the Cloud Run endpoint.
      console.error('Error connecting to backend API:', error);

      const fallbackMessage: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: 'Unable to connect to the agricultural advisory server (https://rythusetu-api-1041209551164.us-central1.run.app/). Please ensure the API is active and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fallbackMessage]);
    }
  };
  const handleResetChat = () => {
    stopSpeaking();
    if (activeLanguage === 'te') {
      setMessages(INITIAL_MESSAGES_TE);
    } else if (activeLanguage === 'hi') {
      setMessages(INITIAL_MESSAGES_HI);
    } else {
      setMessages(INITIAL_MESSAGES_EN);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F3] text-slate-800 font-sans p-2 sm:p-4 lg:p-6 flex flex-col justify-center items-center antialiased">
      
      {/* Top Bar on Desktop for switching / previewing modes */}
      <div className="w-full max-w-7xl mb-3 hidden lg:flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-700" />
          <span className="font-extrabold text-sm tracking-tight text-emerald-950">
            RythuSandhi AI <span className="font-normal text-slate-500">• Rural Agricultural Mediation Platform</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-600">
          <span className="text-[11px] text-slate-400 mr-1 uppercase tracking-wider font-bold">Layout:</span>
          <button
            type="button"
            onClick={() => setDesktopViewMode('dual')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
              desktopViewMode === 'dual'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dual Experience</span>
          </button>
          <button
            type="button"
            onClick={() => setDesktopViewMode('phone-only')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
              desktopViewMode === 'phone-only'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device</span>
          </button>
          <button
            type="button"
            onClick={() => setDesktopViewMode('dashboard-only')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
              desktopViewMode === 'dashboard-only'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-stretch justify-center ${
        desktopViewMode === 'dual' ? 'h-auto lg:h-[820px]' : ''
      }`}>

        {/* 1. Mobile Phone Frame (Left Column in Dual View) */}
        {(desktopViewMode === 'dual' || desktopViewMode === 'phone-only') && (
          <aside className={`w-full ${
            desktopViewMode === 'dual' ? 'lg:w-[400px] lg:shrink-0' : 'max-w-md mx-auto'
          } bg-white rounded-[32px] border-[6px] border-emerald-900 shadow-2xl flex flex-col relative overflow-hidden h-[740px] sm:h-[780px] lg:h-full`}>
            
            {/* Unified In-Phone Navigation & Controls Header */}
            <Navbar
              farmerProfile={farmerProfile}
              activeLanguage={activeLanguage}
              onChangeLanguage={handleChangeLanguage}
              onOpenProfile={() => setActiveTab('matrimony')}
              onResetChat={handleResetChat}
              activeTab={activeTab}
            />

            {/* Push Notification Toast when triggered */}
            <LiveNotificationToast
              demand={liveAlert}
              onClose={() => setLiveAlert(null)}
              onViewDemand={(demand) => {
                setPrefilledBuyerForOutreach(demand);
                setActiveTab('security');
              }}
            />

            {/* Phone Screen Active Tab Display */}
            <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
              {activeTab === 'chat' && (
                <ChatTab
                  messages={messages}
                  setMessages={setMessages}
                  onSendMessage={handleSendMessage}
                  activeLanguage={activeLanguage}
                  onChangeLanguage={handleChangeLanguage}
                  onNavigateToMatrimony={handleNavigateToMatrimony}
                  onNavigateToSecurity={() => setActiveTab('security')}
                />
              )}

              {activeTab === 'matrimony' && (
                <MatrimonyTab
                  farmerProfile={farmerProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onTriggerSimulationAlert={handleTriggerSimulationAlert}
                  onSelectBuyerForOutreach={handleSelectBuyerForOutreach}
                  onNavigateToChat={() => setActiveTab('chat')}
                  initialCropFilter={matrimonyCropFilter}
                  activeLanguage={activeLanguage}
                />
              )}

              {activeTab === 'security' && (
                <SecurityTab
                  farmerProfile={farmerProfile}
                  prefilledBuyer={prefilledBuyerForOutreach}
                  onNavigateToChat={() => setActiveTab('chat')}
                  activeLanguage={activeLanguage}
                />
              )}

              {activeTab === 'directory' && (
                <DirectoryTab
                  onAskChatAboutCrop={handleAskChatAboutCrop}
                  onExploreDemandForCrop={handleNavigateToMatrimony}
                  onNavigateToChat={() => setActiveTab('chat')}
                  activeLanguage={activeLanguage}
                />
              )}
            </main>

            {/* Bottom Smartphone Navigation Bar */}
            <BottomNav
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              unreadDemandsCount={LIVE_BUYER_DEMANDS.length}
              activeLanguage={activeLanguage}
            />
          </aside>
        )}

        {/* 2. Executive Dashboard Overview (Right Column in Dual View / Dashboard Only) */}
        {(desktopViewMode === 'dual' || desktopViewMode === 'dashboard-only') && (
          <main className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
            
            {/* Top Card: Market & Demands Dashboard */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-emerald-900 flex items-center gap-2">
                  <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm shadow-2xs">
                    🤝
                  </span>
                  Market & Demands Dashboard
                </h2>

                <button
                  type="button"
                  onClick={() => setActiveTab('matrimony')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 cursor-pointer"
                >
                  <span>Open Market & Demands</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farmer Opt-In Status Box */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-emerald-800">Opt-In Status</h3>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        ACTIVE ALERTS
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between py-1 border-b border-emerald-100/60">
                        <span className="text-slate-500">Farmer:</span>
                        <span className="font-semibold text-slate-900">{farmerProfile.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-100/60">
                        <span className="text-slate-500">Land Capacity:</span>
                        <span className="font-bold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                          {farmerProfile.landSize.toFixed(1)} Acres
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Region:</span>
                        <span className="font-semibold text-slate-900">{farmerProfile.district}</span>
                      </div>
                    </div>
                  </div>

                  {farmerProfile.landSize < 2.0 ? (
                    <div className="mt-3 bg-red-100 text-red-700 p-2.5 rounded-xl text-[11px] font-bold leading-tight flex items-start gap-2 border border-red-200">
                      <span className="text-sm shrink-0">⚠️</span>
                      <span>Land size is below direct buyer bulk limits. Group with FPOs to meet 5-tonne buyer requirement!</span>
                    </div>
                  ) : (
                    <div className="mt-3 bg-emerald-100 text-emerald-800 p-2.5 rounded-xl text-[11px] font-bold leading-tight flex items-start gap-2 border border-emerald-200">
                      <span className="text-sm shrink-0">✅</span>
                      <span>Authorized for direct institutional bidding and private corporate supply.</span>
                    </div>
                  )}
                </div>

                {/* Live Buyer Demands Preview Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-800">Live Institutional Demands</h3>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      {LIVE_BUYER_DEMANDS.length} ACTIVE BIDS
                    </span>
                  </div>

                  <div className="space-y-2">
                    {LIVE_BUYER_DEMANDS.slice(0, 2).map((demand) => (
                      <div
                        key={demand.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                            <span>{demand.cropName} ({demand.organizationType})</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Demand: {demand.quantityRequired} • {demand.offeredPrice}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectBuyerForOutreach(demand)}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          View Request
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={handleTriggerSimulationAlert}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isTelugu ? 'కొత్త అలర్ట్ అనుకరణ' : (isHindi ? 'नया अलर्ट अनुकरण' : 'Simulate New Push Alert')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </main>
        )}

      </div>

    </div>
  );
}
