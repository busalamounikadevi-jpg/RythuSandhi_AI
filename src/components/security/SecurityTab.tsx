import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Building, 
  Info,
  Scale,
  Send,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { 
  CONTRACT_CHECKLIST_EN,
  CONTRACT_CHECKLIST_TE,
  CONTRACT_CHECKLIST_HI,
  FRAUD_REGISTRY_EN,
  FRAUD_REGISTRY_TE,
  FRAUD_REGISTRY_HI
} from '../../data/mockData';
import { ChecklistItem, FraudEntry, FarmerProfile, BuyerDemand } from '../../types';

interface SecurityTabProps {
  farmerProfile: FarmerProfile;
  prefilledBuyer?: BuyerDemand | null;
  onNavigateToChat?: () => void;
  activeLanguage?: string;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ 
  farmerProfile, 
  prefilledBuyer, 
  onNavigateToChat,
  activeLanguage = 'en'
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';

  // Localized registry and checklist selection
  const activeChecklistSource = isTelugu
    ? CONTRACT_CHECKLIST_TE
    : (isHindi ? CONTRACT_CHECKLIST_HI : CONTRACT_CHECKLIST_EN);

  const activeFraudRegistry = isTelugu
    ? FRAUD_REGISTRY_TE
    : (isHindi ? FRAUD_REGISTRY_HI : FRAUD_REGISTRY_EN);

  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>(activeChecklistSource);

  useEffect(() => {
    setChecklist(activeChecklistSource);
  }, [activeLanguage]);

  // Outreach Generator State
  const [selectedCrop, setSelectedCrop] = useState(
    prefilledBuyer ? prefilledBuyer.cropName : (farmerProfile.selectedCrops[0] || 'Aloe Vera (Barbadensis)')
  );
  const [location, setLocation] = useState(farmerProfile.district || 'Anantapur, Andhra Pradesh');
  const [landAcreage, setLandAcreage] = useState(farmerProfile.landSize || 2.0);
  const [harvestSeason, setHarvestSeason] = useState(
    isTelugu ? 'రాబోయే రబీ కాలం (అక్టోబర్ - జనవరి)' : (isHindi ? 'आगामी रबी सीजन (अक्टूबर - जनवरी)' : 'Upcoming Rabi Season (Oct - Jan)')
  );
  const [targetBuyer, setTargetBuyer] = useState(
    prefilledBuyer ? prefilledBuyer.buyerName : (isTelugu ? 'సంస్థాగత కొనుగోలు అధికారి' : (isHindi ? 'संस्थागत खरीद अधिकारी' : 'Institutional Procurement Officer'))
  );
  const [isCopied, setIsCopied] = useState(false);

