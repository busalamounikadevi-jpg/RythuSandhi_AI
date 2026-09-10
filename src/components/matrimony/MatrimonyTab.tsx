import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Users, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  FileText,
  BadgeCheck,
  TrendingUp,
  Scale,
  Handshake
} from 'lucide-react';
import { FarmerProfile, BuyerDemand } from '../../types';
import { LIVE_BUYER_DEMANDS } from '../../data/mockData';
import { FpoModal } from '../modals/FpoModal';

interface MatrimonyTabProps {
  farmerProfile: FarmerProfile;
  onUpdateProfile: (updated: Partial<FarmerProfile>) => void;
  onTriggerSimulationAlert: () => void;
  onSelectBuyerForOutreach: (buyer: BuyerDemand) => void;
  onNavigateToChat?: () => void;
  initialCropFilter?: string;
  activeLanguage?: string;
}

const AVAILABLE_CROPS = [
  'Aloe Vera (Barbadensis)',
  'Saffron (Kesar)',
  'Commercial Mushrooms',
  'Gourmet Microgreens'
];

// Ensure setShowBuyerReport declaration for exact template compatibility
declare const setShowBuyerReport: any;

export const MatrimonyTab: React.FC<MatrimonyTabProps> = ({
  farmerProfile,
  onUpdateProfile,
  onTriggerSimulationAlert,
  onSelectBuyerForOutreach,
  onNavigateToChat,
  initialCropFilter,
  activeLanguage = 'te'
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';
  const [isFpoModalOpen, setIsFpoModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerDemand | null>(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>(initialCropFilter || 'all');
  const [optInSuccessBanner, setOptInSuccessBanner] = useState(false);

  const isSmallholder = farmerProfile.landSize < 2.0;

  const handleLandSizeChange = (val: number) => {
    const clamped = Math.max(0.5, Math.min(10, Math.round(val * 2) / 2));
    onUpdateProfile({ landSize: clamped });
  };

  const handleToggleCrop = (crop: string) => {
    const current = farmerProfile.selectedCrops;
    if (current.includes(crop)) {
      onUpdateProfile({ selectedCrops: current.filter((c) => c !== crop) });
    } else {
      onUpdateProfile({ selectedCrops: [...current, crop] });
    }
  };

  const handleToggleOptIn = () => {
    const nextState = !farmerProfile.isOptedIn;
    onUpdateProfile({
      isOptedIn: nextState,
      optInDate: nextState ? new Date().toLocaleDateString() : undefined
    });
    if (nextState) {
      setOptInSuccessBanner(true);
      setTimeout(() => setOptInSuccessBanner(false), 4000);
    }
  };

  // Filter demands
  const filteredDemands = LIVE_BUYER_DEMANDS.filter((demand) => {
    if (selectedCropFilter === 'all') return true;
    const cropText = `${demand.cropName || ''} ${demand.crop || ''}`.toLowerCase();
    const filterLower = selectedCropFilter.toLowerCase();
    
    // Support Telugu and English aliases
    if (filterLower.includes('aloe') || filterLower.includes('కలబంద')) {
      return cropText.includes('aloe') || cropText.includes('కలబంద');
    }
    if (filterLower.includes('mushroom') || filterLower.includes('పుట్టగొడుగులు')) {
      return cropText.includes('mushroom') || cropText.includes('పుట్టగొడుగులు');
    }
    if (filterLower.includes('microgreen') || filterLower.includes('మైక్రోగ్రీన్స్')) {
      return cropText.includes('microgreen') || cropText.includes('మైక్రోగ్రీన్స్');
    }
    if (filterLower.includes('saffron') || filterLower.includes('కుంకుమపువ్వు')) {
      return cropText.includes('saffron') || cropText.includes('కుంకుమపువ్వు');
    }
    return cropText.includes(filterLower);
  });

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto pb-24 sm:pb-28">
      {/* Header */}
      <div className="bg-emerald-900 text-white p-3.5 sm:p-4 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {onNavigateToChat && (
              <button
                type="button"
                onClick={onNavigateToChat}
                className="h-10 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 border border-emerald-600 shadow-sm transition-all active:scale-95 shrink-0"
                title="Back to Advisory Chat"
              >
                <span>⬅️ Chat</span>
              </button>
            )}

            {selectedBuyer ? (
              <button
                type="button"
                onClick={() => setSelectedBuyer(null)}
                className="h-10 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 border border-emerald-600 shadow-sm transition-all active:scale-95"
                title="Back to Buyer Requests"
              >
                <span>⬅️ Back to List</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base tracking-tight leading-tight">
                    {isTelugu ? 'మార్కెట్ & డిమాండ్ (బయ్యర్ మ్యాచ్)' : (isHindi ? 'बाजार एवं मांग (क्रेता मिलान)' : 'Market & Buyer Demands')}
                  </h2>
                  <p className="text-[11px] text-emerald-200 hidden sm:block">
                    {isTelugu ? 'ప్రీ-హార్వెస్ట్ కొనుగోలు టెండర్లు & FPO పూలింగ్' : (isHindi ? 'पूर्व-फसल खरीद मांग व FPO क्लस्टर' : 'Pre-Harvest Buyer Demands & FPO Grouping')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {!selectedBuyer && (
            <button
              type="button"
              onClick={onTriggerSimulationAlert}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1 active:scale-95 transition-all shrink-0"
              title="Simulate a live buyer request alert"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Alert</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-4 max-w-3xl mx-auto w-full">
        {/* DETAILED BUYER TENDER VIEW */}
        {selectedBuyer ? (
          <div className="relative space-y-4 animate-fadeIn">
            {/* Absolute Prominent Close Button */}
            <button 
              onClick={() => { setSelectedBuyer(null); if(typeof setShowBuyerReport === 'function') setShowBuyerReport(false); }} 
              className="absolute top-4 right-4 z-50 bg-white shadow-md hover:bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-full border border-gray-200 cursor-pointer"
              style={{ minHeight: '44px' }}
            >
              ❌ Close Report
            </button>

            {/* Standardized Sticky Top Header Bar */}
            <div className="sticky top-0 bg-white z-40 flex items-center justify-between p-3 border-b border-gray-100 w-full rounded-xl shadow-xs">
              <button 
                onClick={() => { setSelectedBuyer(null); if(typeof setShowBuyerReport === 'function') setShowBuyerReport(false); }} 
                className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-sm cursor-pointer"
                style={{ minHeight: '44px' }}
              >
                ⬅️ Back to List
              </button>
              <span className="text-gray-500 text-xs font-medium pr-16 sm:pr-20">RythuSandhi AI Security Shield</span>
            </div>

            {/* Buyer Profile & Offer Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200 text-stone-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-lg text-stone-900">{selectedBuyer.buyerName}</h3>
                    {selectedBuyer.verifiedGST && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" />
                        GST Verified Partner
                      </span>
                    )}
                    {selectedBuyer.isUrgent && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {selectedBuyer.organizationType} • {selectedBuyer.locationRequirement}
                  </p>
                </div>

                <div className="sm:text-right bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-900 font-bold uppercase block">Fixed Contract Floor Rate</span>
                  <span className="text-base sm:text-lg font-extrabold text-amber-900 block mt-0.5">
                    {selectedBuyer.offeredPrice}
                  </span>
                  <span className="text-[10px] text-amber-800 block">Pre-harvest written agreement</span>
                </div>
              </div>

              {/* Requirement Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold mb-0.5">Target Crop</span>
                  <span className="font-bold text-emerald-950 text-sm">{selectedBuyer.cropName}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold mb-0.5">Batch Quantity</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedBuyer.quantityRequired}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold mb-0.5">Procurement Season</span>
                  <span className="font-semibold text-stone-800">{selectedBuyer.procurementSeason}</span>
                </div>
              </div>

              {/* Quality & Logistics Dossier */}
              <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 space-y-2 text-xs">
                <h4 className="font-bold text-emerald-950 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-700" />
                  Quality Grade & Procurement Parameters
                </h4>
                <p className="text-stone-700 leading-relaxed font-medium">
                  <strong>Quality Specification:</strong> {selectedBuyer.qualityGrade}
                </p>
                <p className="text-stone-700 leading-relaxed">
                  <strong>Logistics Protocol:</strong> {selectedBuyer.specSummary}
                </p>
              </div>

              {/* Farmer Land Fit Check */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
                <div className="flex items-start space-x-2.5">
                  <Scale className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-bold text-stone-900">
                      Your Farm Fit: {farmerProfile.landSize} Acres available
                    </h5>
                    {farmerProfile.landSize >= selectedBuyer.minAcreageRequired ? (
                      <p className="text-emerald-800 font-semibold mt-0.5">
                        ✅ Your land size meets the minimum {selectedBuyer.minAcreageRequired} Acres threshold. You can schedule farm-gate truck pickup directly.
                      </p>
                    ) : (
                      <p className="text-amber-800 font-medium mt-0.5">
                        ⚠️ This buyer requires {selectedBuyer.minAcreageRequired} Acres minimum batch volume. Smallholder farmers with under 2 acres can pool yields with local FPO clusters to fulfill this order easily!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBuyer(null)}
                  className="w-full sm:w-auto h-12 px-5 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>⬅️ Back to List</span>
                </button>

                <div className="w-full sm:w-auto flex items-center space-x-2">
                  {farmerProfile.landSize < selectedBuyer.minAcreageRequired && (
                    <button
                      type="button"
                      onClick={() => setIsFpoModalOpen(true)}
                      className="flex-1 sm:flex-initial h-12 px-4 py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-amber-300 transition-colors"
                    >
                      <Users className="w-4 h-4 text-amber-800" />
                      <span>Group with Local FPO</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectBuyerForOutreach(selectedBuyer)}
                    className="flex-1 sm:flex-initial h-12 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95"
                  >
                    <FileText className="w-4 h-4 text-emerald-200" />
                    <span>Generate Inquiry Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN LIST VIEW */
          <>
            {/* Opt-in Success Banner */}
            {optInSuccessBanner && (
              <div className="bg-emerald-800 text-white p-3 rounded-xl shadow-lg flex items-center justify-between animate-fadeIn border border-emerald-500">
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <span>
                    <strong>Alerts Activated!</strong> You will receive notifications when verified companies post purchase requests matching your land size and crops.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOptInSuccessBanner(false)}
                  className="text-emerald-200 hover:text-white text-xs font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 1. Farmer Profile & Demand Preferences Panel */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/80">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    👤
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Farmer Details & Alert Settings</h3>
                    <p className="text-[11px] text-stone-500">Set your land size (0.5 to 10 acres) to find matching buyers</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    farmerProfile.isOptedIn 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {farmerProfile.isOptedIn ? '● Alerts Active' : '○ Paused'}
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Farmer / Village Name</label>
                    <input
                      type="text"
                      value={farmerProfile.name}
                      onChange={(e) => onUpdateProfile({ name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar / Annapurna Farm"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Location / District</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={farmerProfile.district}
                        onChange={(e) => onUpdateProfile({ district: e.target.value })}
                        placeholder="e.g. Anantapur, Andhra Pradesh"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Land Size Acreage Slider (0.5 to 10 acres) */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <Scale className="w-4 h-4 text-emerald-800" />
                      <label className="font-bold text-stone-800 text-xs">
                        Your Available Land Size (Acres)
                      </label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-extrabold text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300 shadow-2xs font-mono">
                        {farmerProfile.landSize.toFixed(1)} Acres
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0.5}
                      max={10.0}
                      step={0.5}
                      value={farmerProfile.landSize}
                      onChange={(e) => handleLandSizeChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-700 h-2 bg-stone-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-stone-500 font-medium px-0.5">
                      <span>0.5 Acre (Small Plot)</span>
                      <span className="text-amber-800 font-bold">2.0 Acres (Direct Truck Threshold)</span>
                      <span>5.0 Acres</span>
                      <span>10.0 Acres (Large Land)</span>
                    </div>
                  </div>
                </div>

                {/* Crop Interests Multi-Select */}
                <div>
                  <label className="font-semibold text-stone-700 block mb-1.5">
                    Crops You Want to Grow
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_CROPS.map((crop) => {
                      const isSelected = farmerProfile.selectedCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => handleToggleCrop(crop)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
                            isSelected
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />}
                          <span>{crop}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Opt-In Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleToggleOptIn}
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 ${
                      farmerProfile.isOptedIn
                        ? 'bg-stone-800 hover:bg-stone-900 text-white'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white ring-2 ring-emerald-600/50'
                    }`}
                  >
                    {farmerProfile.isOptedIn ? (
                      <>
                        <BellRing className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>Alerts On (Click to Pause)</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Get Free Alerts When Buyers Are Ready</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SMART LAND-ACREAGE FILTERING BANNER */}
            {isSmallholder ? (
              <div className="bg-amber-50 border-2 border-amber-400/90 rounded-2xl p-4 shadow-sm animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-amber-950">
                        🌾 Smallholder Farmer Advisory (Land: {farmerProfile.landSize} Acres)
                      </h4>
                      <span className="text-[10px] bg-amber-300/80 text-amber-950 px-1.5 py-0.2 rounded font-bold uppercase">
                        Under 2.0 Acres
                      </span>
                    </div>

                    <p className="text-xs text-amber-900 mt-1 leading-relaxed font-medium">
                      Big companies require minimum 5-tonne bulk truckloads for direct pickup. We highly recommend grouping your harvest with verified local FPOs (such as <strong>Anantha Raithu Organic FPO in Anantapur</strong> or <strong>Kakatiya Mahila Consortium in Warangal</strong>) so the buyer's truck collects the pooled harvest at the village cluster with zero transport deductions!
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      <button
                        type="button"
                        onClick={() => setIsFpoModalOpen(true)}
                        className="px-3.5 py-2 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-colors"
                      >
                        <Users className="w-4 h-4 text-amber-300" />
                        <span>View Local Telugu Farmer Groups (FPOs)</span>
                      </button>

                      <span className="text-[11px] text-amber-800 italic font-medium">
                        Pool harvests with 150+ verified local farmers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-xs animate-fadeIn">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5">
                    <BadgeCheck className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950 flex items-center">
                      <span>✅ Direct Eligibility for Corporate Buybacks (Land: {farmerProfile.landSize} Acres)</span>
                    </h4>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed font-medium">
                      Your commercial land size qualifies for direct open-field Aloe Vera corporate buybacks (such as <strong>Sri Balaji Ayurvedic Labs, Chittoor</strong>). Verified company refrigerated trucks will collect harvested leaves directly at your farm gate, saving transport costs!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Live Buyer Demands Feed */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 flex items-center">
                    <Building2 className="w-4 h-4 mr-1 text-emerald-800" />
                    Live Buyer Requests Ready to Purchase ({filteredDemands.length})
                  </h3>
                  <p className="text-[11px] text-stone-500">Verified company orders ready for fair agreements before sowing</p>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedCropFilter('all')}
                    className={`px-2 py-1 rounded-lg font-semibold transition-colors ${
                      selectedCropFilter === 'all'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    All Crops
                  </button>
                  {['Aloe Vera', 'Mushrooms', 'Microgreens', 'Saffron'].map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSelectedCropFilter(crop)}
                      className={`px-2 py-1 rounded-lg font-semibold transition-colors ${
                        selectedCropFilter === crop
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white text-stone-700 border border-stone-200'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                {filteredDemands.map((demand) => {
                  const meetsAcreage = farmerProfile.landSize >= demand.minAcreageRequired;

                  return (
                    <div
                      key={demand.id}
                      className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 hover:border-emerald-400 transition-all text-stone-900"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4
                              onClick={() => setSelectedBuyer(demand)}
                              className="font-bold text-sm text-stone-900 hover:text-emerald-800 cursor-pointer underline decoration-dotted"
                            >
                              {demand.buyerName}
                            </h4>
                            {demand.verifiedGST && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-700" />
                                GST Verified
                              </span>
                            )}
                            {demand.isUrgent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-extrabold">
                                URGENT
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {demand.organizationType} • {demand.locationRequirement}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-stone-500 uppercase font-semibold block">Fixed Rate</span>
                          <span className="font-extrabold text-amber-800 text-xs sm:text-sm">
                            {demand.offeredPrice}
                          </span>
                        </div>
                      </div>

                      {/* Highlights Grid */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase font-medium">Target Crop</span>
                          <span className="font-bold text-emerald-950">{demand.cropName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase font-medium">Total Quantity</span>
                          <span className="font-bold text-stone-800">{demand.quantityRequired}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase font-medium">Quality Grade</span>
                          <span className="font-semibold text-emerald-900">{demand.qualityGrade}</span>
                        </div>
                      </div>

                      {/* Spec summary */}
                      <div className="mt-2.5 text-xs text-stone-600 leading-relaxed pl-1">
                        <span className="font-semibold text-stone-700">Procurement Spec: </span>
                        {demand.specSummary}
                      </div>

                      {/* Acreage Compatibility Check */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs">
                          {meetsAcreage ? (
                            <span className="text-emerald-800 font-semibold flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Your {farmerProfile.landSize} Acres can fill this company truck order directly!
                            </span>
                          ) : (
                            <span className="text-amber-800 font-semibold flex items-center">
                              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                              Needs {demand.minAcreageRequired} Acres (Group with village farmers to fill this truck)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBuyer(demand)}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg text-xs transition-colors"
                          >
                            Details
                          </button>

                          {!meetsAcreage && (
                            <button
                              type="button"
                              onClick={() => setIsFpoModalOpen(true)}
                              className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1"
                            >
                              <Users className="w-3.5 h-3.5 text-amber-800" />
                              <span>Group with Farmers</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectBuyerForOutreach(demand)}
                            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-xs transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Write Message</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* FPO Clustering Modal */}
      <FpoModal
        isOpen={isFpoModalOpen}
        onClose={() => setIsFpoModalOpen(false)}
        selectedDistrict={farmerProfile.district}
      />
    </div>
  );
};
