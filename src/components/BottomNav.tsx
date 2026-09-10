import React from 'react';
import { 
  MessageSquare, 
  Handshake, 
  ShieldCheck, 
  BookOpen 
} from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unreadDemandsCount?: number;
  activeLanguage?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadDemandsCount = 5,
  activeLanguage = 'te'
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';

  const navItems = [
    {
      id: 'chat' as TabType,
      label: isTelugu ? 'సలహాదారు' : (isHindi ? 'सलाहकार' : 'Chat Advisor'),
      icon: MessageSquare,
      badge: null
    },
    {
      id: 'matrimony' as TabType,
      label: isTelugu ? 'మార్కెట్ & డిమాండ్' : (isHindi ? 'बाजार एवं मांग' : 'Market & Demands'),
      icon: Handshake,
      badge: unreadDemandsCount > 0 ? unreadDemandsCount : null
    },
    {
      id: 'directory' as TabType,
      label: isTelugu ? 'పంటల గైడ్' : (isHindi ? 'फसल ब्लूप्रिंट' : 'Crop Guide'),
      icon: BookOpen,
      badge: null
    },
    {
      id: 'security' as TabType,
      label: isTelugu ? 'రక్షణ కవచం' : (isHindi ? 'सुरक्षा कवच' : 'Security Shield'),
      icon: ShieldCheck,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-t border-slate-200 flex flex-col items-center justify-center pt-1.5 pb-2.5 shrink-0 shadow-lg">
      <div className="flex justify-around w-full px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center transition-all flex-1 py-1 cursor-pointer ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors relative ${
                isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400'
              }`}>
                <Icon className="w-5 h-5" />

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[9px] font-extrabold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[85px] text-center ${isActive ? 'font-bold text-emerald-800' : 'font-medium text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Smartphone Bottom Home Bar Indicator */}
      <div className="w-24 h-1 bg-slate-200 rounded-full mt-1.5" />
    </nav>
  );
};
