import React, { useState } from 'react';
import { 
  CROP_DATABASE_EN, 
  CROP_DATABASE_TE, 
  CROP_DATABASE_HI,
  EXTENSIBLE_UPCOMING_CROPS_EN,
  EXTENSIBLE_UPCOMING_CROPS_TE,
  EXTENSIBLE_UPCOMING_CROPS_HI
} from '../../data/mockData';
import { CropRequirement } from '../../types';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  Clock,
  X
} from 'lucide-react';

interface DirectoryTabProps {
  onAskChatAboutCrop: (cropName: string) => void;
  onExploreDemandForCrop: (cropName: string) => void;
  onNavigateToChat?: () => void;
  activeLanguage?: string;
}

export const DirectoryTab: React.FC<DirectoryTabProps> = ({
  onAskChatAboutCrop,
  onExploreDemandForCrop,
  onNavigateToChat,
  activeLanguage = 'te'
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';

  const [selectedCrop, setSelectedCrop] = useState<CropRequirement | null>(null);

  // Community Pipeline Voting State
  const [votedCrops, setVotedCrops] = useState<Record<string, boolean>>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({
    crop_dragon_fruit: 412,
    crop_stevia: 388,
    crop_moringa: 520,
    crop_black_rice: 275
  });

  const handleVote = (cropId: string) => {
    if (votedCrops[cropId]) return;
    setVotedCrops((prev) => ({ ...prev, [cropId]: true }));
    setVoteCounts((prev) => ({ ...prev, [cropId]: (prev[cropId] || 0) + 1 }));
  };

  // Select localized crop database
  const activeCropDb = isTelugu 
    ? CROP_DATABASE_TE 
    : (isHindi ? CROP_DATABASE_HI : CROP_DATABASE_EN);

  const cropsList = Object.values(activeCropDb);

  // Select localized upcoming pipeline crops
  const activePipeline = isTelugu
    ? EXTENSIBLE_UPCOMING_CROPS_TE
    : (isHindi ? EXTENSIBLE_UPCOMING_CROPS_HI : EXTENSIBLE_UPCOMING_CROPS_EN);

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto pb-24 sm:pb-28 text-stone-900">
      {/* Tab Header */}
      <div className="bg-emerald-900 text-white p-3.5 sm:p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
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
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              🌿
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base tracking-tight leading-tight">
                {isTelugu ? '4 ధృవీకరించబడిన అధిక-రాబడి పంటలు' : (isHindi ? '4 सत्यापित उच्च-लाभ फसलें' : '4 Verified High-Margin Crops')}
              </h2>
              <p className="text-[11px] text-emerald-200 hidden sm:block">
                {isTelugu ? 'రైతుసంధి అధికారిక సాంకేతిక బ్లూప్రింట్లు & కొనుగోలు నిబంధనలు' : (isHindi ? 'रायथुसंधि आधिकारिक तकनीकी ब्लूप्रिंट व अनुबंध शर्तें' : 'Official RythuSandhi Technical Blueprints & Pre-Harvest Buyer Standards')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4 max-w-3xl mx-auto w-full">
        {/* Verification Guarantee Banner */}
        <div className="bg-white rounded-2xl p-3.5 border border-emerald-200 shadow-2xs flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              {isTelugu ? 'ధృవీకరించబడిన సంస్థాగత బైబ్యాక్ కొనుగోలుదారులు మాత్రమే' : (isHindi ? 'केवल सत्यापित संस्थागत बायबैक खरीदार' : 'Strict Pre-Harvest Direct-Buyer Guarantee')}
            </h4>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              {isTelugu 
                ? 'రైతుసంధి కేవలం ప్రత్యక్ష కార్పొరేట్ కొనుగోలుదారులు ఉన్న ఈ 4 పంటలపై మాత్రమే దృష్టి సారిస్తుంది. ఊహాజనిత లేదా మధ్యవర్తి పంటలు సిఫార్సు చేయబడవు.'
                : (isHindi 
                  ? 'रायथुसंधि केवल इन 4 फसलों पर केंद्रित है जहां वास्तविक खरीदार पूर्व-अनुबंध के तहत उपलब्ध हैं। कोई सट्टा या अनसत्यापित फसल शामिल नहीं है।'
                  : 'RythuSandhi focuses exclusively on these 4 verified crops with direct corporate buyback arrangements. No speculative or unverified crops are entertained.')}
            </p>
          </div>
        </div>

        {/* Core Crops Grid - Strictly 4 Supported Crops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {cropsList.map((crop) => {
            const getIcon = () => {
              if (crop.id.includes('aloe')) return '🌱';
              if (crop.id.includes('saffron')) return '🌸';
              if (crop.id.includes('mushroom')) return '🍄';
              return '🥗';
            };

            return (
              <div
                key={crop.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200/80 hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shadow-2xs">
                        {getIcon()}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-stone-900 leading-tight">{crop.name}</h3>
                        <p className="text-[11px] text-stone-500 italic font-mono">{crop.scientificName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {isTelugu ? 'డిమాండ్ స్కోరు' : (isHindi ? 'मांग स्कोर' : 'Score')} {crop.roiAnalysis.institutionalDemandScore}
                    </span>
                  </div>

                  {/* Core Environment Badge */}
                  <div className="mt-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold mb-0.5">
                      {isTelugu ? 'అనువైన వాతావరణం' : (isHindi ? 'अनुकूल परिवेश' : 'Core Environment')}
                    </span>
                    <p className="text-stone-800 text-xs leading-relaxed line-clamp-2">
                      {crop.setupSpecs.environment}
                    </p>
                  </div>

                  {/* Quick specs pill row */}
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] text-stone-700">
                    <div className="bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100">
                      <span className="text-[9px] text-stone-500 block uppercase">{isTelugu ? 'కనీస విస్తీర్ణం' : (isHindi ? 'न्यूनतम माप' : 'Min Scale')}</span>
                      <span className="font-semibold text-emerald-900">{crop.idealAcreage}</span>
                    </div>
                    <div className="bg-amber-50/50 p-1.5 rounded-lg border border-amber-100">
                      <span className="text-[9px] text-stone-500 block uppercase">{isTelugu ? 'మొదటి కోత సమయం' : (isHindi ? 'पहली फसल समय' : 'Turnaround')}</span>
                      <span className="font-semibold text-amber-900">{crop.gestationPeriod}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isTelugu ? 'పూర్తి వివరాలు' : (isHindi ? 'विस्तृत ब्लूप्रिंट' : 'Deep Blueprint')}
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onAskChatAboutCrop(crop.name)}
                      title={isTelugu ? 'AI సలహాదారుని అడగండి' : (isHindi ? 'AI सलाहकार से पूछें' : 'Ask AI Agronomist')}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onExploreDemandForCrop(crop.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>{isTelugu ? 'కొనుగోలుదారులు' : (isHindi ? 'क्रेता मांगें' : 'Buyer Bids')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Scale Pipeline (Fully Localized with Voting) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3.5 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-base shrink-0 shadow-2xs">
                🔬
              </span>
              <div>
                <h3 className="font-bold text-sm text-stone-950 flex items-center gap-2">
                  <span>{isTelugu ? 'భవిష్యత్ పంటల విస్తరణ పైప్‌లైన్' : (isHindi ? 'भविष्य विस्तार पाइपलाइन' : 'Future Scale Pipeline')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-semibold">
                    {isTelugu ? 'రైతుల ఓటింగ్' : (isHindi ? 'किसान मतदान' : 'Community Voting')}
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {isTelugu 
                    ? 'కార్పొరేట్ కొనుగోలుదారుల పరిశీలనలో ఉన్న రాబోయే పంటలు. మీ ప్రాంతంలో తదుపరి ప్రారంభించాల్సిన పంటకు ఓటు వేయండి.'
                    : (isHindi 
                      ? 'संस्थागत खरीदारों के पूर्व-अनुबंध सत्यापन में आगामी फसलें। अपने क्षेत्र में प्राथमिकता के लिए वोट करें।'
                      : 'Upcoming crops undergoing pre-harvest contract vetting. Cast your vote to prioritize research and onboarding.')}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 self-start sm:self-auto shrink-0">
              {isTelugu ? '4 పంటలు పరిశీలనలో ఉన్నాయి' : (isHindi ? '4 फसलें मूल्यांकन में' : '4 Crops in Pipeline')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activePipeline.map((crop) => {
              const hasVoted = Boolean(votedCrops[crop.id]);
              const currentVotes = voteCounts[crop.id] ?? crop.votes;

              return (
                <div 
                  key={crop.id}
                  className="bg-stone-50/70 hover:bg-stone-50 border border-stone-200/90 rounded-xl p-3 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700">
                        {crop.category}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {crop.expectedRelease}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-stone-900 mb-1 leading-snug">
                      {crop.name}
                    </h4>

                    <p className="text-[10px] text-stone-600 line-clamp-2">
                      <strong className="text-stone-700 font-semibold">{isTelugu ? 'పరిశీలనలో ఉన్న కొనుగోలుదారులు:' : (isHindi ? 'संभावित संस्थागत क्रेता:' : 'Prospective Buyers:')} </strong>
                      {crop.institutionalBuyers}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <span className="text-xs">🗳️</span>
                      <span>{currentVotes}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{isTelugu ? 'ఓట్లు' : (isHindi ? 'वोट' : 'votes')}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleVote(crop.id)}
                      disabled={hasVoted}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                          : 'bg-white hover:bg-emerald-50 text-stone-800 border border-stone-300 hover:border-emerald-400 active:scale-95 shadow-2xs'
                      }`}
                    >
                      {hasVoted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{isTelugu ? 'ఓటు వేశారు' : (isHindi ? 'वोट दर्ज' : 'Voted')}</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3 h-3 text-stone-500" />
                          <span>{isTelugu ? 'ఓటు వేయండి' : (isHindi ? 'వोट दें' : 'Vote')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-2.5 text-[10px] text-amber-950 flex items-start space-x-2">
            <span className="text-sm shrink-0">⚠️</span>
            <p className="leading-relaxed">
              {isTelugu 
                ? 'గమనిక: ఈ పైప్‌లైన్ పంటలు ప్రస్తుతం ఆర్ & డి మరియు కార్పొరేట్ కొనుగోలుదారుల ముందస్తు ఒప్పంద పరిశీలనలో ఉన్నాయి. తక్షణమే గ్యారెంటీ కొనుగోలుతో సాగు చేయడానికి పైనున్న 4 ధృవీకరించబడిన బ్లూప్రింట్ పంటలను మాత్రమే ఎంచుకోండి.'
                : (isHindi 
                  ? 'नोट: ये पाइपलाइन फसलें वर्तमान में अनुसंधान एवं कॉर्पोरेट पूर्व-अनुबंध मूल्यांकन चरण में हैं। तत्काल सुरक्षित बिक्री व न्यूनतम मूल्य अनुबंध हेतु ऊपर दी गई 4 सत्यापित फसलों में से ही चुनें।'
                  : 'Notice: These pipeline crops are undergoing R&D and prospective corporate buyer evaluation. For immediate guaranteed pre-harvest commercial contracts, choose from the 4 active verified blueprints above.')}
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Crop Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-emerald-300 max-h-[92vh] flex flex-col text-stone-900">
            {/* Header with High-Contrast Back Button */}
            <div className="p-3.5 sm:p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <button 
                  onClick={() => setSelectedCrop(null)} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors cursor-pointer"
                >
                  ⬅️ {isTelugu ? 'వెనుకకు' : (isHindi ? 'वापस' : 'Back')}
                </button>
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">{selectedCrop.name}</h3>
                  <p className="text-[11px] text-emerald-200 font-mono">{selectedCrop.scientificName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCrop(null)}
                className="h-10 px-3 py-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>{isTelugu ? 'మూసివేయి' : (isHindi ? 'बंद करें' : 'Close')}</span>
                <X className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div>
                <h4 className="font-bold text-emerald-950 flex items-center text-xs mb-1">
                  <Building2 className="w-4 h-4 mr-1 text-emerald-700" />
                  {isTelugu ? 'పెరిగే వాతావరణం & కావలసిన స్థలం' : (isHindi ? 'अनुकूल परिवेश व आवश्यक स्थान' : 'Growing Environment & Space')}
                </h4>
                <p className="text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {selectedCrop.setupSpecs.environment}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-950 flex items-center text-xs mb-1">
                  <Layers className="w-4 h-4 mr-1 text-emerald-700" />
                  {isTelugu ? 'కావలసిన పరికరాలు & సామాగ్రి' : (isHindi ? 'आवश्यक उपकरण एवं सामग्री' : 'Infrastructure & Setup Requirements')}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                  {selectedCrop.setupSpecs.infrastructure.map((inf, i) => (
                    <li key={i}>{inf}</li>
                  ))}
                  <li>{selectedCrop.setupSpecs.soilOrSubstrate}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-950 flex items-center text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-700" />
                  {isTelugu ? 'కొనుగోలుదారుల నాణ్యతా ప్రమాణాలు & తిరస్కరణ నిబంధనలు' : (isHindi ? 'क्रेता गुणवत्ता मानक व अस्वीकृति शर्तें' : 'Buyer Quality Standards & Rejection Criteria')}
                </h4>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-950 space-y-1">
                  <p><strong>{isTelugu ? 'భౌతిక నాణ్యత:' : (isHindi ? 'भौतिक गुणवत्ता:' : 'Physical Quality:')}</strong> {selectedCrop.qualityStandards.turgidityOrPurity}</p>
                  <p><strong>{isTelugu ? 'తేమ పరిమితి:' : (isHindi ? 'नमी सहनशीलता:' : 'Moisture Limit:')}</strong> {selectedCrop.qualityStandards.moistureTolerance}</p>
                  <p><strong>{isTelugu ? 'తిరస్కరణ కారణాలు:' : (isHindi ? 'अस्वीकृति कारण:' : 'Rejection Reasons:')}</strong> {selectedCrop.qualityStandards.rejectionCriteria.join('; ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-medium">
                    {isTelugu ? 'అంచనా వ్యయం' : (isHindi ? 'अनुमानित लागत' : 'Estimated Setup')}
                  </span>
                  <span className="font-bold text-emerald-900 block text-xs">{selectedCrop.setupCostEstimate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-medium">
                    {isTelugu ? 'కొనుగోలు ధర' : (isHindi ? 'क्रेता खरीद मूल्य' : 'Buyer Price Range')}
                  </span>
                  <span className="font-bold text-amber-900 block text-xs">{selectedCrop.buyerPriceEstimate}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedCrop(null)}
                className="w-full sm:w-auto h-12 px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                {isTelugu ? '⬅️ డైరెక్టరీకి తిరిగి వెళ్ళు' : (isHindi ? '⬅️ वापस सूची में जाएँ' : '⬅️ Back to Directory')}
              </button>

              <div className="w-full sm:w-auto flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const name = selectedCrop.name;
                    setSelectedCrop(null);
                    onAskChatAboutCrop(name);
                  }}
                  className="flex-1 sm:flex-initial h-12 px-3.5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>{isTelugu ? '💬 AI సలహా' : (isHindi ? '💬 AI सलाह लें' : '💬 Ask Advisory')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const name = selectedCrop.name;
                    setSelectedCrop(null);
                    onExploreDemandForCrop(name);
                  }}
                  className="flex-1 sm:flex-initial h-12 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <span>{isTelugu ? 'కొనుగోలుదారులను చూడండి →' : (isHindi ? 'क्रेता मांगें देखें →' : 'View Buyer Demands →')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
