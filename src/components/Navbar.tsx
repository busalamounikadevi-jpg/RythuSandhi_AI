import React from 'react';
import { 
  Sprout, 
  Globe,
  RotateCcw
} from 'lucide-react';
import { FarmerProfile } from '../types';

interface NavbarProps {
  farmerProfile: FarmerProfile;
  activeLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onOpenProfile: () => void;
  onResetChat?: () => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  farmerProfile,
  activeLanguage,
  onChangeLanguage,
  onOpenProfile,
  onResetChat,
  activeTab
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 text-white border-b border-emerald-800 shadow-sm shrink-0">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Unified Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center text-amber-300 font-extrabold text-sm shadow-xs">
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center">
                <span>RythuSandhi</span>
                <span className="text-amber-400 ml-0.5">AI</span>
              </span>
              <span className="text-[9px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-700">
                AP & TS
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/80 leading-tight font-medium">
              {isTelugu ? 'ప్రీ-హార్వెస్ట్ మార్కెట్ & వ్యవసాయ సలహా' : (isHindi ? 'पूर्व-फसल बाजार एवं कृषि सलाह' : 'Pre-Harvest Market & Agronomic Advisory')}
            </p>
          </div>
        </div>

        {/* Right Tools: Reset (if in chat), Language Selector & Farmer Land Badge */}
        <div className="flex items-center space-x-2">
          {/* Reset Chat Button when active in chat */}
          {activeTab === 'chat' && onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              title={isTelugu ? 'సంభాషణ రీసెట్ చేయండి' : (isHindi ? 'बातचीत रीसेट करें' : 'Reset Conversation')}
              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Language Selector */}
          <div className="relative flex items-center bg-emerald-800 rounded-lg p-0.5 border border-emerald-700 text-xs">
            <Globe className="w-3 h-3 text-emerald-300 ml-1 mr-0.5" />
            <select
              value={activeLanguage}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="bg-transparent text-emerald-100 text-[10px] font-semibold pr-1 py-0.5 focus:outline-hidden cursor-pointer"
            >
              <option value="en" className="bg-emerald-950 text-white">EN</option>
              <option value="te" className="bg-emerald-950 text-white">తెలుగు</option>
              <option value="hi" className="bg-emerald-950 text-white">हिन्दी</option>
            </select>
          </div>

          {/* Farmer Quick Land Pill */}
          <button
            type="button"
            onClick={onOpenProfile}
            title={isTelugu ? 'రైతు ప్రొఫైల్' : 'Farmer Profile'}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span className="text-[10px]">{farmerProfile.landSize} Ac</span>
            {farmerProfile.landSize < 2.0 && (
              <span className="text-[8px] bg-amber-900 text-white px-1 rounded">FPO</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