  // Fraud Shield Simulator State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedEntity, setSearchedEntity] = useState<FraudEntry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedCompany, setReportedCompany] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.isCompleted).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Outreach Template text
  const generatedTemplate = isTelugu 
    ? `నమస్కారం ${targetBuyer},

నేను ${location} నుండి శ్రమిస్తున్న రైతును. రాబోయే ${harvestSeason} కోసం ${selectedCrop} సాగు చేయడానికి నా వద్ద ${landAcreage} ఎకరాల భూమి సిద్ధంగా ఉంది.

మేము అధిక నాణ్యత మరియు రసాయన రహిత సాగు పద్ధతులను పాటిస్తాము. విత్తే ముందే, మీ నాణ్యతా ప్రమాణాలు మరియు కిలో కనీస కొనుగోలు ధరతో కూడిన లిఖితపూర్వక కొనుగోలు ఒప్పందాన్ని పరిశీలించాలనుకుంటున్నాము.

మా వ్యవసాయ & క్షేత్ర వివరాలు:
• రైతు పేరు: ${farmerProfile.name || 'రైతు సోదరుడు/సోదరి'}
• గ్రామం / ప్రాంతం: ${location}
• అందుబాటులో ఉన్న భూమి: ${landAcreage} ఎకరాలు
• రవాణా పద్ధతి: రైతు క్షేత్రం వద్దే నేరుగా ట్రక్ లోడింగ్ (రైతుసంధి ధృవీకరించినది)

మీ కొనుగోలు నిబంధనలు మరియు అగ్రిమెంట్ వివరాలను తెలియజేయగలరు.`
    : (isHindi
      ? `नमस्ते ${targetBuyer},

मैं ${location} से एक किसान हूँ। मेरे पास ${landAcreage} एकड़ भूमि है जहाँ मैं आगामी ${harvestSeason} के लिए ${selectedCrop} की खेती करने को तैयार हूँ।

हम रसायन मुक्त और उच्च गुणवत्ता वाले मानक अपनाते हैं। बुवाई से पूर्व, हम आपके गुणवत्ता विनिर्देशों एवं प्रति किलो निर्धारित खरीद मूल्य के संबंध में लिखित अनुबंध की पुष्टि करना चाहते हैं।

हमारे खेत एवं भूमि का विवरण:
• किसान का नाम: ${farmerProfile.name || 'किसान भाई/बहन'}
• स्थान / गाँव: ${location}
• उपलब्ध भूमि: ${landAcreage} एकड़
• परिवहन विधि: सीधे खेत से ट्रक द्वारा उठाव (रायथुसंधि सत्यापित)

आपसे खरीद संबंधी आवश्यकताओं एवं अग्रिम पुष्टि की प्रतीक्षा है।`
      : `Namaste ${targetBuyer},

I am a hardworking farmer from ${location}. I have ${landAcreage} acres of land where I am ready to grow ${selectedCrop} for ${harvestSeason}.

We follow clean, chemical-free farming practices to ensure healthy, thick produce. Before sowing, we would like to confirm purchase alignment with you stating your quality requirements and fixed buying price per kg.

Our Farm & Land Details:
• Farmer Name: ${farmerProfile.name || 'Farmer Brother/Sister'}
• Location / Village: ${location}
• Available Land Size: ${landAcreage} Acres
• Collection Method: Direct Farm-Gate Truck Pickup (RythuSandhi Verified)

Looking forward to hearing from you regarding your purchase requirements.`);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(generatedTemplate);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Fraud search
  const handleSearchBuyer = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSearchedEntity(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const found = activeFraudRegistry.find(
      (entry) =>
        entry.companyName.toLowerCase().includes(q) ||
        (entry.gstin && entry.gstin.toLowerCase().includes(q))
    );

    if (found) {
      setSearchedEntity(found);
    } else {
      // Default to unverified warning
      setSearchedEntity({
        companyName: query,
        status: 'UNDER_REVIEW',
        warningNote: isTelugu
          ? `సంస్థ "${query}" మా ధృవీకరించబడిన సంస్థాగత కొనుగోలుదారుల జాబితాలో లేదు. అత్యంత జాగ్రత్త వహించండి: ముందస్తు నగదు ఎప్పుడూ చెల్లించవద్దు, లిఖితపూర్వక ధరలను డిమాండ్ చేయండి మరియు 15-అంకెల GSTIN స్వతంత్రంగా ధృవీకరించుకోండి.`
          : (isHindi
            ? `इकाई "${query}" हमारी पूर्व-सत्यापित संस्थागत खरीदार सूची में नहीं है। अत्यधिक सावधानी बरतें: कभी भी अग्रिम शुल्क न दें, लिखित मूल्य विनिर्देश मांगें, और उनके 15-अंकीय GSTIN की स्वतंत्र जांच करें।`
            : `Entity "${query}" is NOT on our pre-verified institutional buyer registry. Proceed with extreme caution: never pay advance fees, demand written specifications, and verify their 15-digit GSTIN independently.`)
      });
    }
  };

