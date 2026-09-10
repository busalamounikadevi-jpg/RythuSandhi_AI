import React from 'react';
import { Bell, ArrowRight, X, Sparkles, Building } from 'lucide-react';
import { BuyerDemand } from '../../types';

interface LiveNotificationToastProps {
  demand: BuyerDemand | null;
  onClose: () => void;
  onViewDemand: (demand: BuyerDemand) => void;
}

export const LiveNotificationToast: React.FC<LiveNotificationToastProps> = ({
  demand,
  onClose,
  onViewDemand
}) => {
  if (!demand) return null;

  return (
    <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 animate-bounceOnce shadow-2xl">
      <div className="bg-emerald-950 text-white rounded-2xl p-3.5 border-2 border-amber-400 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-bold animate-pulse">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  New Live Buyer Demand
                </span>
                <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                  HOT
                </span>
              </div>
              <h4 className="font-bold text-sm text-white leading-tight mt-0.5">
                {demand.buyerName}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2.5 bg-emerald-900/80 p-2 rounded-xl border border-emerald-700/60 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-medium">Target Crop:</span>
            <span className="font-bold text-white">{demand.cropName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-medium">Quantity Needed:</span>
            <span className="font-bold text-amber-300">{demand.quantityRequired}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-medium">Offered Rate:</span>
            <span className="font-bold text-emerald-100">{demand.offeredPrice}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-1">
          <span className="text-[11px] text-emerald-300 italic">One-Sided Event Push</span>
          <button
            type="button"
            onClick={() => {
              onViewDemand(demand);
              onClose();
            }}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-lg text-xs flex items-center space-x-1 shadow-md transition-colors"
          >
            <span>Review Contract Specs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
