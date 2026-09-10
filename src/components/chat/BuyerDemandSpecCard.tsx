import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  ArrowRight,
  Send,
  FileCheck,
  Check,
  X
} from 'lucide-react';

interface BuyerDemandSpecCardProps {
  activeLanguage?: string;
  onNavigateToMatrimony?: (cropFilter?: string) => void;
  onClose?: () => void;
}

export const BuyerDemandSpecCard: React.FC<BuyerDemandSpecCardProps> = ({ 
  activeLanguage = 'te',
  onNavigateToMatrimony,
  onClose 
}) => {
  const isTe = activeLanguage === 'te';
  const isHi = activeLanguage === 'hi';

  const defaultCrop = isTe 
    ? 'కలబంద (Aloe Vera Barbadensis)' 
    : (isHi ? 'एलोवेरा (Aloe Vera Barbadensis)' : 'Aloe Vera (Barbadensis)');
  const defaultDistricts = isTe 
    ? 'విశాఖపట్నం, కాకినాడ, గోదావరి & అనంతపురం' 
    : (isHi ? 'विशाखापत्तनम, काकीनाडा, गोदावरी व अनंतपुर' : 'Visakhapatnam, Kakinada, Godavari & Anantapur');
  const defaultPrice = isTe ? '₹8.00 / కిలో' : (isHi ? '₹8.00 / किलो' : '₹8.00 / kg');

  const [cropType, setCropType] = useState(defaultCrop);
  const [monthlyTonnage, setMonthlyTonnage] = useState('10');
  const [qualityStandard, setQualityStandard] = useState(
    isTe 
      ? 'గ్రేడ్ A • రసాయన రహితం (కాస్మెటిక్ / ఫార్మా గ్రేడ్)' 
      : (isHi ? 'ग्रेड A • रसायन मुक्त (कॉस्मेटिक / फार्मा ग्रेड)' : 'Grade A • Chemical-Free (Cosmetic / Pharma Grade)')
  );
  const [targetDistrict, setTargetDistrict] = useState(defaultDistricts);
  const [offeredPrice, setOfferedPrice] = useState(defaultPrice);
  const [companyName, setCompanyName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  if (isDismissed) {
    return null;
  }

  const t = {
    title: isTe ? 'కొనుగోలుదారు సేకరింపు నమోదు పత్రం' : (isHi ? 'खरीदार अधिप्राप्ति पंजीकरण प्रपत्र' : 'Buyer Sourcing Registration Card'),
    subTitle: isTe ? 'సంస్థాగత సేకరణ వేదిక • ఆంధ్రప్రదేశ్ & తెలంగాణ' : (isHi ? 'संस्थागत खरीद मंच • आंध्र प्रदेश व तेलंगाना' : 'Institutional Procurement Platform • AP & Telangana'),
    badge: isTe ? 'సేకరణ భాగస్వామి' : (isHi ? 'खरीद भागीदार' : 'Sourcing Partner'),
    greeting: isTe 
      ? '👋 స్వాగతం! ధ్రువీకరించబడిన రైతులతో మిమ్మల్ని అనుసంధానించడానికి మేము సిద్ధంగా ఉన్నాము. మీకు కావలసిన పంట పరిమాణం (టన్నులలో), డెలివరీ ప్రాంతం మరియు నాణ్యతా ప్రమాణాలను ఇక్కడ నమోదు చేయండి.'
      : (isHi 
          ? '👋 स्वागत है! सत्यापित किसानों से आपको जोड़ने के लिए हम तैयार हैं। आवश्यक फसल मात्रा (टन में), क्षेत्र और गुणवत्ता मानक यहाँ दर्ज करें।'
          : '👋 Welcome! We connect institutional buyers directly with verified farmer clusters. Enter your required crop tonnage, target procurement districts, and quality specifications below.'),
    companyLabel: isTe ? 'సంస్థ / కంపెనీ పేరు' : (isHi ? 'संस्था / कंपनी का नाम' : 'Company / Entity Name'),
    companyPlaceholder: isTe ? 'ఉదా. Vizag Bio-Herbal Extracts Ltd / హెర్బల్స్ బయోటెక్' : (isHi ? 'उदा. Vizag Bio-Herbal Extracts Ltd' : 'e.g., Vizag Bio-Herbal Extracts Ltd'),
    cropLabel: isTe ? 'కావలసిన పంట' : (isHi ? 'वांछित फसल' : 'Required Crop'),
    tonnageLabel: isTe ? 'నెలవారీ పరిమాణం (టన్నులలో)' : (isHi ? 'मासिक मात्रा (टन में)' : 'Monthly Tonnage'),
    tonnageMin: isTe ? '(కనీసం 5 టన్నులు)' : (isHi ? '(न्यूनतम 5 टन)' : '(Min 5 Tonnes)'),
    tonnageUnit: isTe ? 'టన్నులు/నెల' : (isHi ? 'टन/माह' : 'Tonnes/Month'),
    qualityLabel: isTe ? 'నాణ్యత ప్రమాణాలు' : (isHi ? 'गुणवत्ता मानक' : 'Quality Standards'),
    districtsLabel: isTe ? 'ప్రాధాన్యత గల జిల్లాలు' : (isHi ? 'प्राथमिक जिले' : 'Target Districts'),
    districtsPlaceholder: isTe ? 'ఉదా. విశాఖపట్నం, కాకినాడ, గోదావరి, అనంతపురం...' : (isHi ? 'उदा. विशाखापत्तनम, काकीनाडा, गोदावरी...' : 'e.g. Visakhapatnam, Kakinada, Godavari, Anantapur...'),
    priceLabel: isTe ? 'ఆఫర్ చేసిన ధర (₹ / కిలో)' : (isHi ? 'प्रस्तावित मूल्य (₹ / किलो)' : 'Offered Price (₹ / kg)'),
    pipelineNote: isTe ? 'ధ్రువీకరించబడిన FPO డైరెక్ట్ సేకరణ పైప్‌లైన్' : (isHi ? 'सत्यापित FPO सीधी खरीद पाइपलाइन' : 'Verified Direct FPO Procurement Pipeline'),
    closeBtn: isTe ? '❌ మూసివేయండి' : (isHi ? '❌ बंद करें' : '❌ Close'),
    submitBtn: isTe ? 'డిమాండ్ను నమోదు చేయండి' : (isHi ? 'मांग दर्ज करें' : 'Register Buyer Demand'),
    successTitle: isTe ? 'సేకరణ అభ్యర్థన విజయవంతంగా నమోదైంది!' : (isHi ? 'खरीद अनुरोध सफलतापूर्वक दर्ज किया गया!' : 'Procurement Request Registered Successfully!'),
    successDesc: isTe 
      ? `పరిధిలో ${cropType} (${qualityStandard}) కోసం మీ నెలవారీ ${monthlyTonnage} టన్నుల డిమాండ్ రైతుసంధి సేకరణ బోర్డులో నమోదు చేయబడింది.`
      : (isHi
          ? `${targetDistrict} क्षेत्र में ${cropType} (${qualityStandard}) के लिए आपकी मासिक ${monthlyTonnage} टन मांग रायथुसंधि बोर्ड पर दर्ज हो गई है।`
          : `Your demand for ${monthlyTonnage} Tonnes/Month of ${cropType} (${qualityStandard}) in ${targetDistrict} has been registered on the RythuSandhi procurement network.`),
    viewFpoBtn: isTe ? 'రైతు సంఘాలు & FPOలను చూడండి' : (isHi ? 'किसान समूह व FPO देखें' : 'View Matching Farmer FPOs'),
    editBtn: isTe ? 'వివరాలను సవరించండి' : (isHi ? 'विवरण संशोधित करें' : 'Edit Details')
  };

  return (
    <div className="mt-3 rounded-2xl border-2 border-amber-300 bg-white shadow-sm overflow-hidden text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-4 py-3 border-b border-amber-400/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-sm shadow-xs">
            🏢
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white leading-tight">{t.title}</h4>
            <p className="text-[10px] text-amber-300 font-medium">{t.subTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
            {t.badge}
          </span>
          <button
            type="button"
            onClick={handleClose}
            style={{ minHeight: '44px', minWidth: '44px' }}
            className="flex items-center justify-center text-stone-300 hover:text-white p-2 rounded-lg hover:bg-stone-700/80 transition-colors"
            title={t.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isSubmitted ? (
        <div className="p-5 bg-emerald-50 text-emerald-950 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h5 className="font-extrabold text-base text-emerald-950">{t.successTitle}</h5>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed max-w-md mx-auto">
              <strong>{targetDistrict}</strong> • {t.successDesc}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToMatrimony?.(cropType)}
              style={{ minHeight: '44px' }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>{t.viewFpoBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              style={{ minHeight: '44px' }}
              className="w-full sm:w-auto px-3 py-2 text-stone-600 hover:text-stone-900 text-xs font-medium flex items-center justify-center"
            >
              {t.editBtn}
            </button>
            <button
              type="button"
              onClick={handleClose}
              style={{ minHeight: '44px' }}
              className="w-full sm:w-auto px-3 py-2 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center justify-center border border-rose-200"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          {/* Greeting Box */}
          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-amber-950 leading-relaxed text-xs">
            <p className="font-semibold">{t.greeting}</p>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input Field 1: Company Name */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.companyLabel}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t.companyPlaceholder}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Input Field 2: Target Crop */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.cropLabel}
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
              >
                <option value={isTe ? 'కలబంద (Aloe Vera Barbadensis)' : (isHi ? 'एलोवेरा (Aloe Vera Barbadensis)' : 'Aloe Vera (Barbadensis)')}>
                  {isTe ? 'కలబంద (Aloe Vera)' : (isHi ? 'एलोवेरा (Aloe Vera)' : 'Aloe Vera')}
                </option>
                <option value={isTe ? 'పుట్టగొడుగులు (Commercial Mushrooms)' : (isHi ? 'मशरूम (Commercial Mushrooms)' : 'Commercial Mushrooms')}>
                  {isTe ? 'పుట్టగొడుగులు (Mushrooms)' : (isHi ? 'मशरूम (Mushrooms)' : 'Commercial Mushrooms')}
                </option>
                <option value={isTe ? 'మైక్రోగ్రీన్స్ (Gourmet Microgreens)' : (isHi ? 'माइक्रोग्रीन्स (Gourmet Microgreens)' : 'Gourmet Microgreens')}>
                  {isTe ? 'మైక్రోగ్రీన్స్ (Microgreens)' : (isHi ? 'माइक्रोग्रीन्स (Microgreens)' : 'Gourmet Microgreens')}
                </option>
                <option value={isTe ? 'కుంకుమపువ్వు (Saffron Kesar)' : (isHi ? 'केसर (Saffron Kesar)' : 'Indoor Saffron (Kesar)')}>
                  {isTe ? 'కుంకుమపువ్వు (Saffron / Kesar)' : (isHi ? 'केसर (Saffron / Kesar)' : 'Indoor Saffron (Kesar)')}
                </option>
              </select>
            </div>

            {/* Input Field 3: Monthly Tonnage */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{t.tonnageLabel}</span>
                <span className="text-[10px] text-amber-700 font-bold">{t.tonnageMin}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={monthlyTonnage}
                  onChange={(e) => setMonthlyTonnage(e.target.value)}
                  placeholder={t.tonnageMin}
                  required
                  className="w-full px-3 py-2 pr-24 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-bold focus:ring-2 focus:ring-emerald-700"
                />
                <span className="absolute right-3 top-2 text-[11px] text-stone-500 font-bold pointer-events-none">
                  {t.tonnageUnit}
                </span>
              </div>
            </div>

            {/* Input Field 4: Quality Specifications */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.qualityLabel}
              </label>
              <select
                value={qualityStandard}
                onChange={(e) => setQualityStandard(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
              >
                {isTe ? (
                  <>
                    <option value="గ్రేడ్ A • రసాయన రహితం (కాస్మెటిక్ / ఫార్మా గ్రేడ్)">గ్రేడ్ A • రసాయన రహితం (కాస్మెటిక్ / ఫార్మా గ్రేడ్)</option>
                    <option value="గ్రేడ్ A • ఆకు బరువు కనీసం 800 గ్రాములు (దట్టమైన జెల్)">గ్రేడ్ A • ఆకు బరువు &gt;800 గ్రాములు (దట్టమైన జెల్)</option>
                    <option value="గ్రేడ్ A • ప్యాకింగ్‌లో తేమ రహితం (<12% తేమ)">గ్రేడ్ A • ప్యాకింగ్‌లో తేమ రహితం (&lt;12% తేమ)</option>
                    <option value="గ్రేడ్ B • సాధారణ ప్రాసెసింగ్ గ్రేడ్">గ్రేడ్ B • సాధారణ ప్రాసెసింగ్ గ్రేడ్</option>
                  </>
                ) : isHi ? (
                  <>
                    <option value="ग्रेड A • रसायन मुक्त (कॉस्मेटिक / फार्मा ग्रेड)">ग्रेड A • रसायन मुक्त (कॉस्मेटिक / फार्मा ग्रेड)</option>
                    <option value="ग्रेड A • पत्ती वजन > 800 ग्राम (सघन जेल)">ग्रेड A • पत्ती वजन &gt; 800 ग्राम (सघन जेल)</option>
                    <option value="ग्रेड A • नमी रहित पैकेजिंग (<12% नमी)">ग्रेड A • नमी रहित पैकेजिंग (&lt;12% नमी)</option>
                    <option value="ग्रेड B • सामान्य प्रसंस्करण ग्रेड">ग्रेड B • सामान्य प्रसंस्करण ग्रेड</option>
                  </>
                ) : (
                  <>
                    <option value="Grade A • Chemical-Free (Cosmetic / Pharma Grade)">Grade A • Chemical-Free (Cosmetic / Pharma Grade)</option>
                    <option value="Grade A • Leaf Weight > 800g (Dense Gel)">Grade A • Leaf Weight &gt; 800g (Dense Gel)</option>
                    <option value="Grade A • Moisture-Free Pack (<12% Moisture)">Grade A • Moisture-Free Pack (&lt;12% Moisture)</option>
                    <option value="Grade B • Standard Processing Grade">Grade B • Standard Processing Grade</option>
                  </>
                )}
              </select>
            </div>

            {/* Input Field 5: Target Districts */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.districtsLabel}
              </label>
              <input
                type="text"
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                placeholder={t.districtsPlaceholder}
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Price Offered */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.priceLabel}
              </label>
              <input
                type="text"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                placeholder={isTe ? 'ఉదా. ₹8.00 / కిలో' : (isHi ? 'उदा. ₹8.00 / किलो' : 'e.g. ₹8.00 / kg')}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-stone-200 gap-2">
            <span className="text-[10px] text-stone-500 font-medium flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700 shrink-0" />
              {t.pipelineNote}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                style={{ minHeight: '44px' }}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <span>{t.closeBtn}</span>
              </button>

              <button
                type="submit"
                style={{ minHeight: '44px' }}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-amber-300 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitBtn}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
