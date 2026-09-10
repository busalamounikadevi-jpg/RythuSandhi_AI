import { CropRequirement, BuyerDemand, FraudEntry, ChecklistItem, FpoCluster } from '../types';

export const CROP_DATABASE_EN: Record<string, CropRequirement> = {
  'aloe vera': {
    id: 'aloe-vera',
    name: 'Aloe Vera (Barbadensis) Cultivation Blueprint',
    scientificName: 'Aloe barbadensis Miller',
    category: 'Medicinal & Cosmetic Commercial Open-Field Crop',
    idealAcreage: '1.0 to 5.0 Acres (Open-Field Cultivation)',
    gestationPeriod: '12-18 Months (Continuous 5-Year Harvest Cycle)',
    setupCostEstimate: '₹60,000 - ₹90,000 / Acre (Suckers + Drip System + Bed Preparation)',
    buyerPriceEstimate: '₹4.50 - ₹7.00 / kg Fresh Leaves (Direct Buyback)',
    setupSpecs: {
      environment: 'Open sunshine in well-drained sandy loam or red loamy soil. Requires at least 6-8 hours of direct sunlight daily.',
      infrastructure: [
        'Drip irrigation sub-mains with pressure-compensating drippers',
        'Protective perimeter fence to safeguard from stray cattle',
        'Shaded cleaning and sorting shed for post-harvest handling'
      ],
      soilOrSubstrate: 'Deeply tilled soil with well-rotted farmyard manure (FYM). Clean, chemical-free soil with pH 7.0 - 8.5.',
      climateAndWater: 'Warm, dry tropical/sub-tropical climate. Light watering once every 10-14 days; avoid waterlogging at all costs.',
      sterileProtocols: 'Harvesting Protocols: Cut outer mature leaves before 9 AM using 70% IPA-sterilized stainless steel blades to prevent rot.'
    },
    qualityStandards: {
      turgidityOrPurity: 'Minimum 90% leaf turgidity; base thickness > 2.5 cm with clear, unbroken gel.',
      moistureTolerance: '98.5% pure gel moisture content; Total Soluble Solids (TSS) > 0.8 Brix.',
      visualDefects: 'Zero spots, sun-scorch, or tip damage; firm, healthy dark-green leaves.',
      certificationsRequired: [
        'NABL Certified Zero Chemical Residue Report',
        'Heavy Metal Free Analysis Certificate (< 5ppm)',
        'Farm Traceability & Geo-Tagged Origin Ledger'
      ],
      rejectionCriteria: [
        'Wilting or limp leaves below 80% turgidity',
        'Bacterial soft rot or blackened tips',
        'Gel discoloration from harvesting in high midday heat'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'Minimum 5.0 Tonnes (Full Truckload Pickup)',
      fpoRecommendation: 'Smallholders with under 2 acres should aggregate through local FPOs (Anantapur & Chittoor clusters) to fill 10-wheeler trucks.',
      institutionalDemandScore: 92,
      primaryBuyers: [
        'Sri Balaji Ayurvedic Labs (Chittoor)',
        'Patanjali Ayurved (Tirupati Hub)',
        'Deccan Bio-Pharma (Hyderabad)',
        'Vizag Bio-Herbal Extracts Ltd'
      ]
    }
  },
  'saffron': {
    id: 'saffron',
    name: 'Indoor Aeroponic Saffron (Kesar) Blueprint',
    scientificName: 'Crocus sativus L.',
    category: 'Climate-Controlled Indoor Gourmet Spice',
    idealAcreage: '300 - 1,200 sq. ft. Indoor Insulated Climate Room',
    gestationPeriod: '90-110 Days (October-November Flowering Window)',
    setupCostEstimate: '₹3,50,000 - ₹5,00,000 / 500 sq. ft. (Racks + HVAC + Corms)',
    buyerPriceEstimate: '₹2,20,000 - ₹3,10,000 / kg Dried Grade-1 Stigmas',
    setupSpecs: {
      environment: 'Fully insulated, temperature and darkness-controlled indoor room.',
      infrastructure: [
        '4 to 5-tier wooden or anti-static powder-coated vertical racks',
        'Precision HVAC unit maintaining 15°C - 18°C day and 10°C - 12°C night',
        'Ultrasonic humidifiers maintaining 75-85% RH and HEPA air filtration'
      ],
      soilOrSubstrate: 'Soilless aeroponic setup; corms placed on slotted food-grade crates.',
      climateAndWater: 'Micro-mist environment; zero direct water spraying during the bloom period.',
      sterileProtocols: 'Air-locked sterile entry; harvest flower stigmas within 3 hours of blooming using sanitized tweezers and surgical gloves.'
    },
    qualityStandards: {
      turgidityOrPurity: 'ISO 3632 Grade-1 standard: Crocin (color strength) > 220, Safranal (aroma) > 40, Picrocrocin > 80.',
      moistureTolerance: 'Moisture in dried stigmas must be strictly between 8.0% and 10.0%.',
      visualDefects: 'Pure deep-red tri-forked stigmas; yellow style portion must be < 5% by weight.',
      certificationsRequired: [
        'ISO 3632 Spectrophotometric Grade-1 Certificate',
        'Moisture & Aroma Purity Analysis Report',
        'Natural Dehydration Log Sheet'
      ],
      rejectionCriteria: [
        'Over 8% yellow/white non-active style tissue',
        'Moisture exceeding 12% causing mold or aroma loss',
        'Crocin color value below 190'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'Minimum 500 grams Dried Grade-1 Batch',
      fpoRecommendation: 'Growers utilizing small 200 sq. ft. indoor rooms can aggregate through Telangana & AP Spice Consortia for high profit margins.',
      institutionalDemandScore: 97,
      primaryBuyers: [
        'Telangana Bio-Botanical Extracts (Warangal)',
        'Hyderabad Aroma Labs',
        'Rayalaseema Specialty Spices'
      ]
    }
  },
  'mushrooms': {
    id: 'mushrooms',
    name: 'Commercial Mushroom Cultivation Blueprint',
    scientificName: 'Pleurotus ostreatus / Calocybe indica / Agaricus bisporus',
    category: 'Controlled Indoor High-Protein Crop',
    idealAcreage: '400 - 2,000 sq. ft. Dark Room / Shed (Vertical Shelving)',
    gestationPeriod: '21 - 35 Days (Recurring Weekly Cash Inflow)',
    setupCostEstimate: '₹80,000 - ₹1,80,000 (Insulated Shed, Foggers, Exhaust Fans, PP Bags)',
    buyerPriceEstimate: '₹140 - ₹240 / kg Fresh Mushrooms | ₹800 / kg Dehydrated',
    setupSpecs: {
      environment: 'Humidity-controlled indoor dark room or polyhouse with 24/7 cross-ventilation system.',
      infrastructure: [
        'Nylon rope hanging or 5-tier vertical bamboo/GI shelving racks',
        'Automated cyclic fogger system with integrated RH sensor',
        'Exhaust fans for CO2 evacuation (maintaining CO2 < 1,000 ppm)'
      ],
      soilOrSubstrate: 'Steam-pasteurized paddy straw or wheat straw substrate with 2% calcium carbonate; ~65% moisture.',
      climateAndWater: 'Temp 22°C - 28°C (Oyster/Milky) or 16°C - 20°C (Button); 85% - 90% humidity; micro-mist spray 2-3 times daily.',
      sterileProtocols: 'Substrate pasteurization at 80°C for 2 hours; laminar airflow spawning bench; pre-sanitized grow room with formalin.'
    },
    qualityStandards: {
      turgidityOrPurity: 'Firm, fresh white/cream caps; zero spore drop at harvest stage.',
      moistureTolerance: 'Fresh weight 90-92% moisture; dehydrated batch < 7% moisture with nitrogen flush.',
      visualDefects: 'Zero brown blotch, green mold (Trichoderma), or insect punctures.',
      certificationsRequired: [
        'FSSAI Food Hygiene & Safety Certificate',
        'Certified Chemical-Free Mushroom Spawn Authenticity Certificate',
        'Cold-Chain Temperature Log (2-4°C dispatch)'
      ],
      rejectionCriteria: [
        'Open, frayed, or broken mushroom caps',
        'Yellow discoloration from excess heat or CO2 buildup',
        'Slimy or tacky surface texture'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: '100 kg / day Fresh or 200 kg / week Dehydrated Lot',
      fpoRecommendation: 'Combine shipments via FPO refrigerated reefer vans to supply Hyderabad and Vijayawada institutional supermarkets.',
      institutionalDemandScore: 89,
      primaryBuyers: [
        'Deccan Food Processors (Medchal)',
        'ITC Agri Business Division (Guntur Hub)',
        'Kakinada Agri-Horticulture Exports',
        'Heritage Foods Hyderabad Hub'
      ]
    }
  },
  'microgreens': {
    id: 'microgreens',
    name: 'Gourmet Microgreens Cultivation Blueprint',
    scientificName: 'Brassica oleracea / Raphanus sativus / Helianthus annuus',
    category: 'High-Density Indoor Vertical Precision Crop',
    idealAcreage: '200 - 800 sq. ft. Indoor Hydroponic Room or Shed',
    gestationPeriod: '7 - 12 Days (Fastest Recurring Weekly Cash Flow)',
    setupCostEstimate: '₹45,000 - ₹95,000 (Vertical Racks, 6500K LED Grow Lights, Timer Pumps, Trays)',
    buyerPriceEstimate: '₹800 - ₹1,400 / kg Fresh Living Trays / Clamshell Packs',
    setupSpecs: {
      environment: 'Indoor vertical shelving with automated bottom-watering or ebb-and-flow hydroponic setup.',
      infrastructure: [
        '4 to 6-tier heavy-duty powder-coated wire shelving units',
        'Full spectrum 6500K daylight LED grow lights with 16/8 hour automated timer',
        'Dehumidifier unit and continuous oscillation air fans'
      ],
      soilOrSubstrate: 'Chemical-free organic coco-peat or certified food-grade hemp mats; pH 6.0 - 6.5.',
      climateAndWater: 'Temp 20°C - 23°C; Humidity 45% - 55% (low humidity prevents damping off); RO-filtered pure water only.',
      sterileProtocols: 'Sanitize trays with 3% food-grade H2O2 between cycles; seed surface sterilization prior to soaking.'
    },
    qualityStandards: {
      turgidityOrPurity: 'Erect, crunchy stems with vibrant true leaves; 100% soil-free clean harvest.',
      moistureTolerance: 'Dry surface packaging with zero condensation droplets inside clamshell.',
      visualDefects: 'Zero damping-off rot, stuck seed hulls on cotyledons, or yellowing.',
      certificationsRequired: [
        'Microbiological Safety Report (E. coli / Salmonella 0.0 CFU/g)',
        'Non-GMO Untreated Seed Certificate',
        'Cold-Chain Delivery Log Sheet (3-5°C transit)'
      ],
      rejectionCriteria: [
        'Root rot, mold, or fungal growth at tray corners',
        'Wilted stems or waterlogged packaging',
        'Greater than 20% uneven growth across tray'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: '25 kg / week Living Trays or 500 Clamshell Packs',
      fpoRecommendation: 'Peri-urban growers group together to supply premium hotels, cafes, and health stores in Hyderabad & Amaravati on standing contracts.',
      institutionalDemandScore: 94,
      primaryBuyers: [
        'Hyderabad Gourmet Chefs Consortium',
        'Banjara Hills Culinary Hub',
        'Gachibowli Farm-to-Fork Direct',
        'Hyderabad Organic Foods (Rangareddy)'
      ]
    }
  }
};

export const CROP_DATABASE_TE: Record<string, CropRequirement> = {
  'aloe vera': {
    id: 'aloe-vera',
    name: 'కలబంద (అలోవెరా) సాగు విధానం',
    scientificName: 'Aloe barbadensis Miller',
    category: 'ఔషధ & సౌందర్య వాణిజ్య పంట',
    idealAcreage: '1.0 నుండి 5.0 ఎకరాలు (బహిరంగ పొలం)',
    gestationPeriod: '12-18 నెలలు (నిరంతర 5 సంవత్సరాల కోత)',
    setupCostEstimate: '₹60,000 - ₹90,000 / ఎకరానికి (పిలకలు + బిందు సేద్యం + నేల తయారీ)',
    buyerPriceEstimate: '₹4.50 - ₹7.00 / కిలో తాజా ఆకులు (ఖచ్చితమైన బైబ్యాక్)',
    setupSpecs: {
      environment: 'బహిరంగ పొలంలో మంచి నీటి పారుదల గల ఇసుక నేలలు లేదా నల్లరేగడి నేలలు. రోజుకు కనీసం 6-8 గంటల పాటు పుష్కలంగా ఎండ తగలాలి.',
      infrastructure: [
        'ఒత్తిడి ఉద్గారకాలతో కూడిన బిందు సేద్యం (డ్రిప్ ఇరిగేషన్ సబ్-మెయిన్స్)',
        'పశువులు మేయకుండా తోట చుట్టూ రక్షణ కంచె',
        'కోత కోసిన వెంటనే ఆకులను నిల్వ ఉంచడానికి నీడగల క్లీనింగ్ & సార్టింగ్ షెడ్'
      ],
      soilOrSubstrate: 'కనీసం 2 సంవత్సరాల సహజ కంపోస్ట్ మరియు పచ్చిరొట్ట ఎరువులతో నేల తయారీ విధానం. రసాయన అవశేషాలు లేని pH 7.0 - 8.5 గల స్వచ్ఛమైన నేల.',
      climateAndWater: 'ఎండ మరియు తేలికపాటి ఉష్ణమండల వాతావరణం & నీటి పారుదల. ప్రతి 10-14 రోజులకు ఒకసారి తేలికపాటి తడి చాలు; నీరు నిలవ ఉండకూడదు.',
      sterileProtocols: 'కోత కోసేటప్పుడు తీసుకోవలసిన జాగ్రత్తలు: శిలీంధ్రాలు ఆశించకుండా 70% IPA తో శుభ్రం చేసిన స్టెయిన్‌లెస్ స్టీల్ కత్తులతో ఉదయం 9 గంటల లోపే ఆకులను కోయాలి.'
    },
    qualityStandards: {
      turgidityOrPurity: 'కనీసం 90% ఆకు నిండుదనం (టర్గిడిటీ); అడుగు భాగంలో కనీసం > 2.5 సెం.మీ మందం.',
      moistureTolerance: '98.5% స్వచ్ఛమైన కలబంద గుజ్జు తేమ; కరిగే ఘనపదార్థాలు (TSS) > 0.8 బ్రిక్స్.',
      visualDefects: 'మచ్చలు, ఎండదెబ్బ లేదా చివర్లలో గాయాలు ఉండకూడదు; ఆకులు దృఢంగా ఆకుపచ్చ రంగులో ఉండాలి.',
      certificationsRequired: [
        'రసాయన అవశేషాలు లేని ధ్రువీకరణ పత్రం (NABL)',
        'భారీ లోహాల రహిత విశ్లేషణ నివేదిక (< 5ppm)',
        'పంట మూలం & జియో-ట్యాగింగ్ లెడ్జర్'
      ],
      rejectionCriteria: [
        '80% కంటే తక్కువ నాణ్యత గల వడలిన ఆకులు',
        'బ్యాక్టీరియల్ మృదు తెగులు లేదా చివర్లు నల్లబడిన ఆకులు',
        'మధ్యాహ్నం ఎండలో కోయడం వల్ల గుజ్జు రంగు మారిన ఆకులు'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'కనీసం 5.0 టన్నుల సరుకు (ట్రక్కు లోడ్)',
      fpoRecommendation: '2 ఎకరాల లోపు రైతులు స్థానిక తెలుగు FPOలతో (అనంతపురం, చిత్తూరు క్లస్టర్లు) కలిసి 10 చక్రాల రీఫర్ ట్రక్కు నింపడానికి సరుకును సమకూర్చాలి.',
      institutionalDemandScore: 92,
      primaryBuyers: ['శ్రీ బాలాజీ ఆయుర్వేదిక్ ల్యాబ్స్ (చిత్తూరు)', 'పతంజలి ఆయుర్వేద్ (తిరుపతి హబ్)', 'దక్కన్ బయో-ఫార్మా (హైదరాబాద్)', 'రాయలసీమ ఎక్స్‌ట్రాక్ట్స్', 'వైజాగ్ బయో-హెర్బల్ ఎక్స్‌ట్రాక్ట్స్']
    }
  },
  'saffron': {
    id: 'saffron',
    name: 'కుంకుమపువ్వు (కేసర్) సాగు విధానం',
    scientificName: 'Crocus sativus L.',
    category: 'వాతావరణ నియంత్రిత గది సుగంధ ద్రవ్యం',
    idealAcreage: '300 - 1,200 చ.అడుగుల ఇండోర్ క్లైమేట్ చాంబర్',
    gestationPeriod: '90-110 రోజులు (అక్టోబర్-నవంబర్ పూల సమయం)',
    setupCostEstimate: '₹3,50,000 - ₹5,00,000 / 500 చ.అడుగులకు (ర్యాక్స్ + HVAC + కార్మ్స్)',
    buyerPriceEstimate: '₹2,20,000 - ₹3,10,000 / కిలో ఎండిన గ్రేడ్-1 కేసరాలు',
    setupSpecs: {
      environment: 'పూర్తిగా ఇన్సులేట్ చేయబడిన ఉష్ణోగ్రత మరియు చీకటి నియంత్రణ గల గది.',
      infrastructure: [
        '4 నుండి 5 అంతస్తుల చెక్క లేదా యాంటీ-స్టాటిక్ పౌడర్ కోటెడ్ నిలువు ర్యాక్స్',
        'పగలు 15°C - 18°C, రాత్రి 10°C - 12°C ఉష్ణోగ్రతను నిర్వహించే ప్రెసిషన్ HVAC యూనిట్',
        '75-85% తేమను నిర్వహించే అల్ట్రాసోనిక్ హ్యూమిడిఫైయర్లు & HEPA ఎయిర్ ఫిల్టర్లు'
      ],
      soilOrSubstrate: 'మట్టి లేని ఏరోపోనిక్ పద్ధతి; స్లాటెడ్ ప్లాస్టిక్ క్రేట్లలో పూత పూయించే పద్ధతి.',
      climateAndWater: 'వాతావరణం & నీటి పారుదల: పూల సమయంలో నేరుగా నీరు పోయకూడదు; కేవలం ఆటోమైజ్డ్ మిస్ట్ ద్వారా మాత్రమే తేమను నియంత్రించాలి.',
      sterileProtocols: 'కోత కోసేటప్పుడు తీసుకోవలసిన జాగ్రత్తలు: ఎయిర్-లాక్ ప్రవేశ ద్వారం; పూత పూసిన 3 గంటల్లోపు సర్జికల్ గ్లౌవ్స్, హెయిర్‌నెట్స్ మరియు ట్వీజర్లతో కేసరాలను సేకరించాలి.'
    },
    qualityStandards: {
      turgidityOrPurity: 'ISO 3632 గ్రేడ్-1 ప్రమాణం: క్రోసిన్ (రంగు సాంద్రత) > 220, సఫ్రానాల్ (సువాసన) > 40, పిక్రోక్రోసిన్ > 80.',
      moistureTolerance: 'ఎండిన కేసరాలలో తేమ ఖచ్చితంగా 8.0% - 10.0% మధ్య ఉండాలి.',
      visualDefects: 'స్వచ్ఛమైన ముదురు ఎరుపు రంగు కేసరాలు; పసుపు తోక బరువు < 5% మాత్రమే అనుమతించబడుతుంది.',
      certificationsRequired: [
        'ISO 3632 స్పెక్ట్రోఫొటోమెట్రిక్ గ్రేడ్ 1 సర్టిఫికేట్',
        'తేమ & సువాసన విశ్లేషణ సర్టిఫికేట్',
        'సహజ డీహైడ్రేషన్ రిపోర్ట్'
      ],
      rejectionCriteria: [
        '8% కంటే ఎక్కువ పసుపు/తెలుపు తోక భాగం ఉండటం',
        'తేమ 12% కంటే ఎక్కువ ఉండటం వల్ల బూజు రావడం లేదా సువాసన కోల్పోవడం',
        'క్రోసిన్ రంగు సాంద్రత 190 కంటే తక్కువగా ఉండటం'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'కనీసం 500 గ్రాముల స్వచ్ఛమైన ఎండిన గ్రేడ్-1 లాట్',
      fpoRecommendation: 'చిన్న రైతులు 200 చ.అడుగుల గదిలో సాగు చేసి తెలంగాణ స్పైస్ కన్సార్షియం ద్వారా అధిక లాభాలు పొందవచ్చు.',
      institutionalDemandScore: 97,
      primaryBuyers: ['తెలంగాణ బయో-బొటానికల్ ఎక్స్‌ట్రాక్ట్స్ (వరంగల్)', 'హైదరాబాద్ అరోమా ల్యాబ్స్', 'రాయలసీమ స్పెషాలిటీ స్పైసెస్']
    }
  },
  'mushrooms': {
    id: 'mushrooms',
    name: 'పుట్టగొడుగుల సాగు విధానం',
    scientificName: 'Pleurotus ostreatus / Calocybe indica / Agaricus bisporus',
    category: 'నియంత్రిత గది పౌష్టికాహార ప్రోటీన్ పంట',
    idealAcreage: '400 - 2,000 చ.అడుగుల చీకటి గది (నిలువు అరల సాగు)',
    gestationPeriod: '21 - 35 రోజులు (వారపు పునరావృత ఆదాయం)',
    setupCostEstimate: '₹80,000 - ₹1,80,000 (ఇన్సులేటెడ్ షెడ్, ఫాగర్లు, ఎగ్జాస్ట్ ఫ్యాన్లు, PP బ్యాగులు)',
    buyerPriceEstimate: '₹140 - ₹240 / కిలో తాజా పుట్టగొడుగులు | ₹800 / కిలో డీహైడ్రేటెడ్',
    setupSpecs: {
      environment: 'తేమ నియంత్రణ గల చీకటి గది లేదా పాలీహౌస్; 24/7 గాలి వెలుతురు ప్రసరించే వెంటిలేషన్ వ్యవస్థ.',
      infrastructure: [
        'నైలాన్ తాడు లేదా వెదురు/GI నిలువు అరల ర్యాక్స్ (5 అంతస్తులు)',
        'RH సెన్సార్లతో కూడిన ఆటోమేటిక్ సైకిల్ ఫాగర్ వ్యవస్థ',
        'కార్బన్ డయాక్సైడ్ నియంత్రణకు ఎగ్జాస్ట్ ఫ్యాన్లు (CO2 < 1,000 ppm)'
      ],
      soilOrSubstrate: 'ఆవిరితో శుద్ధి చేసిన వరి గడ్డి లేదా గోధుమ గడ్డి సబ్‌స్ట్రేట్, 2% కాల్షియం కార్బోనేట్ మిశ్రమం; తేమ శాతం ~65%.',
      climateAndWater: 'వాతావరణం & నీటి పారుదల: ఉష్ణోగ్రత 24°C - 28°C (ఆయిస్టర్) / 16°C - 20°C (బటన్); తేమ 85% - 90%; రోజుకు 2-3 సార్లు మైక్రో మిస్ట్ స్ప్రే.',
      sterileProtocols: 'కోత కోసేటప్పుడు తీసుకోవలసిన జాగ్రత్తలు: 80°C వద్ద 2 గంటల పాటు సబ్‌స్ట్రేట్ పాశ్చరైజేషన్; లామినార్ ఎయిర్‌ఫ్లో స్పానింగ్ బూత్; శుభ్రమైన ఫార్మలిన్‌తో స్టెరిలైజ్ చేసిన గది.'
    },
    qualityStandards: {
      turgidityOrPurity: 'దృఢమైన, తాజా తెల్లటి టోపీలు; కోత సమయంలో రేణువుల రాలడం 0% ఉండాలి.',
      moistureTolerance: 'తాజా బరువులో 90-92% తేమ; డీహైడ్రేటెడ్ లాట్‌లో తేమ < 7% మరియు నైట్రోజన్ సీల్.',
      visualDefects: 'బ్రౌన్ మచ్చలు, గ్రీన్ మోల్డ్ (ట్రైకోడెర్మా) లేదా పురుగుల నష్టం ఉండకూడదు.',
      certificationsRequired: [
        'FSSAI ఆహార పరిశుభ్రత ధ్రువీకరణ పత్రం',
        'రసాయన రహిత పుట్టగొడుగుల స్పాన్ అథెంటికేషన్ సర్టిఫికేట్',
        'కోల్డ్ చైన్ లాగ్ షీట్ (2-4°C వద్ద డెలివరీ)'
      ],
      rejectionCriteria: [
        'విచ్చుకున్న లేదా విరిగిపోయిన టోపీలు',
        'ఎక్కువ ఉష్ణోగ్రత లేదా CO2 వల్ల పసుపు రంగులోకి మారిన పుట్టగొడుగులు',
        'జిగురుగా మారిన ఉపరితలం'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'రోజుకు 100 కిలోల తాజా సరుకు లేదా వారానికి 200 కిలోల డీహైడ్రేటెడ్ లాట్',
      fpoRecommendation: 'FPO కోల్డ్-వ్యాన్ సమూహాల ద్వారా హైదరాబాద్ మరియు విజయవాడ సూపర్ మార్కెట్లకు నిరంతరం సరఫరా చేయవచ్చు.',
      institutionalDemandScore: 89,
      primaryBuyers: [
        'దక్కన్ ఫుడ్ ప్రాసెసర్స్ (మేడ్చల్)',
        'ITC అగ్రి బిజినెస్ డివిజన్ (గుంటూరు హబ్)',
        'కాకినాడ అగ్రి-హార్టికల్చర్ ఎక్స్‌పోర్ట్స్',
        'హెరిటేజ్ ఫుడ్స్ హైదరాబాద్ హబ్'
      ]
    }
  },
  'microgreens': {
    id: 'microgreens',
    name: 'గౌర్మెట్ మైక్రోగ్రీన్స్ సాగు విధానం',
    scientificName: 'Brassica oleracea / Raphanus sativus / Helianthus annuus',
    category: 'హై-డెన్సిటీ నిలువు అరల ఖచ్చితత్వ పంట',
    idealAcreage: '200 - 800 చ.అడుగుల ఇండోర్ హైడ్రోపోనిక్ గది లేదా షెడ్',
    gestationPeriod: '7 - 12 రోజులు (ప్రతి వారం వేగవంతమైన పునరావృత నగదు రాబడి)',
    setupCostEstimate: '₹45,000 - ₹95,000 (నిలువు అరల ర్యాక్స్, LED 6500K గ్రో లైట్స్, టైమర్ పంపులు, ట్రేలు)',
    buyerPriceEstimate: '₹800 - ₹1,400 / కిలో తాజా లివింగ్ ట్రేలు / క్లామ్‌షెల్ ప్యాక్‌లు',
    setupSpecs: {
      environment: 'ఇండోర్ నిలువు అరలపై ఆటోమేటెడ్ ఫ్లడ్ & డ్రెయిన్ లేదా బాటమ్-వాటరింగ్ సిస్టమ్.',
      infrastructure: [
        '4 నుండి 6 అంతస్తుల హెవీ-డ్యూటీ పౌడర్ కోటెడ్ వైర్ షెల్వింగ్ యూనిట్లు',
        'పూర్తి స్పెక్ట్రమ్ 6500K డేలైట్ LED గ్రో లైట్లు & 16/8 గంటల ఆటోమేటెడ్ టైమర్',
        'తేమ నియంత్రణ డీహ్యూమిడిఫైయర్ మరియు ఎయిర్ సర్క్యులేషన్ ఫ్యాన్లు'
      ],
      soilOrSubstrate: 'రసాయన రహిత ఆర్గానిక్ కోకో పీట్ లేదా సర్టిఫైడ్ ఫుడ్-గ్రేడ్ హెంప్ గ్రో మ్యాట్స్; pH 6.0 - 6.5 గల స్వచ్ఛమైన మాధ్యమం.',
      climateAndWater: 'వాతావరణం & నీటి పారుదల: ఉష్ణోగ్రత 20°C - 23°C; తేమ 45% - 55% (శిలీంధ్రాలు రాకుండా తక్కువ తేమ); RO ఫిల్టర్ చేసిన స్వచ్ఛమైన నీరు మాత్రమే వాడాలి.',
      sterileProtocols: 'కోత కోసేటప్పుడు తీసుకోవలసిన జాగ్రత్తలు: ప్రతి కోత తర్వాత 3% H2O2 ద్రావణంతో ట్రేలను శుభ్రం చేయాలి; విత్తన నానబెట్టే ముందు శానిటైజేషన్.'
    },
    qualityStandards: {
      turgidityOrPurity: 'తాజా నిటారైన కాండాలు, ముదురు ఆకుపచ్చ/ఊదా రంగు ఆకులు; 100% మట్టి రహిత శుభ్రమైన కోత.',
      moistureTolerance: 'ప్యాకింగ్ లోపల నీటి బిందువులు లేకుండా పొడిగా ఉండాలి.',
      visualDefects: 'మొక్కలు కుళ్ళడం, ఆకులపై విత్తన పొట్టు మిగిలిపోవడం లేదా పసుపు రంగు మారడం ఉండకూడదు.',
      certificationsRequired: [
        'మైక్రోబయోలాజికల్ పరిశుభ్రత (E. coli / Salmonella 0.0 CFU/g)',
        'నాన్-GMO విత్తన సర్టిఫికేట్',
        'కోల్డ్-చైన్ డెలివరీ ట్రాకర్ (3-5°C డెలివరీ)'
      ],
      rejectionCriteria: [
        'వేర్లు కుళ్ళడం లేదా ట్రే మూలల్లో బూజు రావడం',
        'వడలిన కాండాలు లేదా ప్యాకింగ్ లోపల తేమ నిలవడం',
        'ఆకుల ఎదుగుదలలో 20% కంటే ఎక్కువ అసమానత'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'వారానికి 25 కిలోల లివింగ్ ట్రేలు లేదా 500 క్లామ్‌షెల్ ప్యాక్‌లు',
      fpoRecommendation: 'నగర పరిసర ప్రాంతాల రైతులు సమూహంగా ఏర్పడి హైదరాబాద్ & అమరావతి హోటళ్ళు, రెస్టారెంట్లతో నిరంతర సరఫరా ఒప్పందం చేసుకోవచ్చు.',
      institutionalDemandScore: 94,
      primaryBuyers: [
        'హైదరాబాద్ గౌర్మెట్ చెఫ్స్ కన్సార్షియం',
        'బంజారాహిల్స్ క్యులినరీ హబ్',
        'గచ్చిబౌలి ఫామ్-టు-ఫోర్క్ డైరెక్ట్',
        'హైదరాబాద్ ఆర్గానిక్ ఫుడ్స్ (రంగారెడ్డి)'
      ]
    }
  }
};

export const CROP_DATABASE_HI: Record<string, CropRequirement> = {
  'aloe vera': {
    id: 'aloe-vera',
    name: 'एलोवेरा (घृतकुमारी) संपूर्ण कृषि ब्लूप्रिंट',
    scientificName: 'Aloe barbadensis Miller',
    category: 'औषधीय व सौंदर्य प्रसाधन वाणिज्यिक फसल',
    idealAcreage: '1.0 से 5.0 एकड़ (खुला खेत)',
    gestationPeriod: '12-18 महीने (लगातार 5 साल तक कटाई)',
    setupCostEstimate: '₹60,000 - ₹90,000 / एकड़ (सकर्स + ड्रिप सिस्टम + खेत तैयारी)',
    buyerPriceEstimate: '₹4.50 - ₹7.00 / किलो ताजी पत्तियां (निश्चित बायबैक)',
    setupSpecs: {
      environment: 'अच्छी जल निकासी वाली रेतीली दोमट या लाल मिट्टी। रोजाना कम से कम 6-8 घंटे की सीधी धूप आवश्यक है।',
      infrastructure: [
        'प्रेशर कम्पेन्सेटिंग ड्रिप सिंचाई प्रणाली',
        'आवारा पशुओं से सुरक्षा हेतु तारबंदी',
        'कटाई के बाद पत्तियों की छंटाई व सफाई के लिए छायादार शेड'
      ],
      soilOrSubstrate: 'अच्छी तरह सड़ी गोबर खाद व हरी खाद से तैयार खेत। रासायनिक अवशेष मुक्त pH 7.0 - 8.5 युक्त मिट्टी।',
      climateAndWater: 'गर्म व शुष्क जलवायु। हर 10-14 दिनों में एक बार हल्की सिंचाई; जलभराव बिल्कुल न होने दें।',
      sterileProtocols: 'कटाई सावधानियां: फंगल संक्रमण से बचाव के लिए 70% IPA से सैनिटाइज्ड स्टेनलेस स्टील चाकू से सुबह 9 बजे से पहले ही पत्तियां काटें।'
    },
    qualityStandards: {
      turgidityOrPurity: 'कम से कम 90% पत्ती का कसाव (टर्गिडिटी); निचले आधार की मोटाई > 2.5 सेमी।',
      moistureTolerance: '98.5% शुद्ध एलोवेरा जेल नमी; कुल घुलनशील ठोस (TSS) > 0.8 ब्रिक्स।',
      visualDefects: 'दाग-धब्बे, धूप से झुलसन या कटे-फटे किनारे नहीं होने चाहिए; पत्तियां गहरी हरी व स्वस्थ हों।',
      certificationsRequired: [
        'रसायन अवशेष मुक्त प्रमाण पत्र (NABL)',
        'भारी धातु मुक्त विश्लेषण रिपोर्ट (< 5ppm)',
        'फार्म ट्रेसिबिलिटी व जियो-टैग लेजर'
      ],
      rejectionCriteria: [
        '80% से कम कसाव वाली मुरझाई पत्तियां',
        'बैक्टीरियल सॉफ्ट रॉट या काले सिरे वाली पत्तियां',
        'दोपहर की तेज धूप में काटने से जेल का रंग बदलना'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'न्यूनतम 5.0 टन (पूरा ट्रक लोड)',
      fpoRecommendation: '2 एकड़ से कम जमीन वाले किसान स्थानीय FPO (अनंतपुर व चित्तूर क्लस्टर) के साथ मिलकर ट्रक लोड पूरा करें।',
      institutionalDemandScore: 92,
      primaryBuyers: [
        'श्री बालाजी आयुर्वेदिक लैब्स (चित्तूर)',
        'पतंजलि आयुर्वेद (तिरुपति हब)',
        'दक्कन बायो-फार्मा (हैदराबाद)',
        'विशाखापत्तनम बायो-हर्बल एक्सट्रैक्ट्स Ltd'
      ]
    }
  },
  'saffron': {
    id: 'saffron',
    name: 'इंडोर एरोपोनिक केसर (जाफरान) ब्लूप्रिंट',
    scientificName: 'Crocus sativus L.',
    category: 'जलवायु नियंत्रित इंडोर गॉरमेट मसाला',
    idealAcreage: '300 - 1,200 वर्ग फुट इंडोर इंसुलेटेड क्लाइमेट रूम',
    gestationPeriod: '90-110 दिन (अक्टूबर-नवंबर फूल खिलने का समय)',
    setupCostEstimate: '₹3,50,000 - ₹5,00,000 / 500 वर्ग फुट (रैक्स + HVAC + कॉर्म्‍स)',
    buyerPriceEstimate: '₹2,20,000 - ₹3,10,000 / किलो सूखा ग्रेड-1 केसर',
    setupSpecs: {
      environment: 'पूरी तरह इंसुलेटेड, तापमान व अंधेरा नियंत्रित इंडोर कमरा।',
      infrastructure: [
        '4 से 5 मंजिला लकड़ी या एंटी-स्टैटिक वर्टिकल रैक्स',
        'दिन में 15°C - 18°C व रात में 10°C - 12°C बनाए रखने वाला प्रिसिजन HVAC यूनिट',
        '75-85% नमी बनाए रखने वाले अल्ट्रासोनिक ह्यूमिडिफायर व HEPA फिल्टर'
      ],
      soilOrSubstrate: 'मिट्टी रहित एरोपोनिक विधि; स्लॉटेड फूड-ग्रेड क्रेट्स में कॉर्म्‍स रखे जाते हैं।',
      climateAndWater: 'माइक्रो-मिस्ट वातावरण; फूल खिलने के समय सीधे पानी का छिड़काव न करें।',
      sterileProtocols: 'एयर-लॉक प्रवेश द्वार; फूल खिलने के 3 घंटे के भीतर सैनिटाइज्ड चिमटी और दस्तानों से केसर निकालें।'
    },
    qualityStandards: {
      turgidityOrPurity: 'ISO 3632 ग्रेड-1 मानक: क्रोसिन (रंग शक्ति) > 220, सैफ्रानल (खुशबू) > 40, पिक्रॉक्रोसिन > 80।',
      moistureTolerance: 'सूखे केसर में नमी 8.0% से 10.0% के बीच ही होनी चाहिए।',
      visualDefects: 'गहरा लाल शुद्ध केसर; पीले तंतु का वजन 5% से कम होना चाहिए।',
      certificationsRequired: [
        'ISO 3632 स्पेक्ट्रोफोटोमेट्रिक ग्रेड-1 प्रमाण पत्र',
        'नमी व सुगंध विश्लेषण रिपोर्ट',
        'प्राकृतिक डिहाइड्रेशन लॉग'
      ],
      rejectionCriteria: [
        '8% से अधिक पीले/सफेद तंतु का होना',
        '12% से अधिक नमी के कारण फफूंद या खुशबू कम होना',
        'क्रोसिन मान 190 से कम होना'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: 'न्यूनतम 500 ग्राम सूखा ग्रेड-1 लॉट',
      fpoRecommendation: '200 वर्ग फुट के छोटे कमरे में उगाने वाले किसान तेलंगाना व AP स्पाइस कंसोर्टियम के माध्यम से प्रीमियम मूल्य प्राप्त करें।',
      institutionalDemandScore: 97,
      primaryBuyers: [
        'तेलंगाना बायो-बॉटनिकल एक्सट्रैक्ट्स (वारंगल)',
        'हैदराबाद अरोमा लैब्स',
        'रायलसीमा स्पेशलिटी स्पाइसेस'
      ]
    }
  },
  'mushrooms': {
    id: 'mushrooms',
    name: 'व्यावसायिक मशरूम उत्पादन ब्लूप्रिंट',
    scientificName: 'Pleurotus ostreatus / Calocybe indica / Agaricus bisporus',
    category: 'नियंत्रित इंडोर उच्च-प्रोटीन फसल',
    idealAcreage: '400 - 2,000 वर्ग फुट अंधेरा कमरा / शेड (वर्टिकल रैक)',
    gestationPeriod: '21 - 35 दिन (साप्ताहिक नियमित नकद आय)',
    setupCostEstimate: '₹80,000 - ₹1,80,000 (इंसुलेटेड शेड, फॉगर्स, एग्जॉस्ट फैन, PP बैग्स)',
    buyerPriceEstimate: '₹140 - ₹240 / किलो ताजा मशरूम | ₹800 / किलो सूखा मशरूम',
    setupSpecs: {
      environment: 'नमी नियंत्रित अंधेरा कमरा या पॉलीहाउस जिसमें 24/7 स्वच्छ हवा की आवाजाही हो।',
      infrastructure: [
        'नायलॉन रस्सी या 5 मंजिला वर्टिकल बांस/GI शेल्फ रैक्स',
        'सेंसर युक्त ऑटोमैटिक फॉगर सिस्टम',
        'CO2 नियंत्रण हेतु एग्जॉस्ट फैन (CO2 < 1,000 ppm)'
      ],
      soilOrSubstrate: 'भाप से शोधित धान का पुआल या गेहूं का भूसा, 2% कैल्शियम कार्बोनेट; नमी ~65%।',
      climateAndWater: 'तापमान 22°C - 28°C (ऑयस्टर/मिल्की) या 16°C - 20°C (बटन); नमी 85% - 90%; दिन में 2-3 बार हल्का फॉगिंग स्प्रे।',
      sterileProtocols: '80°C पर 2 घंटे तक भूसे का पाश्चुरीकरण; लैमिनार एयरफ्लो स्पॉनिंग डेस्क; फॉर्मेलिन से विसंक्रमित कमरा।'
    },
    qualityStandards: {
      turgidityOrPurity: 'सफेद, ठोस ताजी टोपी; कटाई के समय बीजाणु न गिरे हों।',
      moistureTolerance: 'ताजा वजन में 90-92% नमी; सूखे लॉट में नमी < 7% व नाइट्रोजन सील्ड पैकिंग।',
      visualDefects: 'भूरे धब्बे, हरी फफूंद (ट्राइकोडर्मा) या कीड़ों का छेद न हो।',
      certificationsRequired: [
        'FSSAI खाद्य स्वच्छता प्रमाण पत्र',
        'रसायन मुक्त मशरूम स्पॉन प्रामाणिकता प्रमाण पत्र',
        'कोल्ड-चेन तापमान लॉग (2-4°C डिलीवरी)'
      ],
      rejectionCriteria: [
        'खुली हुई या टूटी हुई मशरूम टोपी',
        'अत्यधिक गर्मी या CO2 से पीला पड़ना',
        'चिपचिपी सतह'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: '100 किलो / दिन ताजा या 200 किलो / सप्ताह सूखा लॉट',
      fpoRecommendation: 'FPO की रीफर वैन के माध्यम से हैदराबाद और विजयवाड़ा के सुपरमार्केटों को सीधी आपूर्ति करें।',
      institutionalDemandScore: 89,
      primaryBuyers: [
        'दक्कन फूड प्रोसेसर्स (मेडचल)',
        'ITC एग्री बिजनेस डिवीजन (गुंटूर हब)',
        'काकीनाडा एग्री-हॉर्टिकल्चर एक्सपोर्ट्स',
        'हेरिटेज फूड्स हैदराबाद हब'
      ]
    }
  },
  'microgreens': {
    id: 'microgreens',
    name: 'गॉरमेट माइक्रोग्रीन्स खेती ब्लूप्रिंट',
    scientificName: 'Brassica oleracea / Raphanus sativus / Helianthus annuus',
    category: 'हाई-डेंसिटी इंडोर वर्टिकल प्रिसिजन फसल',
    idealAcreage: '200 - 800 वर्ग फुट इंडोर हाइड्रोपोनिक कमरा या शेड',
    gestationPeriod: '7 - 12 दिन (सबसे तेज साप्ताहिक नकद आवक)',
    setupCostEstimate: '₹45,000 - ₹95,000 (वर्टिकल रैक्स, 6500K LED ग्रो लाइट्स, टाइमर पंप्स, ट्रे)',
    buyerPriceEstimate: '₹800 - ₹1,400 / किलो ताजी ट्रे / क्लैमशेल पैक्स',
    setupSpecs: {
      environment: 'इंडोर मल्टी-टियर रैक पर ऑटोमेटेड बॉटम-वाटरिंग या हाइड्रोपोनिक ट्रे व्यवस्था।',
      infrastructure: [
        '4 से 6 मंजिला हैवी ड्यूटी पाउडर-कोटेड वायर शेल्फ',
        'फुल स्पेक्ट्रम 6500K डेलाइट LED ग्रो लाइट्स (16/8 घंटे टाइमर)',
        'डीह्यूमिडिफायर व एयर सर्कुलेशन ऑसिलेटिंग पंखे'
      ],
      soilOrSubstrate: 'रसायन मुक्त ऑर्गेनिक कोकोपीट या फूड-ग्रेड हेम्प मैट्स; pH 6.0 - 6.5।',
      climateAndWater: 'तापमान 20°C - 23°C; नमी 45% - 55% (कम नमी से फंगस नहीं लगती); केवल RO का शुद्ध पानी उपयोग करें।',
      sterileProtocols: 'हर फसल चक्र के बाद 3% H2O2 से ट्रे साफ करें; बीजों को भिगोने से पहले सतह विसंक्रमण।'
    },
    qualityStandards: {
      turgidityOrPurity: 'कुरकुरे, सीधे तने व गहरी हरी/बैंगनी पत्तियां; 100% मिट्टी रहित साफ कटाई।',
      moistureTolerance: 'पैकिंग के अंदर पानी की बूंदें न हों, सूखी पैकेजिंग।',
      visualDefects: 'डैम्पिंग-ऑफ रॉट, पत्तियों पर चिपका बीज का छिलका या पीलापन नहीं होना चाहिए।',
      certificationsRequired: [
        'माइक्रोबायोलॉजिकल सुरक्षा रिपोर्ट (E. coli / Salmonella 0.0 CFU/g)',
        'नॉन-GMO बीज प्रमाण पत्र',
        'कोल्ड-चेन डिलीवरी लॉग (3-5°C डिलीवरी)'
      ],
      rejectionCriteria: [
        'जड़ सड़न या ट्रे के कोनों में फफूंद',
        'मुरझाए तने या पैकिंग के भीतर अधिक नमी',
        'ट्रे में 20% से अधिक असमान बढ़वार'
      ]
    },
    roiAnalysis: {
      minBulkThreshold: '25 किलो / सप्ताह ताजी ट्रे या 500 क्लैमशेल पैक्स',
      fpoRecommendation: 'शहरी क्षेत्रों के आसपास के किसान समूह बनाकर हैदराबाद व अमरावती के प्रीमियम होटलों व रेस्टोरेंटों से नियमित आपूर्ति अनुबंध करें।',
      institutionalDemandScore: 94,
      primaryBuyers: [
        'हैदराबाद गॉरमेट शेफ्स कंसोर्टियम',
        'बंजारा हिल्स कलिनरी हब',
        'गाछीबाउली फार्म-टू-फोर्क डायरेक्ट',
        'हैदराबाद ऑर्गेनिक फूड्स (रंगारेड्डी)'
      ]
    }
  }
};

/**
 * Dynamic crop requirement retriever that provides complete language-pure data
 */
export function getCropRequirement(cropKey: string, lang: 'en' | 'te' | 'hi' = 'en'): CropRequirement {
  const normalizedKey = cropKey.toLowerCase().trim();
  let db = CROP_DATABASE_EN;
  if (lang === 'te') db = CROP_DATABASE_TE;
  if (lang === 'hi') db = CROP_DATABASE_HI;

  if (normalizedKey.includes('saffron') || normalizedKey.includes('kesar') || normalizedKey.includes('zafran') || normalizedKey.includes('కుంకుమపువ్వు') || normalizedKey.includes('కేసర్') || normalizedKey.includes('केसर')) {
    return db['saffron'];
  }
  if (normalizedKey.includes('mushroom') || normalizedKey.includes('పుట్టగొడుగు') || normalizedKey.includes('मशरूम')) {
    return db['mushrooms'];
  }
  if (normalizedKey.includes('microgreen') || normalizedKey.includes('మైక్రోగ్రీన్స్') || normalizedKey.includes('माइक्रोग्रीन्स')) {
    return db['microgreens'];
  }
  return db['aloe vera'];
}

// Backward-compatible default export
export const CROP_DATABASE = CROP_DATABASE_TE;

// INTEGRATED LOCAL DATASET (BUYER TENDERS)
export const BUYER_TENDERS: BuyerDemand[] = [
  {
    id: "demand_vizag",
    buyerName: "Vizag Bio-Herbal Extracts Ltd",
    location: "Visakhapatnam, Andhra Pradesh",
    crop: "Aloe Vera",
    quantity: "8 Tonnes/Month",
    specs: "Chemical-free leaves for gel processing (Direct Port DBT Settlements)",
    verified: true,
    organizationType: 'Pharma / Ayurveda',
    cropName: 'Aloe Vera (Barbadensis)',
    quantityRequired: '8 Tonnes/Month',
    minAcreageRequired: 2.0,
    offeredPrice: '₹8.00 / kg (Direct Farm-Gate Price)',
    procurementSeason: 'Year-Round Monthly Cycle',
    locationRequirement: 'Visakhapatnam, Andhra Pradesh',
    verifiedGST: true,
    isUrgent: true,
    qualityGrade: 'Verified Partner ✅ (Chemical-Free Gel Grade)',
    specSummary: 'Chemical-free leaves for gel processing. Direct farm-gate truck collection.'
  },
  {
    id: "demand_kakinada",
    buyerName: "Kakinada Agri-Horticulture Exports",
    location: "Kakinada, Andhra Pradesh",
    crop: "Mushrooms",
    quantity: "3 Tonnes/Month",
    specs: "Export-grade button mushrooms, vacuum-packed (Deepwater Port Cold-Chain)",
    verified: true,
    organizationType: 'FMCG Corporate',
    cropName: 'Button Mushrooms',
    quantityRequired: '3 Tonnes/Month',
    minAcreageRequired: 1.5,
    offeredPrice: '₹195 / kg Fresh Button Mushrooms',
    procurementSeason: 'Weekly Export Dispatch',
    locationRequirement: 'Kakinada, Andhra Pradesh',
    verifiedGST: true,
    isUrgent: true,
    qualityGrade: 'Verified Partner ✅ (Export Grade-1 Vacuum Packed)',
    specSummary: 'Export-grade button mushrooms, vacuum-packed.'
  },
  { 
    id: "demand_1", 
    buyerName: "Sri Balaji Ayurvedic Labs", 
    location: "Chittoor, Andhra Pradesh", 
    crop: "Aloe Vera", 
    quantity: "5 Tonnes", 
    specs: "90% leaf turgidity, chemical-free", 
    verified: true,
    organizationType: 'Pharma / Ayurveda',
    cropName: 'Aloe Vera (Barbadensis)',
    quantityRequired: '5 Tonnes',
    minAcreageRequired: 2.0,
    offeredPrice: '₹7.20 / kg (Direct Farm-Gate Price)',
    procurementSeason: 'Harvest Window: Oct 2026 - Feb 2027',
    locationRequirement: 'Chittoor, Andhra Pradesh',
    verifiedGST: true,
    isUrgent: true,
    qualityGrade: 'Verified Partner ✅ (Pharma Grade-A >90% Turgidity)',
    specSummary: '90% leaf turgidity, chemical-free. Direct farm-gate truck pickup.'
  },
  { 
    id: "demand_2", 
    buyerName: "Deccan Food Processors Ltd", 
    location: "Medchal, Telangana", 
    crop: "Mushrooms", 
    quantity: "2 Tonnes", 
    specs: "Freshly harvested button mushrooms, vacuum-packed", 
    verified: true,
    organizationType: 'FMCG Corporate',
    cropName: 'Button Mushrooms',
    quantityRequired: '2 Tonnes',
    minAcreageRequired: 1.5,
    offeredPrice: '₹185 / kg Fresh Button Mushrooms',
    procurementSeason: 'Year-Round Weekly Procurement Cycle',
    locationRequirement: 'Medchal, Telangana',
    verifiedGST: true,
    isUrgent: true,
    qualityGrade: 'Verified Partner ✅ (Export Grade-1 Firm Caps)',
    specSummary: 'Freshly harvested button mushrooms, vacuum-packed.'
  },
  { 
    id: "demand_3", 
    buyerName: "Hyderabad Organic Foods", 
    location: "Rangareddy, Telangana", 
    crop: "Microgreens", 
    quantity: "500 Kgs", 
    specs: "Sprouted coco-peat grown, non-GMO seeds", 
    verified: true,
    organizationType: 'Hospitality / Exporter',
    cropName: 'Gourmet Microgreens',
    quantityRequired: '500 Kgs',
    minAcreageRequired: 0.5,
    offeredPrice: '₹600 / kg Fresh Living Tray',
    procurementSeason: 'Year-Round Weekly Delivery',
    locationRequirement: 'Rangareddy, Telangana',
    verifiedGST: true,
    isUrgent: false,
    qualityGrade: 'Verified Partner ✅ (Non-GMO Sprouted)',
    specSummary: 'Sprouted coco-peat grown, non-GMO seeds.'
  },
  { 
    id: "demand_4", 
    buyerName: "Unverified Crop Corp (Scam Flagged)", 
    location: "Secunderabad, Telangana", 
    crop: "Aloe Vera", 
    quantity: "10 Tonnes", 
    specs: "Demands upfront registration fees", 
    verified: false,
    organizationType: 'Institutional',
    cropName: 'Aloe Vera',
    quantityRequired: '10 Tonnes',
    minAcreageRequired: 2.0,
    offeredPrice: '₹15.00 / kg (Fake Unrealistic Rate)',
    procurementSeason: 'Immediate',
    locationRequirement: 'Secunderabad, Telangana',
    verifiedGST: false,
    isUrgent: true,
    qualityGrade: 'Unverified / Flagged Entity ⚠️',
    specSummary: 'Demands upfront registration fees. Flagged for fraud.'
  }
];

export const LIVE_BUYER_DEMANDS: BuyerDemand[] = BUYER_TENDERS;

export const FRAUD_REGISTRY_EN: FraudEntry[] = [
  {
    companyName: 'Unverified Corp',
    status: 'FLAGGED_FRAUD',
    reason: 'Reported by 38 farmers for charging ₹15,000 upfront "registration & sapling processing fee" and absconding.',
    reportCount: 38,
    warningNote: "⚠️ FRAUD ALERT: This buyer is flagged on our internal Fraud List for charging upfront 'registration fees.' Never pay advance money to any buyer!"
  },
  {
    companyName: 'AgriAdvance Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'Multiple complaints in Telangana for collecting ₹20,000 advance "deposit and agreement booking charges".',
    reportCount: 47,
    warningNote: "⚠️ FRAUD ALERT: This buyer is flagged on our internal Fraud List for charging upfront 'registration fees.' Never pay advance money to any buyer!"
  },
  {
    companyName: 'AgroGold Buyback Scams Pvt Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'Promises unrealistic ₹35/kg for Aloe and forces farmers to buy overpriced saplings from their associate firm.',
    reportCount: 52,
    warningNote: "⚠️ FRAUD ALERT: Classic seed-sale scam. Legitimate institutional buyers never force buying seeds from a proprietary single vendor at 5x market price."
  },
  {
    companyName: 'Apex Crop Venture',
    status: 'FLAGGED_FRAUD',
    reason: 'Fake 15-digit GSTIN and invalid address. Forged corporate inquiry documents with fake stamps.',
    reportCount: 19,
    warningNote: "⚠️ FRAUD ALERT: Unverified entity with fictitious GST number. Refused verified bank transfer credentials."
  },
  {
    companyName: 'Sri Balaji Ayurvedic Labs',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCS4512E1ZQ',
    location: 'Chittoor, Andhra Pradesh',
    trustScore: 98,
    reason: 'Verified partner with 10+ years of prompt farmer buyback settlements and direct factory-gate logistics.'
  },
  {
    companyName: 'Deccan Food Processors Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '36AADCD8834M1Z5',
    location: 'Medchal, Telangana',
    trustScore: 97,
    reason: 'Govt-recognized agro-processing unit with cold-chain fleet and direct DBT bank payments to growers.'
  },
  {
    companyName: 'ITC Agri Business Division',
    status: 'VERIFIED_BUYER',
    gstin: '36AAACI0001B1Z2',
    location: 'Guntur (AP) & Hyderabad (Telangana)',
    trustScore: 99,
    reason: 'e-Choupal leader. Fully verified institutional procurement with direct RTGS bank transfers at farm-gate.'
  },
  {
    companyName: 'Patanjali Ayurved Ltd.',
    status: 'VERIFIED_BUYER',
    gstin: '37AAACP1234F1Z8',
    location: 'Tirupati / Chittoor Regional Depots, Andhra Pradesh',
    trustScore: 98,
    reason: 'Institutional Ayurveda giant with verified long-term farmer relationships across Rayalaseema.'
  },
  {
    companyName: 'Vizag Bio-Herbal Extracts Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCV9912K1ZX',
    location: 'Visakhapatnam, Andhra Pradesh',
    trustScore: 98,
    reason: 'Verified coastal herbal extraction plant with direct port-linked procurement and DBT settlements.'
  },
  {
    companyName: 'Kakinada Agri-Horticulture Exports',
    status: 'VERIFIED_BUYER',
    gstin: '37AAECK7741P1ZN',
    location: 'Kakinada, Andhra Pradesh',
    trustScore: 97,
    reason: 'Govt-recognized deepwater port cold-chain exporter specializing in vacuum-sealed button mushrooms.'
  }
];

export const FRAUD_REGISTRY_TE: FraudEntry[] = [
  {
    companyName: 'Unverified Corp',
    status: 'FLAGGED_FRAUD',
    reason: 'ముందస్తు "రిజిస్ట్రేషన్ మరియు మొక్కల ప్రాసెసింగ్ ఫీజు" పేరుతో ₹15,000 వసూలు చేసి మోసం చేసినట్లు 38 మంది రైతులు ఫిర్యాదు చేశారు.',
    reportCount: 38,
    warningNote: "⚠️ మోసపూరిత హెచ్చరిక: ముందస్తు 'రిజిస్ట్రేషన్ ఫీజు' అడిగినందుకు ఈ సంస్థ బ్లాక్‌లిస్ట్‌లో పెట్టబడింది. ఏ కొనుగోలుదారుకు ముందస్తు డబ్బు చెల్లించవద్దు!"
  },
  {
    companyName: 'AgriAdvance Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'అగ్రిమెంట్ బుకింగ్ కోసం ₹20,000 అడ్వాన్స్ డిపాజిట్ వసూలు చేసినందుకు తెలంగాణలో పలు రైతుల ఫిర్యాదులు నమోదయ్యాయి.',
    reportCount: 47,
    warningNote: "⚠️ మోసపూరిత హెచ్చరిక: ఈ కొనుగోలుదారు బ్లాక్‌లిస్ట్‌లో ఉన్నారు. ఎవరికీ అడ్వాన్స్ లేదా డిపాజిట్ నగదు ఇవ్వవద్దు!"
  },
  {
    companyName: 'AgroGold Buyback Scams Pvt Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'కలబందకు కిలోకు ₹35 ఇస్తామని నమ్మించి, అధిక ధరలకు తమ వద్దే మొక్కలు కొనేలా బలవంతం చేసి మోసం చేశారు.',
    reportCount: 52,
    warningNote: "⚠️ మోసపూరిత హెచ్చరిక: నకిలీ విత్తన మోసం. అసలైన కార్పొరేట్ కంపెనీలు తమ అనుబంధ డీలర్ల వద్ద 5 రెట్లు ఎక్కువ ధరకు మొక్కలు కొనమని బలవంతం చేయవు."
  },
  {
    companyName: 'Apex Crop Venture',
    status: 'FLAGGED_FRAUD',
    reason: 'నకిలీ 15-అంకెల GSTIN మరియు చెల్లని చిరునామా. నకిలీ స్టాంపులతో తప్పుడు కొనుగోలు పత్రాలు సృష్టించారు.',
    reportCount: 19,
    warningNote: "⚠️ మోసపూరిత హెచ్చరిక: తప్పుడు GST నంబర్‌తో ఉన్న ధృవీకరించబడని సంస్థ. బ్యాంక్ ఖాతా వివరాలు ఇవ్వడానికి నిరాకరించారు."
  },
  {
    companyName: 'Sri Balaji Ayurvedic Labs',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCS4512E1ZQ',
    location: 'చిత్తూరు, ఆంధ్రప్రదేశ్',
    trustScore: 98,
    reason: '10+ సంవత్సరాలుగా రైతులకు సకాలంలో చెల్లింపులు చేస్తున్న ధృవీకరించబడిన సంస్థాగత కొనుగోలుదారు.'
  },
  {
    companyName: 'Deccan Food Processors Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '36AADCD8834M1Z5',
    location: 'మేడ్చల్, తెలంగాణ',
    trustScore: 97,
    reason: 'కోల్డ్ చైన్ సదుపాయం మరియు రైతులకు నేరుగా DBT బ్యాంక్ బదిలీలు చేసే గుర్తింపు పొందిన అగ్రో ప్రాసెసింగ్ యూనిట్.'
  },
  {
    companyName: 'ITC Agri Business Division',
    status: 'VERIFIED_BUYER',
    gstin: '36AAACI0001B1Z2',
    location: 'గుంటూరు (AP) & హైదరాబాద్ (తెలంగాణ)',
    trustScore: 99,
    reason: 'ఈ-చౌపాల్ అగ్రగామి. రైతు పొలం వద్దే కొనుగోలు చేసి నేరుగా RTGS ద్వారా నగదు జమ చేసే అత్యంత విశ్వసనీయ సంస్థ.'
  },
  {
    companyName: 'Patanjali Ayurved Ltd.',
    status: 'VERIFIED_BUYER',
    gstin: '37AAACP1234F1Z8',
    location: 'తిరుపతి / చిత్తూరు డిపోలు, ఆంధ్రప్రదేశ్',
    trustScore: 98,
    reason: 'రాయలసీమ అంతటా రైతులతో దీర్ఘకాలిక కొనుగోలు సంబంధాలు కలిగిన ధృవీకరించబడిన ఆయుర్వేద సంస్థ.'
  },
  {
    companyName: 'Vizag Bio-Herbal Extracts Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCV9912K1ZX',
    location: 'విశాఖపట్నం, ఆంధ్రప్రదేశ్',
    trustScore: 98,
    reason: 'తీరప్రాంత హెర్బల్ ఎక్స్‌ట్రాక్షన్ ప్లాంట్. నేరుగా రైతులకు DBT ద్వారా సత్వర చెల్లింపులు.'
  },
  {
    companyName: 'Kakinada Agri-Horticulture Exports',
    status: 'VERIFIED_BUYER',
    gstin: '37AAECK7741P1ZN',
    location: 'కాకినాడ, ఆంధ్రప్రదేశ్',
    trustScore: 97,
    reason: 'ప్రభుత్వ గుర్తింపు పొందిన డీప్‌వాటర్ పోర్ట్ కోల్డ్ చైన్ ఎగుమతిదారు. బటన్ మష్రూమ్స్ ప్రత్యేక కొనుగోలు.'
  }
];

export const FRAUD_REGISTRY_HI: FraudEntry[] = [
  {
    companyName: 'Unverified Corp',
    status: 'FLAGGED_FRAUD',
    reason: 'अग्रिम "पंजीकरण एवं पौध प्रसंस्करण शुल्क" के नाम पर ₹15,000 वसूलने और गायब होने की 38 किसानों ने शिकायत दर्ज की।',
    reportCount: 38,
    warningNote: "⚠️ धोखाधड़ी चेतावनी: अग्रिम 'पंजीकरण शुल्क' मांगने पर यह खरीदार ब्लैकलिस्ट किया गया है। किसी भी खरीदार को कभी पहले पैसे न दें!"
  },
  {
    companyName: 'AgriAdvance Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'अनुबंध बुकिंग के लिए ₹20,000 अग्रिम जमा राशि मांगने पर तेलंगाना में कई किसानों द्वारा शिकायत दर्ज।',
    reportCount: 47,
    warningNote: "⚠️ धोखाधड़ी चेतावनी: यह इकाई ब्लैकलिस्टेड है। अग्रिम राशि या डिपॉजिट कभी न दें!"
  },
  {
    companyName: 'AgroGold Buyback Scams Pvt Ltd',
    status: 'FLAGGED_FRAUD',
    reason: 'एलोवेरा के लिए अवास्तविक ₹35/किग्रा का वादा कर अपनी सहयोगी फर्म से 5 गुना महंगे पौधे खरीदने के लिए मजबूर किया।',
    reportCount: 52,
    warningNote: "⚠️ धोखाधड़ी चेतावनी: क्लासिक बीज/पौध घोटाला। प्रामाणिक खरीदार कभी भी महंगे पौधे खरीदने का दबाव नहीं बनाते।"
  },
  {
    companyName: 'Apex Crop Venture',
    status: 'FLAGGED_FRAUD',
    reason: 'फर्जी 15-अंकीय GSTIN व अमान्य पता। फर्जी मोहरों वाले जाली खरीद दस्तावेज तैयार किए गए।',
    reportCount: 19,
    warningNote: "⚠️ धोखाधड़ी चेतावनी: जाली GST नंबर वाली असत्यापित इकाई। सत्यापित बैंक विवरण देने से इनकार किया।"
  },
  {
    companyName: 'Sri Balaji Ayurvedic Labs',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCS4512E1ZQ',
    location: 'चित्तूर, आंध्र प्रदेश',
    trustScore: 98,
    reason: '10+ वर्षों से किसानों को समय पर भुगतान करने वाला सत्यापित संस्थागत खरीदार।'
  },
  {
    companyName: 'Deccan Food Processors Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '36AADCD8834M1Z5',
    location: 'मेदचल, तेलंगाना',
    trustScore: 97,
    reason: 'शीत-श्रृंखला व किसानों को सीधे DBT बैंक भुगतान करने वाली सरकार-मान्यता प्राप्त कृषि प्रसंस्करण इकाई।'
  },
  {
    companyName: 'ITC Agri Business Division',
    status: 'VERIFIED_BUYER',
    gstin: '36AAACI0001B1Z2',
    location: 'गुंटूर (AP) व हैदराबाद (तेलंगाना)',
    trustScore: 99,
    reason: 'ई-चौपाल प्रणेता। खेत पर सीधी खरीद व RTGS बैंक अंतरण द्वारा त्वरित भुगतान।'
  },
  {
    companyName: 'Patanjali Ayurved Ltd.',
    status: 'VERIFIED_BUYER',
    gstin: '37AAACP1234F1Z8',
    location: 'तिरुपति / चित्तूर डिपो, आंध्र प्रदेश',
    trustScore: 98,
    reason: 'रायलसीमा में किसानों के साथ दीर्घकालिक संबंध रखने वाला सत्यापित आयुर्वेद समूह।'
  },
  {
    companyName: 'Vizag Bio-Herbal Extracts Ltd',
    status: 'VERIFIED_BUYER',
    gstin: '37AABCV9912K1ZX',
    location: 'विशाखापत्तनम, आंध्र प्रदेश',
    trustScore: 98,
    reason: 'तटीय हर्बल निष्कर्षण संयंत्र। सीधे किसानों को DBT द्वारा त्वरित भुगतान।'
  },
  {
    companyName: 'Kakinada Agri-Horticulture Exports',
    status: 'VERIFIED_BUYER',
    gstin: '37AAECK7741P1ZN',
    location: 'काकीनाडा, आंध्र प्रदेश',
    trustScore: 97,
    reason: 'मान्यता प्राप्त डीपवाटर पोर्ट कोल्ड-चेन निर्यातक। मशरूम खरीद में विशेषज्ञ।'
  }
];

export const FRAUD_REGISTRY: FraudEntry[] = FRAUD_REGISTRY_EN;

export const CONTRACT_CHECKLIST_EN: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '1. Verify Buyer Business & GSTIN Registration',
    description: 'Ensure the buyer is an active registered business with a valid 15-digit state GST number (37 for AP, 36 for Telangana) matching their business bank account.',
    category: 'Legal',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-2',
    title: '2. Zero Advance Fees (Never Pay Upfront Money)',
    description: 'A legitimate corporate buyer will NEVER ask you for registration fees, file processing charges, or mandatory sapling deposit money. Never pay upfront fees.',
    category: 'Financial',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-3',
    title: '3. Clear Pre-Planting Price & Quality Inquiry',
    description: 'Clarify minimum base prices per kg, accepted harvest windows, and clear visual/moisture specifications in writing before sowing to prevent last-minute disputes.',
    category: 'Quality',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-4',
    title: '4. Local FPO Consultation (Volume Pooling < 2 Acres)',
    description: 'If your plot is under 2 acres, consult your local FPO cluster to pool harvests into 5-tonne batches so corporate trucks collect directly at your village.',
    category: 'Operational',
    isCompleted: false,
    importance: 'RECOMMENDED'
  }
];

export const CONTRACT_CHECKLIST_TE: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '1. కొనుగోలుదారు GSTIN & వ్యాపార రిజిస్ట్రేషన్ నిర్ధారణ',
    description: 'కొనుగోలుదారుకు సరైన 15-అంకెల GST నంబర్ (ఆంధ్రప్రదేశ్ కోసం 37, తెలంగాణ కోసం 36) మరియు బ్యాంక్ ఖాతా వివరాలు ఉన్నాయో లేదో నిర్ధారించుకోండి.',
    category: 'Legal',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-2',
    title: '2. సున్నా అడ్వాన్స్ ఫీజు (ఎట్టి పరిస్థితుల్లోనూ ముందస్తు రుసుము చెల్లించవద్దు)',
    description: 'అసలైన కొనుగోలు సంస్థలు ఎప్పుడూ రిజిస్ట్రేషన్ ఫీజు, ఫైల్ ప్రాసెసింగ్ ఛార్జీలు లేదా మొక్కల డిపాజిట్ డబ్బు అడగవు. ఎవరికీ ముందస్తు నగదు ఇవ్వవద్దు.',
    category: 'Financial',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-3',
    title: '3. విత్తే ముందే లిఖితపూర్వక ధర & నాణ్యతా ప్రమాణాలు',
    description: 'పంట వేయకముందే కిలో కనీస కొనుగోలు ధర, కోత సమయం, ఆకుల పరిమాణం మరియు తేమ శాతాన్ని లిఖితపూర్వకంగా ఖరారు చేసుకోండి.',
    category: 'Quality',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-4',
    title: '4. స్థానిక FPO సమూహం సంప్రదింపు (< 2 ఎకరాలు ఉంటే)',
    description: 'మీ భూమి 2 ఎకరాల కంటే తక్కువ ఉంటే, స్థానిక FPO రైతు సంఘంతో కలిసి 5 టన్నుల బల్క్ లోడ్ సిద్ధం చేయండి, కంపెనీ ట్రక్కులు నేరుగా మీ గ్రామానికే వస్తాయి.',
    category: 'Operational',
    isCompleted: false,
    importance: 'RECOMMENDED'
  }
];

export const CONTRACT_CHECKLIST_HI: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: '1. खरीदार का GSTIN व व्यावसायिक पंजीकरण सत्यापन',
    description: 'सुनिश्चित करें कि खरीदार के पास वैध 15-अंकों का राज्य GST नंबर (AP के लिए 37, तेलंगाना के लिए 36) और आधिकारिक बैंक खाता उपलब्ध है।',
    category: 'Legal',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-2',
    title: '2. शून्य अग्रिम शुल्क (कभी भी पहले पैसे न दें)',
    description: 'सच्ची संस्थागत कंपनियां कभी भी पंजीकरण शुल्क, फाइल शुल्क या अनिवार्य पौध धरोहर राशि नहीं मांगतीं। किसी भी हालत में एडवांस न दें।',
    category: 'Financial',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-3',
    title: '3. बुवाई से पहले लिखित मूल्य व गुणवत्ता मानक',
    description: 'बुवाई से पहले ही प्रति किलो न्यूनतम आधार मूल्य, कटाई का समय और स्पष्ट नमी/गुणवत्ता मानक लिखित में तय करें ताकि बाद में कोई विवाद न हो।',
    category: 'Quality',
    isCompleted: false,
    importance: 'CRITICAL'
  },
  {
    id: 'chk-4',
    title: '4. स्थानीय FPO समूह से संपर्क (< 2 एकड़ के लिए)',
    description: 'यदि आपके पास 2 एकड़ से कम भूमि है, तो स्थानीय FPO के साथ मिलकर 5 टन का ट्रक लोड तैयार करें, जिससे खरीदार के ट्रक सीधे आपके खेत तक पहुंच सकें।',
    category: 'Operational',
    isCompleted: false,
    importance: 'RECOMMENDED'
  }
];

export const CONTRACT_CHECKLIST: ChecklistItem[] = CONTRACT_CHECKLIST_EN;

// INTEGRATED LOCAL DATASET (FPO DIRECTORY)
export const FPO_DIRECTORY: FpoCluster[] = [
  {
    id: "fpo_godavari",
    fpoName: "Godavari River Basin Organic FPO",
    name: "Godavari River Basin Organic FPO",
    location: "Rajamahendravaram, East Godavari, Andhra Pradesh",
    district: "Rajamahendravaram, East Godavari, Andhra Pradesh",
    farmers: 310,
    memberFarmers: 310,
    crops: ["Aloe Vera", "Mushrooms"],
    cropsHandled: ["Aloe Vera", "Mushrooms"],
    contact: "Ch. Venkateswara Rao (FPO Director) • +91 94401 98765",
    contactPerson: "Ch. Venkateswara Rao (FPO Director)",
    phone: "+91 94401 98765",
    aggregationCenter: "Rajamahendravaram Godavari Agri-Logistics Terminal"
  },
  {
    id: "fpo_1",
    fpoName: "Anantha Raithu Organic Farmers FPO",
    name: "Anantha Raithu Organic Farmers FPO",
    location: "Anantapur, Andhra Pradesh",
    district: "Anantapur, Andhra Pradesh",
    farmers: 245,
    memberFarmers: 245,
    crops: ["Aloe Vera", "Sweet Orange"],
    cropsHandled: ["Aloe Vera", "Sweet Orange"],
    contact: "M. Siva Prasad (FPO Lead) • +91 94405 12345",
    contactPerson: "M. Siva Prasad (FPO Lead)",
    phone: "+91 94405 12345",
    aggregationCenter: "Anantapur Rural Cold-Chain Hub"
  },
  {
    id: "fpo_2",
    fpoName: "Kakatiya Mahila Horticulture Consortium",
    name: "Kakatiya Mahila Horticulture Consortium",
    location: "Warangal, Telangana",
    district: "Warangal, Telangana",
    farmers: 185,
    memberFarmers: 185,
    crops: ["Microgreens", "Mushrooms"],
    cropsHandled: ["Microgreens", "Mushrooms"],
    contact: "K. Saritha (FPO President) • +91 98480 98765",
    contactPerson: "K. Saritha (FPO President)",
    phone: "+91 98480 98765",
    aggregationCenter: "Warangal Urban Agri-Logistics Yard"
  }
];

export const FPO_CLUSTERS: FpoCluster[] = FPO_DIRECTORY;

export const EXTENSIBLE_UPCOMING_CROPS_EN = [
  {
    id: 'crop_dragon_fruit',
    name: 'Dragon Fruit (Pitaya)',
    category: 'Arid Trellis Fruit Crop',
    expectedRelease: 'Q4 2026',
    institutionalBuyers: 'Hyderabad Supermarkets & AP Exporters',
    votes: 412
  },
  {
    id: 'crop_stevia',
    name: 'Stevia (Sweet Honey Leaf)',
    category: 'Natural Zero-Calorie Sweetener',
    expectedRelease: 'Q1 2027',
    institutionalBuyers: 'Deccan Beverage & FMCG Units',
    votes: 388
  },
  {
    id: 'crop_moringa',
    name: 'Moringa Leaves (Export Grade Drumstick)',
    category: 'Superfood Powder Extract',
    expectedRelease: 'Q1 2027',
    institutionalBuyers: 'Rayalaseema & Telangana Nutraceuticals',
    votes: 520
  },
  {
    id: 'crop_black_rice',
    name: 'Black Rice (Chak-Hao)',
    category: 'Antioxidant Heritage Grain',
    expectedRelease: 'Q2 2027',
    institutionalBuyers: 'AP & Telangana Organic Chains',
    votes: 275
  }
];

export const EXTENSIBLE_UPCOMING_CROPS_TE = [
  {
    id: 'crop_dragon_fruit',
    name: 'డ్రాగన్ ఫ్రూట్ (పిటాయా)',
    category: 'మెట్ట ప్రాంత తీగ పండ్ల పంట',
    expectedRelease: '2026 నాల్గవ త్రైమాసికం (Q4)',
    institutionalBuyers: 'హైదరాబాద్ సూపర్ మార్కెట్లు & AP ఎగుమతిదారులు',
    votes: 412
  },
  {
    id: 'crop_stevia',
    name: 'స్టీవియా (మధుర తులసి / తీపి ఆకు)',
    category: 'సహజ జీరో-క్యాలరీ స్వీట్‌నర్',
    expectedRelease: '2027 మొదటి త్రైమాసికం (Q1)',
    institutionalBuyers: 'దక్కన్ బెవరేజెస్ & FMCG పరిశ్రమలు',
    votes: 388
  },
  {
    id: 'crop_moringa',
    name: 'ఎగుమతి రకం మునగ ఆకులు (మోరింగా)',
    category: 'సూపర్‌ఫుడ్ న్యూట్రాస్యూటికల్ పౌడర్',
    expectedRelease: '2027 మొదటి త్రైమాసికం (Q1)',
    institutionalBuyers: 'రాయలసీమ & తెలంగాణ న్యూట్రాస్యూటికల్ కంపెనీలు',
    votes: 520
  },
  {
    id: 'crop_black_rice',
    name: 'సేంద్రీయ నల్ల బియ్యం (చక్-హావ్)',
    category: 'యాంటీఆక్సిడెంట్ హెరిటేజ్ వరి ధాన్యం',
    expectedRelease: '2027 రెండవ త్రైమాసికం (Q2)',
    institutionalBuyers: 'AP & తెలంగాణ ఆర్గానిక్ స్టోర్లు మరియు ఎగుమతిదారులు',
    votes: 275
  }
];

export const EXTENSIBLE_UPCOMING_CROPS_HI = [
  {
    id: 'crop_dragon_fruit',
    name: 'ड्रैगन फ्रूट (कमलम / पिताया)',
    category: 'शुष्क क्षेत्र ट्रेलिस फल फसल',
    expectedRelease: 'Q4 2026',
    institutionalBuyers: 'हैदराबाद सुपरमार्केट व AP निर्यातक',
    votes: 412
  },
  {
    id: 'crop_stevia',
    name: 'स्टीविया (मीठी पत्ती)',
    category: 'प्राकृतिक शून्य-कैलोरी स्वीटनर',
    expectedRelease: 'Q1 2027',
    institutionalBuyers: 'डेक्कन बेवरेजेस व FMCG इकाइयां',
    votes: 388
  },
  {
    id: 'crop_moringa',
    name: 'निर्यात ग्रेड मोरिंगा (सहजन) पत्तियां',
    category: 'सुपरफूड न्यूट्रास्यूटिकल पाउडर',
    expectedRelease: 'Q1 2027',
    institutionalBuyers: 'रायलसीमा व तेलंगाना न्यूट्रास्यूटिकल्स',
    votes: 520
  },
  {
    id: 'crop_black_rice',
    name: 'काला चावल (चक-हाओ ऑर्गेनिक)',
    category: 'एंटीऑक्सीडेंट युक्त पारंपरिक अनाज',
    expectedRelease: 'Q2 2027',
    institutionalBuyers: 'AP व तेलंगाना ऑर्गेनिक स्टोर्स एवं निर्यातक',
    votes: 275
  }
];

export const EXTENSIBLE_UPCOMING_CROPS = EXTENSIBLE_UPCOMING_CROPS_EN;
