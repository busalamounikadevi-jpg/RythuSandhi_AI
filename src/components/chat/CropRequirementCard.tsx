import React, { useState } from 'react';
import { CropRequirement } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Droplets, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  Layers, 
  Sparkles 
} from 'lucide-react';

interface CropRequirementCardProps {
  crop: CropRequirement;
  activeLanguage?: string;
  onExploreMatch?: (cropName: string) => void;
}

export const CropRequirementCard: React.FC<CropRequirementCardProps> = ({ 
  crop, 
  activeLanguage = 'en', 
  onExploreMatch 
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'quality' | 'roi'>('setup');

  // Determine language (detect from crop name if Telugu or Hindi characters are present, or use activeLanguage)
  let lang = activeLanguage;
  if (/[\u0C00-\u0C7F]/.test(crop.name)) {
    lang = 'te';
  } else if (/[\u0900-\u097F]/.test(crop.name)) {
    lang = 'hi';
  }

  const isTe = lang === 'te';
  const isHi = lang === 'hi';

  const t = {
    highDemand: isTe 
      ? `అత్యధిక డిమాండ్ • ${crop.roiAnalysis.institutionalDemandScore}/100` 
      : (isHi ? `उच्च मांग • ${crop.roiAnalysis.institutionalDemandScore}/100` : `HIGH DEMAND • ${crop.roiAnalysis.institutionalDemandScore}/100`),
    tabs: {
      setup: isTe ? 'కావలసిన ఏర్పాట్లు' : (isHi ? 'सेटअप आवश्यकताएं' : 'Setup Specs'),
      quality: isTe ? 'కొనుగోలుదారుల ప్రమాణాలు' : (isHi ? 'गुणवत्ता मानक' : 'Buyer Standards'),
      roi: isTe ? 'ధరల వివరాలు' : (isHi ? 'मूल्य व लाभ' : 'Pricing & ROI')
    },
    setup: {
      env: isTe ? 'పెరిగే వాతావరణం & కావలసిన స్థలం:' : (isHi ? 'उगाने का वातावरण व स्थान:' : 'Growing Environment & Space:'),
      equip: isTe ? 'కావలసిన పరికరాలు & సామాగ్రి:' : (isHi ? 'आवश्यक उपकरण व सामग्री:' : 'Required Equipment & Infrastructure:'),
      soil: isTe ? '🌱 నేల తయారీ విధానం:' : (isHi ? '🌱 मिट्टी व माध्यम की तैयारी:' : '🌱 Soil Preparation & Growing Media:'),
      climate: isTe ? 'వాతావరణం & నీటి పారుదల:' : (isHi ? 'जलवायु व सिंचाई प्रबंधन:' : 'Climate & Irrigation Management:'),
      hygiene: isTe ? '🛡️ కోత కోసేటప్పుడు తీసుకోవలసిన జాగ్రత్తలు:' : (isHi ? '🛡️ कटाई व स्वच्छता सावधानियां:' : '🛡️ Harvesting & Hygiene Protocols:')
    },
    quality: {
      purity: isTe ? 'కొనుగోలుదారుల నాణ్యతా ప్రమాణాలు:' : (isHi ? 'खरीदार गुणवत्ता मानक:' : 'Buyer Quality Standards:'),
      moisture: isTe ? '💧 తేమ మరియు రసాయన పరిమితులు:' : (isHi ? '💧 नमी व पैरामीटर सीमा:' : '💧 Moisture & Parameter Tolerance:'),
      certs: isTe ? 'తప్పనిసరి ల్యాబ్ సర్టిఫికెట్లు:' : (isHi ? 'अनिवार्य लैब प्रमाणपत्र:' : 'Mandatory Lab Certifications:'),
      rejection: isTe ? 'సరుకు తిరస్కరణ కారణాలు:' : (isHi ? 'अस्वीकृति के कारण (रिजेक्शन):' : 'Rejection Criteria (Zero Tolerance):')
    },
    roi: {
      cost: isTe ? 'అంచనా వ్యయం & విత్తన ఖర్చు' : (isHi ? 'अनुमानित लागत व बीज खर्च' : 'Est. Setup & Seed Cost'),
      price: isTe ? 'ఖచ్చితమైన కొనుగోలు ధర' : (isHi ? 'निश्चित खरीद मूल्य' : 'Guaranteed Buyback Price'),
      bulk: isTe ? '⚖️ ట్రక్ పికప్ కోసం కనీస పరిమాణం:' : (isHi ? '⚖️ ट्रक पिकअप के लिए न्यूनतम मात्रा:' : '⚖️ Minimum Bulk Threshold for Truck Pickup:'),
      fpo: isTe ? '🤝 చిన్న కమతాల సలహా (FPO గ్రూపింగ్):' : (isHi ? '🤝 छोटे किसानों के लिए सलाह (FPO क्लस्टर):' : '🤝 Smallholder Advice (FPO Aggregation):'),
      buyers: isTe ? '🏢 కొనుగోలు చేసే ప్రముఖ సంస్థలు:' : (isHi ? '🏢 प्रमुख संस्थागत खरीदार:' : '🏢 Verified Institutional Buyers:')
    },
    footer: {
      activeBuyers: isTe ? 'ప్రస్తుతం కొనుగోలు చేసే కంపెనీలు:' : (isHi ? 'सक्रिय खरीदार कंपनियां:' : 'Active verified buyers:'),
      viewDemands: isTe ? 'కొనుగోలు ఆర్డర్లు చూడండి →' : (isHi ? 'खरीद ऑर्डर देखें →' : 'View Buyer Demands →')
    }
  };

  return (
    <div className="mt-3 rounded-2xl border-2 border-emerald-200 bg-white shadow-sm overflow-hidden text-slate-800">
      {/* Card Header */}
      <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-emerald-900 text-sm">{crop.name}</span>
          <span className="text-[10px] text-emerald-700 italic hidden sm:inline">({crop.scientificName})</span>
        </div>
        <span className="bg-amber-400 text-amber-900 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
          {t.highDemand}
        </span>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="px-3.5 py-2 bg-emerald-100/60 border-b border-emerald-200/60 flex flex-wrap gap-2 text-[11px] text-emerald-900 font-medium">
        <span className="inline-flex items-center bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
          <Scale className="w-3 h-3 mr-1 text-emerald-700" />
          {crop.idealAcreage}
        </span>
        <span className="inline-flex items-center bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
          <TrendingUp className="w-3 h-3 mr-1 text-emerald-700" />
          {crop.gestationPeriod}
        </span>
        <span className="inline-flex items-center bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs text-amber-800">
          💰 {crop.buyerPriceEstimate}
        </span>
      </div>

      {/* Tabs Selector */}
      <div className="grid grid-cols-3 border-b border-emerald-200/80 bg-white">
        <button
          type="button"
          onClick={() => setActiveTab('setup')}
          style={{ minHeight: '44px' }}
          className={`py-2 px-1 text-xs font-semibold text-center flex items-center justify-center space-x-1 transition-colors ${
            activeTab === 'setup'
              ? 'border-b-2 border-emerald-700 text-emerald-900 bg-emerald-50/60'
              : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t.tabs.setup}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quality')}
          style={{ minHeight: '44px' }}
          className={`py-2 px-1 text-xs font-semibold text-center flex items-center justify-center space-x-1 transition-colors ${
            activeTab === 'quality'
              ? 'border-b-2 border-emerald-700 text-emerald-900 bg-emerald-50/60'
              : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.tabs.quality}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roi')}
          style={{ minHeight: '44px' }}
          className={`py-2 px-1 text-xs font-semibold text-center flex items-center justify-center space-x-1 transition-colors ${
            activeTab === 'roi'
              ? 'border-b-2 border-emerald-700 text-emerald-900 bg-emerald-50/60'
              : 'text-stone-500 hover:text-emerald-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.tabs.roi}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3.5 text-xs">
        {activeTab === 'setup' && (
          <div className="space-y-2.5">
            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                <Building2 className="w-3 h-3 mr-1 text-emerald-700" />
                {t.setup.env}
              </span>
              <p className="text-slate-600 text-xs leading-relaxed pl-4">{crop.setupSpecs.environment}</p>
            </div>

            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                <Layers className="w-3 h-3 mr-1 text-emerald-700" />
                {t.setup.equip}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-xs pl-2">
                {crop.setupSpecs.infrastructure.map((infra, idx) => (
                  <li key={idx} className="leading-relaxed">{infra}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                {t.setup.soil}
              </span>
              <p className="text-slate-600 text-xs leading-relaxed pl-4">{crop.setupSpecs.soilOrSubstrate}</p>
            </div>

            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                <Droplets className="w-3 h-3 mr-1 text-teal-600" />
                {t.setup.climate}
              </span>
              <p className="text-slate-600 text-xs leading-relaxed pl-4">{crop.setupSpecs.climateAndWater}</p>
            </div>

            <div className="bg-amber-50/80 p-2 rounded-xl border border-amber-200/80 text-amber-900">
              <span className="font-bold uppercase tracking-wider flex items-center text-[10px] text-amber-950">
                {t.setup.hygiene}
              </span>
              <p className="text-[11px] leading-relaxed mt-0.5 text-amber-900">{crop.setupSpecs.sterileProtocols}</p>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-2.5">
            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />
                {t.quality.purity}
              </span>
              <p className="text-slate-600 text-xs leading-relaxed pl-4">{crop.qualityStandards.turgidityOrPurity}</p>
            </div>

            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                {t.quality.moisture}
              </span>
              <p className="text-slate-600 text-xs leading-relaxed pl-4">{crop.qualityStandards.moistureTolerance}</p>
            </div>

            <div>
              <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center text-[10px] mb-0.5">
                <FileText className="w-3 h-3 mr-1 text-emerald-700" />
                {t.quality.certs}
              </span>
              <div className="flex flex-wrap gap-1 mt-1 pl-2">
                {crop.qualityStandards.certificationsRequired.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-white px-2 py-0.5 rounded border border-emerald-300 text-[10px] text-emerald-900 font-medium"
                  >
                    ✓ {cert}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-rose-50 p-2 rounded-xl border border-rose-200 text-rose-950">
              <span className="font-bold uppercase tracking-wider flex items-center text-[10px] text-rose-900">
                <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
                {t.quality.rejection}
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-900 mt-1 pl-1">
                {crop.qualityStandards.rejectionCriteria.map((rej, idx) => (
                  <li key={idx} className="leading-tight">{rej}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/70">
              <div>
                <span className="text-[10px] text-stone-500 font-medium block">{t.roi.cost}</span>
                <span className="font-bold text-emerald-900 text-xs">{crop.setupCostEstimate}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-medium block">{t.roi.price}</span>
                <span className="font-bold text-amber-800 text-xs">{crop.buyerPriceEstimate}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-emerald-900 flex items-center text-[11px] mb-0.5">
                {t.roi.bulk}
              </span>
              <p className="text-stone-700 leading-relaxed pl-4">{crop.roiAnalysis.minBulkThreshold}</p>
            </div>

            <div className="bg-emerald-100/70 p-2 rounded border border-emerald-300/80 text-emerald-950">
              <span className="font-semibold flex items-center text-[11px] text-emerald-900">
                {t.roi.fpo}
              </span>
              <p className="text-[11px] leading-relaxed mt-0.5 text-emerald-900">{crop.roiAnalysis.fpoRecommendation}</p>
            </div>

            <div>
              <span className="font-semibold text-emerald-900 flex items-center text-[11px] mb-1">
                {t.roi.buyers}
              </span>
              <div className="flex flex-wrap gap-1.5 pl-2">
                {crop.roiAnalysis.primaryBuyers.map((buyer, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-white px-2 py-0.5 rounded-full border border-stone-300 text-[10px] text-stone-800 font-semibold shadow-2xs"
                  >
                    {buyer}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      {onExploreMatch && (
        <div className="p-2.5 bg-stone-50 border-t border-emerald-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-600">{t.footer.activeBuyers}</span>
          <button
            type="button"
            onClick={() => onExploreMatch(crop.name)}
            style={{ minHeight: '44px' }}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1"
          >
            <span>{t.footer.viewDemands}</span>
          </button>
        </div>
      )}
    </div>
  );
};