  const handleSubmitFraudReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedCompany.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportModalOpen(false);
      setReportedCompany('');
      setReportReason('');
    }, 2500);
  };

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
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base tracking-tight leading-tight">
                {isTelugu ? 'రక్షణ & మధ్యవర్తిత్వ కవచం' : (isHindi ? 'सुरक्षा एवं मध्यस्थता कवच' : 'Security & Mediation Shield')}
              </h2>
              <p className="text-[11px] text-emerald-200 hidden sm:block">
                {isTelugu ? 'భద్రతా రక్షణలు, మోసాల గుర్తింపు & ఔట్‌రీచ్ టెంప్లేట్' : (isHindi ? 'सुरक्षा दिशानिर्देश, धोखाधड़ी जांच एवं संपर्क ड्राफ्ट' : 'Safety Guardrails, Anti-Fraud Engine & Outreach')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4 max-w-3xl mx-auto w-full">
        {/* MANDATORY LEGAL DISCLAIMER BANNER */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-md border-2 border-amber-400">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
              ⚖️
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                  {isTelugu ? 'చట్టబద్ధమైన మధ్యవర్తిత్వ నిరాకరణ' : (isHindi ? 'वैधानिक मध्यस्थता अस्वीकरण' : 'Statutory Mediation Disclaimer')}
                </h4>
              </div>
              <p className="text-xs text-stone-200 mt-1 leading-relaxed font-semibold">
                {isTelugu 
                  ? '"రైతుసంధి AI కేవలం సమాచార మధ్యవర్తిగా మాత్రమే వ్యవహరిస్తుంది. మేము ఏ విధమైన చట్టపరమైన ఒప్పందాలు, ఆర్థిక లావాదేవీలు లేదా మూడవ పక్ష వివాదాల్లో భాగస్వామ్యం వహించము."'
                  : (isHindi 
                    ? '"रायथुसंधि AI केवल एक सूचना मध्यस्थ है। हम किसी कानूनी अनुबंध, वित्तीय एस्क्रो या तीसरे पक्ष के समझौतों में प्रत्यक्ष रूप से शामिल नहीं होते हैं।"'
                    : '"RythuSandhi AI is strictly an information mediator. We do not participate in legal contracts, financial escrow, or enforce third-party agreements."')}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                {isTelugu 
                  ? 'అన్ని పంట కొనుగోలు ఒప్పందాలు నేరుగా రైతు/FPO మరియు కొనుగోలు సంస్థ మధ్య మాత్రమే జరుగుతాయి. దిగువ పరికరాలను ఉపయోగించి కొనుగోలుదారుని స్వయంగా నిర్ధారించుకోండి.'
                  : (isHindi 
                    ? 'सभी फसल खरीद अनुबंध सीधे किसान/FPO एवं खरीदार कंपनी के बीच होते हैं। नीचे दिए गए टूल्स से स्वयं भी सत्यापन अवश्य करें।'
                    : 'All pre-harvest contracts are executed directly between the independent farmer/FPO and the purchasing corporation. Always perform independent due diligence using our tools below.')}
              </p>
            </div>
          </div>
        </div>

        {/* FEATURE 3: FRAUD SHIELD SIMULATOR (Search Bar) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {isTelugu ? 'మోసాల గుర్తింపు శోధన (ఫ్రాడ్ షీల్డ్)' : (isHindi ? 'धोखाधड़ी जांच सिमुलेटर' : 'Fraud Shield Simulator')}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isTelugu ? 'బ్లాక్‌లిస్ట్ చేయబడిన నకిలీ కంపెనీల ప్రత్యక్ష రిజిస్ట్రీ తనిఖీ' : (isHindi ? 'ब्लैकलिस्टेड फर्जी कंपनियों की लाइव रजिस्ट्री जांच' : 'Live Registry check against blacklisted scam entities')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 transition-colors"
            >
              {isTelugu ? '+ అనుమానాస్పద కొనుగోలుదారుపై ఫిర్యాదు' : (isHindi ? '+ संदिग्ध खरीदार की शिकायत' : '+ Report Suspicious Buyer')}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearchBuyer(e.target.value);
              }}
              placeholder={isTelugu ? 'కంపెనీ పేరు లేదా GSTIN శోధించండి ("Unverified Corp", "AgroGold", "ITC Agri", "Patanjali")...' : (isHindi ? 'कंपनी नाम या GSTIN खोजें ("Unverified Corp", "AgroGold", "Patanjali", "ITC Agri")...' : 'Try typing "Unverified Corp", "AgroGold Scams", "Patanjali", "ITC Agri"...')}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchedEntity(null);
                  setHasSearched(false);
                }}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700 font-bold px-1.5 py-0.5"
              >
                {isTelugu ? 'క్లియర్' : (isHindi ? 'साफ़ करें' : 'Clear')}
              </button>
            )}
          </div>

          {/* Quick Simulation Chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-stone-500 font-medium">{isTelugu ? 'త్వరిత పరీక్ష:' : (isHindi ? 'त्वरित जांच:' : 'Quick Test:')}</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('Unverified Corp');
                handleSearchBuyer('Unverified Corp');
              }}
              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-medium"
            >
              🚨 "Unverified Corp"
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('AgroGold Buyback Scams');
                handleSearchBuyer('AgroGold Buyback Scams');
              }}
              className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-medium"
            >
              🚨 "AgroGold Scams"
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('Patanjali Ayurved Ltd.');
                handleSearchBuyer('Patanjali Ayurved Ltd.');
              }}
              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-medium"
            >
              ✓ "Patanjali Ayurved"
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('ITC Agri Business');
                handleSearchBuyer('ITC Agri Business');
              }}
              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-medium"
            >
              ✓ "ITC Agri"
            </button>
          </div>

          {/* Fraud Result Cards */}
          {hasSearched && searchedEntity && (
            <div className="mt-3.5 space-y-2.5 animate-fadeIn">
              {searchedEntity.status === 'FLAGGED_FRAUD' ? (
                /* BRIGHT RED FRAUD ALERT */
                <div className="bg-rose-600 text-white rounded-xl p-4 shadow-lg border-2 border-rose-900">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center font-bold shrink-0 animate-bounce">
                      <AlertOctagon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">
                          {isTelugu ? 'బ్లాక్‌లిస్ట్ చేయబడిన మోసపూరిత సంస్థ' : (isHindi ? 'ब्लैकलिस्टेड धोखाधड़ी इकाई' : 'Blacklisted Entity')}
                        </span>
                        <span className="text-xs bg-black/30 px-2 py-0.5 rounded font-mono">
                          {searchedEntity.reportCount} {isTelugu ? 'రైతుల ఫిర్యాదులు' : (isHindi ? 'किसान शिकायतें' : 'Farmer Complaints')}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-white mt-1">
                        {searchedEntity.companyName}
                      </h4>
                      <p className="text-xs font-bold text-rose-100 mt-1.5 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-rose-400">
                        {searchedEntity.warningNote ||
                          (isTelugu ? "⚠️ మోసపూరిత హెచ్చరిక: ముందస్తు 'రిజిస్ట్రేషన్ ఫీజు' అడిగినందుకు ఈ సంస్థ బ్లాక్‌లిస్ట్‌లో పెట్టబడింది. ఎవరికీ అడ్వాన్స్ డబ్బు ఇవ్వవద్దు!" : (isHindi ? "⚠️ धोखाधड़ी चेतावनी: अग्रिम शुल्क मांगने के कारण यह खरीदार ब्लैकलिस्टेड है। कभी पहले पैसे न दें!" : "⚠️ FRAUD ALERT: This buyer is flagged on our internal Fraud List for charging upfront 'registration fees.' Never pay advance money to any buyer!"))}
                      </p>
                      {searchedEntity.reason && (
                        <p className="text-[11px] text-rose-200 mt-2">
                          <strong>{isTelugu ? 'వివరణ & ఆధారాలు:' : (isHindi ? 'दस्तावेज व विवरण:' : 'Evidence Dossier:')}</strong> {searchedEntity.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : searchedEntity.status === 'VERIFIED_BUYER' ? (
                /* GREEN VERIFIED CARD */
                <div className="bg-emerald-50 text-emerald-950 rounded-xl p-3.5 border border-emerald-300 shadow-xs">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-extrabold">
                          {isTelugu ? '✓ ధృవీకరించబడిన సంస్థాగత కొనుగోలుదారు' : (isHindi ? '✓ सत्यापित संस्थागत खरीदार' : '✓ Verified Institutional Buyer')}
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          {isTelugu ? 'విశ్వసనీయత స్కోరు:' : (isHindi ? 'विश्वास स्कोर:' : 'Trust Score:')} {searchedEntity.trustScore}/100
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-emerald-950 mt-0.5">
                        {searchedEntity.companyName}
                      </h4>
                      <div className="mt-1 text-xs text-stone-600 space-y-0.5">
                        <p><strong>{isTelugu ? 'ధృవీకరించబడిన GSTIN:' : (isHindi ? 'सत्यापित GSTIN:' : 'Verified GSTIN:')}</strong> <span className="font-mono text-emerald-900 font-bold">{searchedEntity.gstin}</span></p>
                        <p><strong>{isTelugu ? 'ప్రధాన కేంద్రం:' : (isHindi ? 'मुख्यालय:' : 'HQ Location:')}</strong> {searchedEntity.location}</p>
                        <p className="text-emerald-900 font-medium mt-1">{searchedEntity.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* UNDER REVIEW WARNING */
                <div className="bg-amber-50 text-amber-950 rounded-xl p-3.5 border border-amber-300 shadow-xs">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs leading-relaxed">
                      <h4 className="font-bold text-amber-900">
                        {isTelugu ? 'ధృవీకరించబడని సంస్థ శోధన ఫలితం' : (isHindi ? 'असत्यापित इकाई परिणाम' : 'Unverified Entity Search Result')}
                      </h4>
                      <p className="mt-1 text-amber-900">{searchedEntity.warningNote}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FEATURE 2: SECURE OUTREACH TEMPLATE GENERATOR */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                📝
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {isTelugu ? 'రక్షిత కొనుగోలుదారు ఔట్‌రీచ్ టెంప్లేట్' : (isHindi ? 'सुरक्षित क्रेता संपर्क ड्राफ्ट जनरेटर' : 'Secure Outreach Template Generator')}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isTelugu ? 'వ్యక్తిగత గోప్యతను కాపాడుతూ కొనుగోలుదారులకు పంపే అధికారిక లీగల్ డ్రాఫ్ట్' : (isHindi ? 'गोपनीयता बनाए रखते हुए खरीदारों को भेजने हेतु 1-क्लिक कानूनी पूछताछ ड्राफ्ट' : '1-Click standardized legal inquiry to buyers without compromising personal data')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyTemplate}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                isCopied
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? (isTelugu ? 'కాపీ చేయబడింది!' : (isHindi ? 'कॉपी हो गया!' : 'Copied!')) : (isTelugu ? 'టెంప్లేట్ కాపీ చేయండి' : (isHindi ? 'ड्राफ्ट कॉपी करें' : 'Copy Template'))}</span>
            </button>
          </div>

          {/* Generator Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs mb-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {isTelugu ? 'లక్ష్యిత పంట' : (isHindi ? 'लक्षित फसल' : 'Target Crop')}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Aloe Vera (Barbadensis)">Aloe Vera (Barbadensis)</option>
                <option value="Saffron (Kesar)">Saffron (Kesar)</option>
                <option value="Commercial Mushrooms">Commercial Mushrooms</option>
                <option value="Gourmet Microgreens">Gourmet Microgreens</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {isTelugu ? 'రైతు ప్రాంతం / జిల్లా' : (isHindi ? 'किसान का क्षेत्र / जिला' : 'Farmer Location')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
                placeholder="District, State"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {isTelugu ? 'భూమి పరిమాణం (ఎకరాలు)' : (isHindi ? 'भूमि का माप (एकड़)' : 'Land Size (Acres)')}
              </label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={landAcreage}
                onChange={(e) => setLandAcreage(parseFloat(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-900 text-xs focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Rendered Template Box */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-300 font-mono text-[11px] text-stone-800 leading-relaxed relative whitespace-pre-line shadow-inner">
            {generatedTemplate}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              {isTelugu ? 'కిలో కనీస కొనుగోలు ధర & లిఖితపూర్వక ఒప్పంద నిబంధనలతో కూడినది' : (isHindi ? 'लिखित न्यूनतम मूल्य व अनुबंध शर्तों सहित' : 'Includes standard legal clause demanding written APA floor pricing')}
            </span>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="text-emerald-800 hover:text-emerald-950 font-bold underline text-[11px]"
            >
              {isTelugu ? 'WhatsApp / ఇమెయిల్ కోసం కాపీ చేయండి' : (isHindi ? 'WhatsApp / ईमेल हेतु कॉपी करें' : 'Copy for WhatsApp / Email')}
            </button>
          </div>
        </div>

        {/* FEATURE 1: CONTRACT-READY CHECKLIST */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ✅
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {isTelugu ? 'ఒప్పంద భద్రతా తనిఖీ జాబితా (సేఫ్టీ చెక్‌లిస్ట్)' : (isHindi ? 'अनुबंध पूर्व सुरक्षा चेकलिस्ट' : 'Contract-Ready Safety Checklist')}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {isTelugu ? 'విత్తనాలు లేదా సామాగ్రి కొనుగోలు చేసే ముందే ఈ 4 అంశాలను తనిఖీ చేసుకోండి' : (isHindi ? 'बुवाई व निवेश से पहले इन 4 बिंदुओं की अनिवार्य जांच करें' : 'Verify every point before investing in seeds or infrastructure')}
                </p>
              </div>
            </div>

            {/* Score pill */}
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                {completedCount}/{checklist.length} {isTelugu ? 'ధృవీకరించబడ్డాయి' : (isHindi ? 'सत्यापित' : 'Verified')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-200 rounded-full h-2 mb-3.5 overflow-hidden">
            <div
              className={`h-2 transition-all duration-300 rounded-full ${
                progressPercent === 100 ? 'bg-emerald-600' : progressPercent >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 text-xs">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                  item.isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  item.isCompleted
                    ? 'bg-emerald-700 text-white'
                    : 'border-2 border-stone-300 bg-stone-50'
                }`}>
                  {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-bold text-xs ${item.isCompleted ? 'text-emerald-950 line-through opacity-80' : 'text-stone-900'}`}>
                      {item.title}
                    </h4>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      item.importance === 'CRITICAL' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.importance === 'CRITICAL' 
                        ? (isTelugu ? 'కీలకమైనది' : (isHindi ? 'अनिवार्य' : 'CRITICAL')) 
                        : (isTelugu ? 'సిఫార్సు' : (isHindi ? 'अनुशंसित' : 'RECOMMENDED'))}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Fraud Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-rose-300">
            <div className="p-3.5 sm:p-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="h-10 px-3 rounded-lg bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <span>⬅️ {isTelugu ? 'వెనుకకు' : (isHindi ? 'वापस' : 'Back')}</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-300" />
                  <h3 className="font-bold text-xs sm:text-sm">
                    {isTelugu ? 'అనుమానాస్పద కొనుగోలుదారుపై ఫిర్యాదు' : (isHindi ? 'संदिग्ध खरीदार की शिकायत दर्ज करें' : 'Report Suspicious Buyer')}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="h-9 px-2 rounded-lg text-rose-200 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-6 text-center text-xs text-emerald-900 bg-emerald-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm">
                  {isTelugu ? 'రైతుసేతు రక్షణ విభాగానికి ఫిర్యాదు అందింది' : (isHindi ? 'शिकायत सुरक्षा टीम को भेज दी गई है' : 'Report Submitted to Sentinel Grid')}
                </h4>
                <p className="mt-1 text-stone-600">
                  {isTelugu 
                    ? 'తోటి రైతు సోదరులను రక్షించినందుకు ధన్యవాదాలు. మా చట్టపరమైన బృందం 24 గంటల్లోగా ఆ సంస్థ GSTIN ను ధృవీకరిస్తుంది.'
                    : (isHindi 
                      ? 'साथी किसान भाइयों को धोखाधड़ी से बचाने के लिए धन्यवाद। हमारी टीम 24 घंटे के भीतर GSTIN की जांच करेगी।'
                      : 'Thank you for protecting fellow rural farmers. Our legal vigilance cell will cross-check the GSTIN within 24 hours.')}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReportSuccess(false);
                    setReportModalOpen(false);
                  }}
                  className="mt-4 h-11 px-5 py-2.5 bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  {isTelugu ? '⬅️ రక్షణ కవచానికి తిరిగి వెళ్ళు' : (isHindi ? '⬅️ सुरक्षा पृष्ठ पर वापस जाएँ' : '⬅️ Back to Shield')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFraudReport} className="p-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isTelugu ? 'సంస్థ / వ్యాపార పేరు *' : (isHindi ? 'कंपनी / इकाई का नाम *' : 'Company / Entity Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={reportedCompany}
                    onChange={(e) => setReportedCompany(e.target.value)}
                    placeholder={isTelugu ? 'ఉదాహరణ: నకిలీ సీడ్స్ ట్రేడింగ్ కార్ప్' : (isHindi ? 'उदा: फर्जी बीज ट्रेडिंग कंपनी' : 'e.g. Fake Seeds Trading Corp')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isTelugu ? 'ఫిర్యాదుకు గల కారణం *' : (isHindi ? 'शिकायत का कारण *' : 'Reason for Flagging *')}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder={isTelugu ? 'ఏం జరిగింది వివరించండి: ముందస్తు నగదు అడిగారా? నకిలీ GST నంబరా? అధిక ధరలకు మొక్కలు కొనమని బలవంతం చేశారా?' : (isHindi ? 'क्या हुआ विस्तार से बताएं: क्या उन्होंने अग्रिम पैसे मांगे? जाली GST? महंगे पौधे खरीदने का दबाव?' : 'Describe what happened: Did they demand advance registration money? Invalid GST? Overpriced proprietary seed coercion?')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="h-11 px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isTelugu ? '⬅️ రద్దు చేయండి' : (isHindi ? '⬅️ रद्द करें' : '⬅️ Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    {isTelugu ? 'ఫిర్యాదు సమర్పించండి' : (isHindi ? 'शिकायत दर्ज करें' : 'Submit Report')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
