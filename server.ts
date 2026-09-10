import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const PORT = 3000;

const RYTHU_SETU_SYSTEM_INSTRUCTION = `
You are the RythuSetu AI Agronomist, a respectful, knowledgeable, and practical village agricultural advisor for Andhra Pradesh and Telangana.
- Your tone is warm, humble, and polite, but always professional and objective.
- NEVER patronize the user. NEVER assume they are "struggling," "poor," or desperate unless they explicitly say so.
- Avoid over-dramatizing. Treat them as a capable, proud business owner looking to optimize their land.

ZERO REPETITIVE GREETINGS RULE:
- DO NOT start every single response with the exact same repetitive introductory greeting (e.g., avoid repeating "రైతు సోదరులకు నమస్కారం! రైతుసేతు AI మీ సేద్యానికి..." on every turn).
- If the user asks a follow-up or specific question (e.g., about planting distance, soil requirements, water, harvesting, costs, or buyers), dive DIRECTLY into the specific, actionable answer.

ZERO-LIABILITY MEDIATOR MANDATE:
- RythuSetu AI is strictly a pre-harvest connection mediator.
- DO NOT reference "legal contracts", "signed agreements", or "Advance Purchase Agreements (APA)".
- Use clean terms: "pre-harvest connection inquiries", "direct buying requests", "quality specification checks", "farm-gate collection terms".

LANGUAGE & LOCALIZATION (ENGLISH & TELUGU):
- If the user speaks or writes in Telugu, or if the language context is Telugu, reply completely in natural, respectful, and clear Telugu script.
- Keep terminology grounded in Andhra Pradesh & Telangana geography (Anantapur, Chittoor, Guntur, Tirupati, Warangal, Medchal, Karimnagar, Nalgonda, Hyderabad).

CORE CONVERSATIONAL & CROP ADVISORY RULES:
1. STRICT 4-CROP BLUEPRINT SCOPE:
   - Answer user questions STRICTLY using the provided official agronomic blueprints for:
     * Aloe Vera (Open-field commercial crop)
     * Mushrooms (Indoor vertical crop)
     * Microgreens (Indoor vertical tray crop)
     * Saffron (Indoor climate-controlled crop)
   - If a farmer asks about ANY other crop (e.g., Papaya, Guava, Dragon Fruit, Cotton, Paddy, Mango, Pomegranate, etc.), DO NOT provide cultivation plans or suggest those unverified commercial crops.
   - Instead, politely explain that RythuSetu provides verified institutional buyer matching specifically for our 4 verified high-margin blueprints.
   - Steer the farmer immediately to one of our 4 targeted crops based on their land size (e.g. 3.5 acres -> Direct Buyer match for Aloe Vera with farm-gate collection, plus indoor Mushrooms/Microgreens for weekly cash) and AP/Telangana location.
2. Never Ignore User Context: Before answering, scan the user's message and past messages for details they have already provided (e.g., land size, location, crop choice). If they state they have "3 acres" or "3.5 acres," NEVER ask them "how much land do you have?" later in the conversation.
3. Direct Answer First: If a farmer asks a direct question (e.g., "what is the spacing for aloe vera?" or "how much water for mushrooms?"), answer their question immediately with exact figures and localized guidance.
4. No Corporate or Financial Jargon: Use simple, clean, localized terms: "sharing your land," "regular cash for household expenses," "buyer requests," and "selling directly."

CROP-SPECIFIC PRACTICAL GUIDANCE:
• Aloe Vera (కలబంద):
  - Soil: Sandy loam or well-drained red soil with pH 6.0 to 8.5. Avoid waterlogging.
  - Spacing: 2 ft x 2 ft or 3 ft x 2 ft (approx 8,000 to 10,000 saplings/suckers per acre).
  - Water: Highly drought-tolerant; drip irrigation once every 10-15 days is sufficient.
  - Harvest: First harvest in 8-10 months, yields 15-20 tonnes of fresh leaves per acre annually.
  - Market/Mediation: For 2+ acres, corporate buyers (like Sri Balaji Ayurvedic Labs, Chittoor) send trucks directly to the farm gate. For < 2 acres, combine harvest with local FPOs (e.g., Anantha Raithu Organic FPO) to fulfill 5-tonne truckload minimums.
  - Interim Cash: While waiting 8 months for first Aloe harvest, cultivate indoor Mushrooms or Microgreens in a room near the house for weekly cash.

• Commercial Mushrooms (పుట్టగొడుగులు - Oyster/Milky):
  - Setup: Grown indoors on vertical shelves or hanging ropes in a shaded room or shed (zero open-field land required).
  - Growth Substrate: Paddy straw or wheat straw, 80-90% humidity, temperature 22-28°C.
  - Cycle: Ready to harvest in 20-30 days; flushes every 7-10 days for regular weekly household cash.
  - Market: Local vegetable markets, hotel chains, and supermarket procurement in AP/Telangana.

• Gourmet Microgreens (మైక్రోగ్రీన్స్):
  - Setup: Vertical multi-tier trays with coco-peat in a verandah or room with grow lights.
  - Cycle: 7-10 days fast harvest turnaround.
  - Market: Premium cafes, salad bars, and organic stores at ₹400-₹800/kg.

• Indoor Saffron (కుంకుమపువ్వు):
  - Setup: Climate-controlled indoor room (15-18°C temperature, 70-80% humidity) on wooden trays.
  - Market: Ayurvedic & pharmaceutical procurement.

BUYER VS. FARMER ROUTING LOGIC:
- BUYER INTENT: If the user query contains buyer intent keywords (e.g., "I need a farmer", "looking to buy", "sourcing", "purchase", "bulk order", "tonnes"):
  * Address them directly as an Institutional Buyer.
  * Start with: "Welcome! We can help connect you with verified farmers and FPO clusters. Please share your required volume (in tonnes), delivery location, and timeline."
  * DO NOT give farmer cultivation soil/irrigation/pH instructions to buyers.
- FARMER INTENT: Answer agricultural and mediation inquiries directly with practical numbers, step-by-step methods, and village-level grounding.
`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Helper to determine buyer matches based on query
  function determineBuyerMatches(query: string) {
    const lower = query.toLowerCase();
    const matches: Array<{
      buyerName: string;
      crop: string;
      location: string;
      quantity: string;
      offeredPrice: string;
      qualityGrade: string;
    }> = [];

    if (lower.includes('aloe') || lower.includes('కలబంద') || lower.includes('घृतकुमारी') || (!lower.includes('mushroom') && !lower.includes('microgreen') && !lower.includes('saffron'))) {
      matches.push({
        buyerName: "Sri Balaji Ayurvedic Labs",
        crop: "Aloe Vera",
        location: "Chittoor, Andhra Pradesh",
        quantity: "15 Tonnes/Month",
        offeredPrice: "₹6.50 / kg (Farm-Gate Pickup)",
        qualityGrade: "Grade-A Turgid Gel"
      });
      matches.push({
        buyerName: "Vizag Bio-Herbal Extracts Ltd",
        crop: "Aloe Vera",
        location: "Visakhapatnam, Andhra Pradesh",
        quantity: "8 Tonnes/Month",
        offeredPrice: "₹8.00 / kg (Direct DBT Settlement)",
        qualityGrade: "Chemical-Free Leaf"
      });
    }

    if (lower.includes('mushroom') || lower.includes('పుట్టగొడుగు') || lower.includes('मशरूम')) {
      matches.push({
        buyerName: "Kakinada Agri-Horticulture Exports",
        crop: "Mushrooms",
        location: "Kakinada, Andhra Pradesh",
        quantity: "3 Tonnes/Month",
        offeredPrice: "₹180 / kg Fresh",
        qualityGrade: "Export Grade Vacuum-Packed"
      });
      matches.push({
        buyerName: "Deccan Food Processors",
        crop: "Oyster/Milky Mushrooms",
        location: "Medchal, Telangana",
        quantity: "2 Tonnes/Month",
        offeredPrice: "₹160 / kg Fresh",
        qualityGrade: "Firm Caps 90% Turgidity"
      });
    }

    if (lower.includes('microgreen') || lower.includes('మైక్రోగ్రీన్స్') || lower.includes('माइक्रोग्रीन्स')) {
      matches.push({
        buyerName: "Hyderabad Gourmet Chefs Consortium",
        crop: "Microgreens",
        location: "Hyderabad, Telangana",
        quantity: "500 kg/Month",
        offeredPrice: "₹600 / kg Clamshell",
        qualityGrade: "Chemical-Free Soil-less Cut"
      });
    }

    if (lower.includes('saffron') || lower.includes('కుంకుమపువ్వు') || lower.includes('केसर')) {
      matches.push({
        buyerName: "Telangana Bio-Botanical Extracts",
        crop: "Indoor Saffron",
        location: "Warangal, Telangana",
        quantity: "25 kg/Year",
        offeredPrice: "₹2,50,000 / kg Dried",
        qualityGrade: "ISO 3632 Grade-1"
      });
    }

    return matches;
  }

  function determineFpoMessage(query: string): string | null {
    const lower = query.toLowerCase();
    const acreMatch = lower.match(/(\d+(\.\d+)?)\s*(acre|acres|ఎకరాల|ఎకరం|एकड़)/i);
    if (acreMatch) {
      const acres = parseFloat(acreMatch[1]);
      if (acres < 2.0 && (lower.includes('aloe') || !lower.includes('mushroom'))) {
        return "FPO Aggregation Recommended: Direct corporate truck pickups require 5-tonne minimum bulk loads. Group with Anantha Raithu Organic FPO or local cluster to guarantee farm-gate collection.";
      }
    }
    return null;
  }

  function generateIntelligentFallback(query: string, isTelugu: boolean, isHindi: boolean): string {
    const q = query.toLowerCase();

    // 1. Unverified Crop Query (e.g., Papaya, Dragon Fruit, Cotton, Sugarcane, Mango, Guava)
    const unverifiedCrops = ['papaya', 'guava', 'dragon fruit', 'dragonfruit', 'cotton', 'sugarcane', 'paddy', 'mango', 'pomegranate', 'జామ', 'బొప్పాయి', 'పత్తి', 'వరి', 'మామిడి'];
    if (unverifiedCrops.some(crop => q.includes(crop))) {
      if (isTelugu) {
        return `నమస్కారం! రైతుసేతు ధృవీకరించిన 4 అధిక-లాభదాయక పంటలైన **కలబంద (Aloe Vera)**, **పుట్టగొడుగులు (Mushrooms)**, **మైక్రోగ్రీన్స్ (Microgreens)** మరియు **ఇండోర్ కుంకుమపువ్వు (Saffron)** లకు మాత్రమే సంస్థాగత కొనుగోలుదారులతో ప్రత్యక్ష లింకేజీని అందిస్తుంది. మార్కెట్ ధరల ఒడిదుడుకులు ఉండే ఇతర వాణిజ్య పంటల కంటే, ముందస్తు సంస్థాగత డిమాండ్ మరియు పొలం వద్దకే లారీ వచ్చే కలబంద లేదా ఇండోర్ పుట్టగొడుగుల సాగును ఎంచుకోవడం మీ పెట్టుబడికి సురక్షితం. మీ వద్ద ఎంత భూమి లేదా ఇండోర్ స్థలం ఉందో తెలియజేస్తే మీకు తగిన ప్రణాళికను అందిస్తాము.`;
      }
      if (isHindi) {
        return `नमस्ते! सेतु केवल 4 प्रमाणित उच्च-लाभ वाली फसलों (**एलोवेरा**, **मशरूम**, **माइक्रोग्रीन्स** और **इंडोर केसर**) के लिए संस्थागत खरीदारों से सीधा संपर्क कराता है। अन्य फसलों के बजाय इन 4 प्रमाणित मॉडलों पर ध्यान केंद्रित करने से खेत पर सीधा पिकअप और निश्चित भाव मिलता है। अपनी जमीन या इंडोर स्थान की जानकारी दें, ताकि हम आपके लिए सही योजना तैयार कर सकें।`;
      }
      return `Namaste! RythuSetu specializes strictly in verified institutional buyer connections for our 4 high-margin blueprints: **Aloe Vera (Open-field)**, **Commercial Mushrooms (Indoor)**, **Gourmet Microgreens (Indoor)**, and **Indoor Saffron**. We do not provide plans for unverified open-market crops because price volatility and middleman commissions are high. Instead, our 4 models provide verified direct farm-gate pickup and steady cash flow. Would you like to explore open-field Aloe Vera or an indoor mushroom setup?`;
    }

    // 2. Pest / Disease Management
    if (q.includes('pest') || q.includes('disease') || q.includes('పురుగు') || q.includes('తెగులు') || q.includes('कीट') || q.includes('रोग')) {
      if (q.includes('mushroom') || q.includes('పుట్టగొడుగు') || q.includes('मशरूम') || (!q.includes('aloe') && !q.includes('saffron'))) {
        if (isTelugu) {
          return `పుట్టగొడుగుల సాగులో పురుగులు మరియు తెగుళ్ల నివారణకు ఆచరణాత్మక చర్యలు:\n\n1. **గడ్డి శుద్ధి (Pasteurization):** వరి గడ్డిని 80°C వేడి నీటిలో 60-90 నిమిషాలు ఉడకబెట్టడం లేదా కార్బెండజిమ్ + ఫార్మాలిన్ ద్రావణంలో 16 గంటలు నానబెట్టడం చాలా ముఖ్యం.\n2. **ఈగల నివారణ:** షెడ్డు కిటికీలు మరియు వెంటిలేటర్లకు 40-60 మెష్ నైలాన్ నెట్లు అమర్చండి. గదిలో పసుపు రంగు జిగురు కార్డులు (Yellow Sticky Traps) వేలాడదీయండి.\n3. **పరిశుభ్రత:** పుట్టగొడుగులపై ఎట్టి పరిస్థితుల్లోనూ రసాయన పురుగుమందులు పిచికారీ చేయవద్దు. గది గోడలు, నేలపై మాత్రమే వేప నూనె (Neem Oil 5ml/లీటర్) లేదా తేలికపాటి క్రిమిసంహారకాలు వాడాలి.`;
        }
        return `Practical Pest & Disease Management for Mushrooms:\n\n1. **Substrate Sterilization:** Boil paddy/wheat straw in water at 80°C for 60–90 minutes (or use chemical pasteurization with Formalin + Carbendazim). This eliminates 95% of mold and insect eggs.\n2. **Insect Barriers:** Fit 40–60 mesh nylon netting on all doors and vents to prevent phorid and sciarid flies from entering. Hang Yellow Sticky Traps inside the room.\n3. **Chemical-Free Rule:** NEVER spray chemical pesticides directly onto mushroom bags or fruiting bodies. Spray walls and floors with 5ml/L Neem Oil (3000 ppm) for preventive hygiene.\n4. **Contamination Removal:** Immediately isolate and discard any bags showing green mold (*Trichoderma*).`;
      }
      if (isTelugu) {
        return `కలబంద (Aloe Vera) లో చీడపీడల నివారణ చాలా సులభం:\n\n1. **ఆకు మచ్చ తెగులు (Leaf Spot):** అధిక తేమ వల్ల వస్తుంది. నివారణకు కాపర్ ఆక్సిక్లోరైడ్ (COC 3 గ్రా/లీటర్) పిచికారీ చేయండి.\n2. **వేరుకుళ్లు తెగులు (Root Rot):** నేలలో నీరు నిల్వ ఉండకుండా చూసుకోండి. బోదెలు ఎత్తుగా వేయాలి.\n3. **పీల్చే పురుగులు:** వేప నూనె 5 మి.లీ/లీటర్ నీటిలో కలిపి పిచికారీ చేయండి. కలబంద అత్యంత దృఢమైన పంట కాబట్టి తీవ్రమైన తెగుళ్లు చాలా అరుదు.`;
      }
      return `Pest & Disease Management for Aloe Vera:\n\n1. **Leaf Spot (*Alternaria/Colletotrichum*):** Avoid waterlogging. If leaf spots appear during monsoon, spray Copper Oxychloride (COC) @ 3g/Litre water.\n2. **Root/Base Rot:** Ensure raised ridges with good drainage. Aloe Vera thrives in dry conditions; overwatering is the primary cause of root rot.\n3. **Mealybugs & Scale Insects:** Spray Neem Oil (3000 ppm) @ 5ml/Litre water. Chemical sprays should be avoided to preserve medicinal grade purity for buyers.`;
    }

    // 3. Spacing / Soil / Planting
    if (q.includes('spacing') || q.includes('distance') || q.includes('soil') || q.includes('plant') || q.includes('దూరం') || q.includes('నేల') || q.includes('दूरी') || q.includes('मिट्टी')) {
      if (q.includes('aloe') || q.includes('కలబంద') || q.includes('एलोवेरा') || (!q.includes('mushroom') && !q.includes('microgreen') && !q.includes('saffron'))) {
        if (isTelugu) {
          return `కలబంద (Aloe Vera) మొక్కల సాగు మరియు నేల వివరాలు:\n\n• **నేల అనుకూలత:** ఇసుకతో కూడిన గరప నేలలు, ఎర్ర నేలలు లేదా తేలికపాటి నల్లరేగడి నేలలు (pH 6.0 నుండి 8.5) అత్యుత్తమం. నీరు నిలబడే చౌడు నేలలు పనికిరావు.\n• **మొక్కల మధ్య దూరం (Spacing):** 2 అడుగులు × 2 అడుగులు లేదా 3 అడుగులు × 2 అడుగుల దూరంలో నాటాలి.\n• **ఎకరానికి మొక్కల సంఖ్య:** ఎకరానికి సుమారు 8,000 నుండి 10,000 పిల్ల మొక్కలు (suckers) అవసరం.\n• **దిగుబడి:** 8-10 నెలలకు మొదటి కోత ప్రారంభమై, ఎకరానికి ఏడాదికి 15-20 టన్నుల తాజా ఆకులు వస్తాయి.`;
        }
        return `Aloe Vera (కలబంద) Spacing, Soil & Planting Blueprint:\n\n• **Soil Requirements:** Sandy loam, red loam, or well-drained gravelly soils with pH 6.0 to 8.5. Good drainage is essential; waterlogged soils cause root rot.\n• **Recommended Spacing:** 2 ft × 2 ft (high density) or 3 ft × 2 ft (for ease of harvesting). High density yields 8,000 to 10,000 suckers per acre.\n• **Land Preparation:** Plough thoroughly and form raised ridges. Mix 10 tonnes of farmyard manure (FYM) per acre during final ploughing.\n• **First Harvest:** Begins at 8–10 months, yielding 15–20 tonnes of green leaves per acre annually.`;
      }
    }

    // 4. Water / Irrigation
    if (q.includes('water') || q.includes('irrigation') || q.includes('నీరు') || q.includes('నీటి') || q.includes('पानी') || q.includes('सिंचाई')) {
      if (isTelugu) {
        return `నీటి యాజమాన్యం:\n\n• **కలబంద (Aloe Vera):** అత్యంత కరువును తట్టుకునే పంట. బిందు సేద్యం (Drip Irrigation) ద్వారా వేసవిలో 10-15 రోజులకు ఒకసారి, శీతాకాలంలో 20-25 రోజులకు ఒకసారి తేలికపాటి తడి ఇస్తే సరిపోతుంది. అధిక నీరు నిల్వ ఉండకూడదు.\n• **పుట్టగొడుగులు (Mushrooms):** ఇండోర్ గదిలో 80-90% తేమ ఉండేలా స్ప్రింక్లర్ లేదా ఫాగర్ ద్వారా గాలిలో తేమను నిర్వహించాలి. పాలిథీన్ సంచులపై సున్నితంగా నీటిని చల్లాలి.`;
      }
      return `Water & Irrigation Management:\n\n• **Aloe Vera (Open Field):** Highly drought-tolerant CAM plant. Drip irrigation once every 10–15 days in summer and every 20–25 days in winter is sufficient. Over-irrigation reduces gel aloin content and causes collar rot.\n• **Mushrooms (Indoor):** Requires 80–90% relative humidity. Mist room walls and floor twice daily using a knapsack sprayer or automated fogger. Never blast heavy water jets at growing pinheads.`;
    }

    // 5. Acreage-based guidance
    const acreMatch = q.match(/(\d+(\.\d+)?)\s*(acre|acres|ఎకరాల|ఎకరం|एकड़)/i);
    if (acreMatch) {
      const acres = parseFloat(acreMatch[1]);
      if (acres >= 2.0) {
        if (isTelugu) {
          return `నమస్కారం! మీ వద్ద ${acres} ఎకరాల భూమి ఉండడం చాలా గొప్ప విషయం. వాణిజ్యపరంగా సంస్థాగత కొనుగోలుదారులను ఆకర్షించడానికి ఇది అనువైన విస్తీర్ణం.\n\n• **ఓపెన్-ఫీల్డ్ పంట:** **కలబంద (Aloe Vera)** మీ ${acres} ఎకరాలకు అత్యంత లాభదాయకమైన ఎంపిక. 2 ఎకరాలకు పైగా సాగు ఉన్నందున, శ్రీ బాలాజీ ఆయుర్వేదిక్ ల్యాబ్స్ వంటి కొనుగోలుదారులు నేరుగా మీ పొలం వద్దకే లారీలను పంపి ఆకులను కొనుగోలు చేస్తారు.\n• **నిరంతర నగదు (ఇండోర్ పంటలు):** కలబంద మొదటి కోతకు 8 నెలలు పడుతుంది కాబట్టి, ఇంటి వద్ద చిన్న గదిలో నిలువు అరలపై **పుట్టగొడుగులు లేదా మైక్రోగ్రీన్స్** సాగు చేసి ప్రతి వారం ఇంటి ఖర్చులకు ఆదాయం పొందవచ్చు.`;
        }
        return `Namaste! Having ${acres} acres of land is an ideal commercial size for institutional buyer contracts:\n\n• **Open-Field Direct Match:** **Aloe Vera** is the most practical, drought-hardy crop for your ${acres} acres (8,000–10,000 suckers/acre). Because your acreage exceeds 2 acres, corporate buyers will bring transport trucks straight to your farm gate, saving you all logistics costs.\n• **Steady Weekly Cash:** Since Aloe Vera takes 8–10 months for its first harvest, set up a small indoor vertical rack near your house for **Mushrooms or Gourmet Microgreens** to generate regular weekly income for household expenses without using any field acreage.`;
      } else {
        if (isTelugu) {
          return `నమస్కారం! మీ ${acres} ఎకరం పొలంలో అధిక ఆదాయం పొందడానికి ఉత్తమ వ్యూహం:\n\n• **ఇండోర్ పంటలు (తక్షణ ఆదాయం):** భూమి తక్కువగా ఉన్నప్పుడు ఇంటి వద్ద గదిలో లేదా షెడ్డులో నిలువు అరలపై **పుట్టగొడుగులు (Mushrooms)** లేదా **మైక్రోగ్రీన్స్** సాగు చేయండి. ఇవి ఎలాంటి ఓపెన్-ఫీల్డ్ భూమిని ఆక్రమించవు మరియు వారానికోసారి చేతికి డబ్బులు వస్తాయి.\n• **కలబంద సాగు (FPO క్లస్టర్):** కలబంద వేయాలనుకుంటే, స్థానిక FPO (ఉదాహరణకు అనంత రైతు FPO) తో కలిసి సాగు చేయండి. దీనివల్ల 5 టన్నుల బల్క్ లారీ లోడ్ సులభంగా సమకూరుతుంది.`;
        }
        return `Namaste! For a plot of ${acres} acres, here is the high-return commercial strategy:\n\n• **Indoor High-Margin Crops:** With smaller plots, vertical indoor farming near your house is most lucrative. **Commercial Mushrooms** (harvest every 20-30 days) and **Gourmet Microgreens** (harvest in 7-10 days) require zero open field space and generate immediate weekly household income.\n• **FPO Aggregation for Aloe Vera:** If planting Aloe Vera on your open plot, direct buyers require 5-tonne minimum bulk truckloads. We recommend aggregating your harvest through local FPOs (like Anantha Raithu Organic FPO) to guarantee direct farm-gate collection.`;
      }
    }

    // Default polite agronomic response
    if (isTelugu) {
      return `రైతు సోదరులకు నమస్కారం! మీ ప్రశ్నను మరింత స్పష్టంగా అర్థం చేసుకోవడానికి, మీరు ఓపెన్-ఫీల్డ్ కలబంద గురించి లేదా ఇండోర్ పుట్టగొడుగులు, మైక్రోగ్రీన్స్ గురించి సమాచారం కోరుకుంటున్నారో తెలియజేయగలరా? అలాగే మీ వద్ద ఉన్న భూమి లేదా ఇండోర్ స్థలం వివరాలు పంచుకుంటే సరైన ప్రణాళికను అందిస్తాము.`;
    }
    return `Namaste! As your RythuSetu AI Agronomist, I am here to help you optimize your agricultural income across our 4 verified blueprints: open-field **Aloe Vera**, and indoor vertical **Mushrooms**, **Microgreens**, and **Saffron**.\n\nPlease share your specific question (such as land acreage, soil type, irrigation, spacing, or indoor room dimensions), and I will provide exact steps and direct buyer connection details immediately.`;
  }

  const DEFAULT_CITATIONS = [
    { source: "ICAR-DMAPR National Medicinal Plants Board Cultivation Manual", topic: "Aloe Vera spacing & quality standards" },
    { source: "Directorate of Mushroom Research (DMR) Solan Guidelines", topic: "Oyster and Milky mushroom vertical substrate management" },
    { source: "RythuSetu Verified Buyer Registry 2026 (AP & TS Clusters)", topic: "Institutional procurement rates & direct collection terms" }
  ];

  // AI Agronomist Chat API
  app.post('/api/chat', async (req, res) => {
    try {
      const userMessage = req.body.query || req.body.message;
      if (!userMessage || typeof userMessage !== 'string') {
        res.status(400).json({ error: 'Message or query is required' });
        return;
      }

      // 1. Connect to active Cloud Run API backend (if active and responsive)
      const cloudRunUrl = process.env.EXTERNAL_BACKEND_URL || 'https://rythusetu-api-1041209551164.us-central1.run.app/';
      if (cloudRunUrl) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 800); // Fast 800ms timeout so user is not blocked if remote service is unavailable
          const externalRes = await fetch(cloudRunUrl, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              query: userMessage,
              message: userMessage,
              farmerId: req.body.farmerId || 'farmer_001',
              language: req.body.language || 'en'
            }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          const contentType = externalRes.headers.get('content-type') || '';
          if (externalRes.ok && contentType.includes('application/json')) {
            const externalData = await externalRes.json();
            const answer = externalData.answer || externalData.reply || externalData.response || externalData.text || externalData.message;
            if (answer) {
              res.json({
                ...externalData,
                answer,
                reply: answer,
                buyerMatches: externalData.buyerMatches || externalData.buyer_matches || externalData.matches || [],
                fpoMessage: externalData.fpoMessage !== undefined ? externalData.fpoMessage : (externalData.fpo_message !== undefined ? externalData.fpo_message : null),
                citations: externalData.citations || externalData.sources || []
              });
              return;
            }
          }
        } catch (_e) {
          // Try next endpoint or fall back to native agronomist engine
        }
      }

      const { history, language } = req.body;
      const isTeluguLang = language === 'te' || /[\u0C00-\u0C7F]/.test(userMessage);
      const isHindiLang = language === 'hi' || /[\u0900-\u097F]/.test(userMessage);

      // Only attach corporate buyers if explicitly requested by user or if buyer/selling/pricing intent is detected
      const hasBuyerIntent = Boolean(req.body.includeBuyers) || 
        /\b(buyer|buyers|who buys|who will buy|purchas|sell|selling|where to sell|market|rate|rates|price|prices|contract|offtake|company|companies|corporate)\b/i.test(userMessage) ||
        /(కొనుగోలు|కొనుగోలుదారు|అమ్మకం|ఎక్కడ అమ్మాలి|ఎవరు కొంటారు|ధర|రేటు|ఖరీద్|మార్కెట్|కంపెనీ)/i.test(userMessage) ||
        /(खरीदार|बिक्री|कहाँ बेचें|कीमत|भाव|दर|कंपनी)/i.test(userMessage);

      // Only attach citations if explicitly requested by user
      const hasCitationIntent = Boolean(req.body.includeCitations) ||
        /\b(source|sources|citation|citations|reference|references|proof|manual|guideline|icar|dmr)\b/i.test(userMessage) ||
        /(ఆధార|వనరు|ప్రమాణ|రిఫరెన్స్)/i.test(userMessage) ||
        /(स्रोत|संदर्भ|प्रमाण)/i.test(userMessage);

      const buyerMatches = hasBuyerIntent ? determineBuyerMatches(userMessage) : [];
      const fpoMessage = hasBuyerIntent ? determineFpoMessage(userMessage) : null;
      const citations = hasCitationIntent ? DEFAULT_CITATIONS : [];

      const apiKey = process.env.GEMINI_API_KEY;
      let replyText = '';

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const effectiveInstruction = RYTHU_SETU_SYSTEM_INSTRUCTION + (isTeluguLang 
            ? `\n\nACTIVE LANGUAGE IS TELUGU: The user is communicating in Telugu. You MUST respond completely in natural, respectful, and warm Telugu script.` 
            : (isHindiLang
              ? `\n\nACTIVE LANGUAGE IS HINDI: The user is communicating in Hindi. You MUST respond in clear, respectful, natural Hindi script.`
              : `\n\nACTIVE LANGUAGE IS ENGLISH: Respond in English with respectful Indian agricultural advisory tone.`));

          const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
          if (Array.isArray(history) && history.length > 0) {
            for (const item of history) {
              if (item.sender === 'user' && item.text) {
                contents.push({ role: 'user', parts: [{ text: item.text }] });
              } else if ((item.sender === 'agent' || item.sender === 'bot') && item.text) {
                contents.push({ role: 'model', parts: [{ text: item.text }] });
              }
            }
          }
          contents.push({ role: 'user', parts: [{ text: userMessage }] });

          const candidateModels = [
            'gemini-3.6-flash',
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.1-pro-preview'
          ];

          for (const modelName of candidateModels) {
            try {
              const response = await ai.models.generateContent({
                model: modelName,
                contents,
                config: {
                  systemInstruction: effectiveInstruction,
                  temperature: 0.6,
                }
              });
              if (response.text && response.text.trim()) {
                replyText = response.text.trim();
                break;
              }
            } catch (err: any) {
              console.warn(`Model ${modelName} call failed:`, err?.message || err);
            }
          }
        } catch (_geminiErr) {
          // fallback to expert agricultural rules below
        }
      }

      // If Gemini wasn't available or couldn't generate, supply high quality intelligent query-specific agronomist response
      if (!replyText) {
        replyText = generateIntelligentFallback(userMessage, isTeluguLang, isHindiLang);
      }

      res.json({
        answer: replyText,
        reply: replyText,
        buyerMatches,
        fpoMessage,
        citations
      });
    } catch (err: any) {
      console.error('Handled AI agronomist request error:', err?.message || err);
      res.json({
        answer: "Namaste! For open-field cultivation, Aloe Vera is recommended for plots of 2+ acres with direct farm-gate collection. For fast weekly household cash, indoor mushrooms or microgreens on vertical racks near the house are ideal.",
        reply: "Namaste! For open-field cultivation, Aloe Vera is recommended for plots of 2+ acres with direct farm-gate collection.",
        buyerMatches: determineBuyerMatches("aloe"),
        fpoMessage: null,
        citations: DEFAULT_CITATIONS
      });
    }
  });

  // Vite middleware for development, static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 RythuSetu AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
