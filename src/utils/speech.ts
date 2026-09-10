/**
 * Web Speech API integration for zero-cost client-side Speech-to-Text and Text-to-Speech
 * Designed specifically for rural accessibility without calling expensive external APIs.
 * Includes native Telugu ('te-IN') voice matching and complete Telugu text & number normalization.
 */

// Speech-to-Text Recognition interface
export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

let activeRecognition: any = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

type VoiceNoticeListener = (notice: string) => void;
const noticeListeners = new Set<VoiceNoticeListener>();

export function onVoiceNotice(listener: VoiceNoticeListener): () => void {
  noticeListeners.add(listener);
  return () => {
    noticeListeners.delete(listener);
  };
}

export function notifyVoiceNotice(message: string): void {
  noticeListeners.forEach(fn => {
    try {
      fn(message);
    } catch (e) {
      // ignore
    }
  });

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('rythusetu-tts-notice', { detail: { message } }));
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Warm up and cache browser voices as early as possible.
 * Unlocks voice lists on Chrome, Edge, Safari, and mobile WebViews.
 */
export function warmupSpeechVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !isSpeechSynthesisSupported()) return [];
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
    }
  } catch (e) {
    // ignore
  }
  return cachedVoices;
}

// Auto warm-up and asynchronous voice loading listener
if (typeof window !== 'undefined' && isSpeechSynthesisSupported()) {
  warmupSpeechVoices();

  // Listen to onvoiceschanged because browsers (especially Chrome/Android) load voices asynchronously
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      warmupSpeechVoices();
    };
  }

  try {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      warmupSpeechVoices();
    });
  } catch (e) {
    // ignore
  }
}

/**
 * Retrieve cached voices or query the system dynamically
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !isSpeechSynthesisSupported()) return [];
  try {
    const sysVoices = window.speechSynthesis.getVoices();
    if (sysVoices && sysVoices.length > 0) {
      cachedVoices = sysVoices;
      return sysVoices;
    }
  } catch (e) {
    // ignore
  }
  if (cachedVoices.length === 0) {
    return warmupSpeechVoices();
  }
  return cachedVoices;
}

/**
 * Convert positive integer (0 to 99,99,99,999) to full spoken Telugu words
 */
export function numberToTeluguWords(num: number): string {
  if (isNaN(num)) return '';
  if (num === 0) return 'సున్నా';

  const ones = [
    '', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది',
    'పది', 'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పద్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పద్దెనిమిది', 'పంతొమ్మిది'
  ];

  const tens = [
    '', '', 'ఇరవై', 'ముప్పై', 'నలభై', 'యాభై', 'అరవై', 'డెబ్బై', 'ఎనభై', 'తొంభై'
  ];

  if (num < 20) return ones[num];
  if (num < 100) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    return r === 0 ? tens[t] : `${tens[t]} ${ones[r]}`.trim();
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    const hText = h === 1 ? 'వంద' : `${ones[h]} వందలు`;
    return r === 0 ? hText : `${hText} ${numberToTeluguWords(r)}`.trim();
  }
  if (num < 100000) {
    const th = Math.floor(num / 1000);
    const r = num % 1000;
    const thText = th === 1 ? 'వెయ్యి' : `${numberToTeluguWords(th)} వేలు`;
    return r === 0 ? thText : `${thText} ${numberToTeluguWords(r)}`.trim();
  }
  if (num < 10000000) {
    const l = Math.floor(num / 100000);
    const r = num % 100000;
    const lText = l === 1 ? 'లక్ష' : `${numberToTeluguWords(l)} లక్షలు`;
    return r === 0 ? lText : `${lText} ${numberToTeluguWords(r)}`.trim();
  }
  const c = Math.floor(num / 10000000);
  const r = num % 10000000;
  const cText = c === 1 ? 'కోటి' : `${numberToTeluguWords(c)} కోట్లు`;
  return r === 0 ? cText : `${cText} ${numberToTeluguWords(r)}`.trim();
}

/**
 * Convert decimal or integer string to Telugu words
 */
export function convertNumberStringToTelugu(numStr: string): string {
  const cleanStr = numStr.replace(/,/g, '').trim();
  if (!cleanStr) return '';

  if (cleanStr.includes('.')) {
    const [intPart, decPart] = cleanStr.split('.');
    const intVal = parseInt(intPart || '0', 10);
    const intWords = numberToTeluguWords(intVal);
    const decDigits = (decPart || '').split('').map(d => {
      const parsed = parseInt(d, 10);
      return !isNaN(parsed) ? numberToTeluguWords(parsed) : d;
    }).join(' ');
    return `${intWords} పాయింట్ ${decDigits}`.trim();
  }

  const intVal = parseInt(cleanStr, 10);
  if (!isNaN(intVal)) {
    return numberToTeluguWords(intVal);
  }
  return numStr;
}

/**
 * Normalizes and cleans text specifically for Hindi speech synthesis (TTS).
 * Converts numerals, units, dimensions, and symbols to Hindi spoken words.
 */
export function cleanTextForHindiTTS(text: string): string {
  if (!text) return '';

  let t = text
    // Remove markdown formatting characters
    .replace(/[*_~`#\[\]\(\)\>\|\\]/g, ' ')
    .replace(/•/g, ' ')
    // Remove emojis that cause synthetic speech delays or unnatural pause sounds
    .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, ' ');

  // 1. Unit & Currency normalizations
  t = t.replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 रुपये');
  t = t.replace(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, '$1 रुपये');
  t = t.replace(/INR\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, '$1 रुपये');
  t = t.replace(/₹/g, ' रुपये ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:kg|kgs|किलो)\b/gi, '$1 किलो');
  t = t.replace(/\b(?:kg|kgs)\b/gi, ' किलो ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:tonnes|tonne|tons|ton|टन)\b/gi, '$1 टन');
  t = t.replace(/\b(?:tonnes|tonne|tons|ton)\b/gi, ' टन ');
  t = t.replace(/°\s*C\b|deg\s*C\b|degrees\s*C\b/gi, ' डिग्री सेल्सियस ');
  t = t.replace(/\bpH\b|\bPH\b/g, ' पी एच ');
  t = t.replace(/%/g, ' प्रतिशत ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:acres?|एकड़)\b/gi, '$1 एकड़');
  t = t.replace(/\bacres?\b/gi, ' एकड़ ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:ft|feet|फीट)\b/gi, '$1 फीट');
  t = t.replace(/\b(?:ft|feet)\b/gi, ' फीट ');
  t = t.replace(/\bFPO\b|\bFPOs\b/gi, ' एफ पी ओ ');
  t = t.replace(/\bGST\b|\bGSTIN\b/gi, ' जी एस टी ');

  // 2. Numerical ranges (e.g. "8-10", "15-20", "20–30")
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*[-–]\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 से $2');

  // 3. Clean whitespace and punctuation
  t = t.replace(/[:;=\/]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

/**
 * Normalizes and cleans text specifically for Telugu speech synthesis (TTS).
 * Converts numerals, units, dimensions, and symbols to Telugu spoken words.
 */
export function cleanTextForTeluguTTS(text: string): string {
  if (!text) return '';

  let t = text
    // Remove markdown formatting characters
    .replace(/[*_~`#\[\]\(\)\>\|\\]/g, ' ')
    .replace(/•/g, ' ')
    // Remove emojis that cause synthetic speech delays or unnatural pause sounds
    .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, ' ');

  // 1. Unit & Currency normalizations
  t = t.replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, '$1 రూపాయలు');
  t = t.replace(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, '$1 రూపాయలు');
  t = t.replace(/INR\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, '$1 రూపాయలు');
  t = t.replace(/₹/g, ' రూపాయలు ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:kg|kgs|కిలోలు|కిలో)\b/gi, '$1 కిలోలు');
  t = t.replace(/\b(?:kg|kgs)\b/gi, ' కిలోలు ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:tonnes|tonne|tons|ton|టన్నులు|టన్ను)\b/gi, '$1 టన్నులు');
  t = t.replace(/\b(?:tonnes|tonne|tons|ton)\b/gi, ' టన్నులు ');
  t = t.replace(/°\s*C\b|deg\s*C\b|degrees\s*C\b/gi, ' డిగ్రీల సెల్సియస్ ');
  t = t.replace(/\bpH\b|\bPH\b/g, ' పి హెచ్ ');
  t = t.replace(/%/g, ' శాతం ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*acres?\b/gi, '$1 ఎకరాలు');
  t = t.replace(/\bacres?\b/gi, ' ఎకరాలు ');
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:ft|feet)\b/gi, '$1 అడుగులు');
  t = t.replace(/\b(?:ft|feet)\b/gi, ' అడుగులు ');
  t = t.replace(/\bFPO\b|\bFPOs\b/gi, ' ఎఫ్ పి ఓ ');
  t = t.replace(/\bGST\b|\bGSTIN\b/gi, ' జి ఎస్ టి ');

  // 2. Spacing / Dimension normalizations (e.g., "2 x 2 ft" -> "రెండు బై రెండు అడుగులు")
  t = t.replace(/(\d+)\s*[xX]\s*(\d+)\s*(?:ft|feet|అడుగులు)?/g, (_, d1, d2) => {
    return `${convertNumberStringToTelugu(d1)} బై ${convertNumberStringToTelugu(d2)} అడుగులు`;
  });

  // 3. Comparison symbols
  t = t.replace(/<\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, (_, d) => {
    return `${convertNumberStringToTelugu(d)} కంటే తక్కువ`;
  });
  t = t.replace(/>\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, (_, d) => {
    return `${convertNumberStringToTelugu(d)} కంటే ఎక్కువ`;
  });
  t = t.replace(/(\d+)\s*\+/g, (_, d) => {
    return `${convertNumberStringToTelugu(d)} కంటే ఎక్కువ`;
  });

  // 4. Numerical ranges (e.g. "8-10", "15-20", "20–30", "8,000-10,000", "400-800")
  t = t.replace(/(\d+(?:,\d+)*(?:\.\d+)?)\s*[-–]\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, (_, d1, d2) => {
    return `${convertNumberStringToTelugu(d1)} నుండి ${convertNumberStringToTelugu(d2)}`;
  });

  // 5. Convert remaining standard Arabic numbers to spoken Telugu words
  t = t.replace(/\b\d+(?:,\d+)*(?:\.\d+)?\b/g, (match) => {
    return convertNumberStringToTelugu(match);
  });

  // 6. Clean whitespace and non-Telugu punctuation
  t = t.replace(/[:;=\/]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

/**
 * Phonetic Transliteration Engine for Telugu text when native 'te-IN' TTS voice
 * is unavailable and system falls back to an English TTS voice engine.
 * Converts Telugu unicode script into smooth, natural-sounding English phonetic syllables.
 */
const TELUGU_PHRASE_MAPPINGS: Array<[RegExp, string]> = [
  [/నమస్తే\s*రైతు\s*సోదరులారా/gi, 'Namaste Raithu Sodharulaara'],
  [/రైతు\s*సోదరులకు\s*నమస్కారం/gi, 'Raithu sodharulaku namaskaram'],
  [/రైతుసంధి\s*AI\s*కి\s*స్వాగతం/gi, 'RythuSandhi AI ki swagatham'],
  [/రైతుసంధి\s*కి\s*స్వాగతం/gi, 'RythuSandhi ki swagatham'],
  [/రైతుసంధి/gi, 'RythuSandhi'],
  [/రైతుసేతు\s*AI\s*కి\s*స్వాగతం/gi, 'RythuSandhi AI ki swagatham'],
  [/రైతుసేతు\s*కి\s*స్వాగతం/gi, 'RythuSandhi ki swagatham'],
  [/నేను\s*మీ\s*వ్యవసాయ\s*సహాయకుడిని/gi, 'Nenu mee vyavasaya sahayakudini'],
  [/మీరు\s*(?:3|మూడు)\s*ఎకరాలు\s*కలిగి\s*ఉండటం\s*అద్భుతం/gi, 'Meeru moodu ekaraalu kaligi undatam adbhutham'],
  [/మీకు\s*(?:3|మూడు)\s*ఎకరాలు\s*ఉండటం\s*అద్భుతమైన\s*అవకాశం/gi, 'Meeku moodu ekaraalu undatam adbhutamaina avakasam'],
  [/కలిగి\s*ఉండటం\s*అద్భుతం/gi, 'kaligi undatam adbhutham'],
  [/అద్భుతమైన\s*అవకాశం/gi, 'adbhutamaina avakasam'],
  [/మీకు\s*సరైన\s*సలహా\s*అందించడానికి/gi, 'meeku saraina salaha andhinchadaaniki'],
  [/బహిరంగ\s*పొలంలో\s*సాగు\s*చేయాలనుకుంటున్నారా/gi, 'bahiranga polamlo saagu cheyalanukuntunnara'],
  [/ఇంటి\s*వద్ద\s*గదిలోనా/gi, 'inti vadda gadhilonaa'],
  [/ఎంత\s*భూమి\s*లేదా\s*స్థలం\s*ఉందో\s*తెలియజేయగలరా/gi, 'entha bhoomi ledaa sthalam undo theliyajeyagalara'],
  [/బహిరంగ\s*పొలం\s*సాగు/gi, 'Bahiranga polam saagu'],
  [/బహిరంగ\s*పొలం/gi, 'bahiranga polam'],
  [/కలబంద\s*\(అలోవెరా\)\s*సమగ్ర\s*సాగు\s*మార్గదర్శి/gi, 'Kalabanda (Aloe Vera) samagra saagu maargadarshi'],
  [/కలబంద\s*\(అలోవెరా\)/gi, 'Kalabanda (Aloe Vera)'],
  [/కలబంద/gi, 'Kalabanda'],
  [/అలోవెరా/gi, 'Aloe Vera'],
  [/పుట్టగొడుగుల\s*సాగు\s*వివరాలు/gi, 'Puttagodugula saagu vivaraalu'],
  [/పుట్టగొడుగుల\s*సాగు/gi, 'Puttagodugula saagu'],
  [/పుట్టగొడుగులు/gi, 'Puttagodugulu'],
  [/మైక్రోగ్రీన్స్\s*సాగు\s*వివరాలు/gi, 'Microgreens saagu vivaraalu'],
  [/మైక్రోగ్రీన్స్\s*సాగు/gi, 'Microgreens saagu'],
  [/మైక్రోగ్రీన్స్/gi, 'Microgreens'],
  [/ఇండోర్\s*కుంకుమపువ్వు\s*\(కేసర్\)\s*సాగు/gi, 'Indoor Kunkumapoovu (Kesar) saagu'],
  [/కుంకుమపువ్వు\s*\(కేసర్\)/gi, 'Kunkumapoovu (Kesar)'],
  [/కుంకుమపువ్వు/gi, 'Kunkumapoovu'],
  [/కేసర్/gi, 'Kesar'],
  [/గదిలో\s*నిలువు\s*అరలు/gi, 'Gadhilo niluvu aralu'],
  [/నిలువు\s*అరలపై\s*సాగు/gi, 'niluvu aralapai saagu'],
  [/త్వరిత\s*నగదు/gi, 'thwaritha nagadhu'],
  [/వారపు\s*ఆదాయం/gi, 'vaarapu aadaayam'],
  [/మంచి\s*గిరాకీ/gi, 'manchi giraaki'],
  [/పొలం\s*వద్దే\s*సేకరణ/gi, 'polam vadde sekarana'],
  [/శ్రీ\s*బాలాజీ\s*ఆయుర్వేదిక్\s*ల్యాబ్స్/gi, 'Sri Balaji Ayurvedic Labs'],
  [/దక్కన్\s*ఫుడ్\s*ప్రాసెసర్స్/gi, 'Deccan Food Processors'],
  [/హైదరాబాద్\s*ఆర్గానిక్\s*ఫుడ్స్/gi, 'Hyderabad Organic Foods'],
  [/అనంత\s*రైతు\s*ఆర్గానిక్\s*ఫార్మర్స్/gi, 'Anantha Raithu Organic Farmers'],
  [/అనంత\s*రైతు/gi, 'Anantha Raithu'],
  [/కాకతీయ\s*మహిళ\s*హార్టికల్చర్/gi, 'Kakatiya Mahila Horticulture'],
  [/కాకతీయ\s*మహిళ/gi, 'Kakatiya Mahila'],
  [/చిత్తూరు/gi, 'Chittoor'],
  [/అనంతపురం/gi, 'Anantapur'],
  [/వరంగల్/gi, 'Warangal'],
  [/మేడ్చల్/gi, 'Medchal'],
  [/రంగారెడ్డి/gi, 'Rangareddy'],
  [/తెలంగాణ/gi, 'Telangana'],
  [/ఆంధ్రప్రదేశ్/gi, 'Andhra Pradesh'],
  [/రూపాయలు/gi, 'roopaayalu'],
  [/కిలోలు/gi, 'kilolu'],
  [/కిలో/gi, 'kilo'],
  [/టన్నులు/gi, 'tannulu'],
  [/టన్ను/gi, 'tannu'],
  [/ఎకరాలు/gi, 'ekaraalu'],
  [/ఎకరం/gi, 'ekaram'],
  [/అడుగులు/gi, 'adugulu'],
  [/శాతం/gi, 'shaatham'],
  [/నమస్కారం/gi, 'Namaskaram'],
  [/స్వాగతం/gi, 'Swagatham'],
  [/వ్యవసాయ/gi, 'vyavasaya'],
  [/సహాయకుడు/gi, 'sahayakudu'],
  [/సహాయకుడిని/gi, 'sahayakudini'],
  [/రైతు/gi, 'Raithu'],
  [/రైతులు/gi, 'raithulu'],
  [/పంట/gi, 'panta'],
  [/పంటలు/gi, 'pantalu'],
  [/నీరు/gi, 'neeru'],
  [/భూమి/gi, 'bhoomi'],
  [/ఆదాయం/gi, 'aadaayam'],
  [/లాభం/gi, 'laabham'],
  [/సేకరణ/gi, 'sekarana'],
  [/కొనుగోలుదారులు/gi, 'konugoludaarulu'],
  [/ఎంపిక/gi, 'empika'],
  [/సాగు/gi, 'saagu'],
  [/నాణ్యత/gi, 'naanyatha'],
  [/ధర/gi, 'dhara']
];

/**
 * Detailed Telugu grapheme transliterator for all arbitrary Telugu Unicode text
 */
export function transliterateTeluguCharacters(input: string): string {
  const TELUGU_VOWELS: Record<string, string> = {
    '\u0C05': 'a',
    '\u0C06': 'aa',
    '\u0C07': 'i',
    '\u0C08': 'ee',
    '\u0C09': 'u',
    '\u0C0A': 'oo',
    '\u0C0B': 'ru',
    '\u0C60': 'roo',
    '\u0C0C': 'lu',
    '\u0C61': 'loo',
    '\u0C0E': 'e',
    '\u0C0F': 'ee',
    '\u0C10': 'ai',
    '\u0C12': 'o',
    '\u0C13': 'oo',
    '\u0C14': 'ou',
  };

  const TELUGU_CONSONANTS: Record<string, string> = {
    '\u0C15': 'k',
    '\u0C16': 'kh',
    '\u0C17': 'g',
    '\u0C18': 'gh',
    '\u0C19': 'ng',
    '\u0C1A': 'ch',
    '\u0C1B': 'chh',
    '\u0C1C': 'j',
    '\u0C1D': 'jh',
    '\u0C1E': 'ny',
    '\u0C1F': 't',
    '\u0C20': 'th',
    '\u0C21': 'd',
    '\u0C22': 'dh',
    '\u0C23': 'n',
    '\u0C24': 'th',
    '\u0C25': 'thh',
    '\u0C26': 'd',
    '\u0C27': 'dh',
    '\u0C28': 'n',
    '\u0C2A': 'p',
    '\u0C2B': 'f',
    '\u0C2C': 'b',
    '\u0C2D': 'bh',
    '\u0C2E': 'm',
    '\u0C2F': 'y',
    '\u0C30': 'r',
    '\u0C31': 'r',
    '\u0C32': 'l',
    '\u0C33': 'l',
    '\u0C35': 'v',
    '\u0C36': 'sh',
    '\u0C37': 'sh',
    '\u0C38': 's',
    '\u0C39': 'h',
  };

  const TELUGU_MATRAS: Record<string, string> = {
    '\u0C3E': 'aa',
    '\u0C3F': 'i',
    '\u0C40': 'ee',
    '\u0C41': 'u',
    '\u0C42': 'oo',
    '\u0C43': 'ru',
    '\u0C44': 'roo',
    '\u0C46': 'e',
    '\u0C47': 'ee',
    '\u0C48': 'ai',
    '\u0C4A': 'o',
    '\u0C4B': 'oo',
    '\u0C4C': 'ou',
  };

  const VIRAMA = '\u0C4D';
  const ANUSVARA = '\u0C02';
  const VISARGA = '\u0C03';

  let result = '';
  const len = input.length;
  let i = 0;

  while (i < len) {
    const char = input[i];
    const nextChar = i + 1 < len ? input[i + 1] : '';

    if (TELUGU_VOWELS[char]) {
      result += TELUGU_VOWELS[char];
      i++;
    } else if (TELUGU_CONSONANTS[char]) {
      const baseConsonant = TELUGU_CONSONANTS[char];
      if (nextChar === VIRAMA) {
        result += baseConsonant;
        i += 2; // consume consonant and virama
      } else if (TELUGU_MATRAS[nextChar]) {
        result += baseConsonant + TELUGU_MATRAS[nextChar];
        i += 2; // consume consonant and matra
      } else if (nextChar === ANUSVARA) {
        result += baseConsonant + 'am';
        i += 2;
      } else if (nextChar === VISARGA) {
        result += baseConsonant + 'aha';
        i += 2;
      } else {
        // Default inherent vowel 'a'
        result += baseConsonant + 'a';
        i++;
      }
    } else if (TELUGU_MATRAS[char]) {
      result += TELUGU_MATRAS[char];
      i++;
    } else if (char === ANUSVARA) {
      result += 'm';
      i++;
    } else if (char === VISARGA) {
      result += 'h';
      i++;
    } else if (char === VIRAMA) {
      i++;
    } else {
      result += char;
      i++;
    }
  }

  return result;
}

/**
 * Comprehensive transliterator: converts Telugu text to English phonetics for audio playback fallback.
 */
export function transliterateTeluguToPhoneticEnglish(text: string): string {
  if (!text) return '';

  let processed = text;

  // 1. Apply high-fidelity phrase & sentence mappings
  for (const [regex, replacement] of TELUGU_PHRASE_MAPPINGS) {
    processed = processed.replace(regex, replacement);
  }

  // 2. If any Telugu Unicode characters remain (U+0C00 to U+0C7F), transliterate them grapheme by grapheme
  if (/[\u0C00-\u0C7F]/.test(processed)) {
    processed = transliterateTeluguCharacters(processed);
  }

  // 3. Clean up formatting and spaces
  return processed.replace(/\s+/g, ' ').trim();
}

/**
 * Robust voice matcher:
 * - When Telugu ('te') is requested: Explicitly searches for Telugu voice (te-IN or startsWith('te')).
 * - If no native Telugu voice exists, fallback explicitly to default English voice so the utterance is never dropped.
 * - When Hindi ('hi') is requested: Search for native Hindi ('hi-IN' or startsWith('hi')), falling back to English.
 */
export function findBestVoiceForLang(langCode: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const lower = (langCode || '').toLowerCase();
  const isTelugu = lower.startsWith('te') || lower.includes('telugu');
  const isHindi = lower.startsWith('hi') || lower.includes('hindi');

  if (voices && voices.length > 0) {
    if (isTelugu) {
      // 1. Explicit search for native Telugu voice
      const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.startsWith('te'));
      if (teluguVoice) {
        return teluguVoice;
      }

      // 2. Fallback explicitly to Indian English or default English voice so speaker utility still functions
      const fallbackVoice = voices.find(v => {
        const vl = v.lang.toLowerCase();
        const vn = v.name.toLowerCase();
        return vl.includes('en-in') || vn.includes('india') || vn.includes('south asian');
      }) || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices.find(v => v.default) || voices[0];

      return fallbackVoice || null;
    }

    if (isHindi) {
      const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
      if (hindiVoice) {
        return hindiVoice;
      }

      const fallbackVoice = voices.find(v => {
        const vl = v.lang.toLowerCase();
        const vn = v.name.toLowerCase();
        return vl.includes('en-in') || vn.includes('india');
      }) || voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices.find(v => v.default) || voices[0];

      return fallbackVoice || null;
    }

    // English requested
    const engVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'))
      || voices.find(v => v.lang.toLowerCase().startsWith('en') && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google') || v.default))
      || voices.find(v => v.lang.toLowerCase().startsWith('en'))
      || voices.find(v => v.default)
      || voices[0];

    return engVoice || null;
  }

  return null;
}

export function startSpeechRecognition(
  onResult: (result: SpeechRecognitionResultPayload) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  lang: string = 'en-US'
): { stop: () => void } {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    return { stop: () => {} };
  }

  try {
    // @ts-ignore
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      onError('Speech recognition constructor not found.');
      return { stop: () => {} };
    }

    const recognition = new SpeechRecognitionClass();
    activeRecognition = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;

    // Normalise language code
    const isTelugu = lang.startsWith('te') || lang.includes('te-IN');
    const isHindi = lang.startsWith('hi') || lang.includes('hi-IN');
    const normalizedLang = isTelugu ? 'te-IN' : (isHindi ? 'hi-IN' : (lang.includes('IN') ? 'en-IN' : 'en-US'));
    recognition.lang = normalizedLang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: Boolean(finalTranscript)
      });
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event.error);
      const isTe = normalizedLang.startsWith('te');

      if (event.error === 'no-speech') {
        onError(
          isTe 
            ? 'ఎటువంటి స్వరం నమోదు కాలేదు. దయచేసి మైక్రోఫోన్ వద్ద స్పష్టంగా మాట్లాడండి.'
            : 'No speech detected. Please speak clearly into your microphone.'
        );
      } else if (event.error === 'audio-capture') {
        onError(
          isTe
            ? 'మైక్రోఫోన్ కనుగొనబడలేదు లేదా మ్యూట్ చేయబడింది.'
            : 'No microphone was found or microphone is muted.'
        );
      } else if (event.error === 'not-allowed') {
        onError(
          isTe
            ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్స్‌లో మైక్ యాక్సెస్ అనుమతించండి.'
            : 'Microphone permission was denied. Please allow microphone access in browser settings.'
        );
      } else if (event.error === 'language-not-supported') {
        onError(
          isTe
            ? 'మీ బ్రౌజర్‌లో తెలుగు వాయిస్ రికగ్నిషన్ ప్యాక్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి లేదా క్రోమ్ బ్రౌజర్ వాడండి.'
            : 'Selected language is not supported for speech recognition in this browser.'
        );
      } else if (event.error === 'network') {
        onError(
          isTe
            ? 'నెట్‌వర్క్ సమస్య వల్ల వాయిస్ రికగ్నిషన్ నిలిచిపోయింది. ఇంటర్నెట్ సరిచూసుకోండి.'
            : 'Network connection error during voice recognition.'
        );
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      activeRecognition = null;
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          if (recognition) {
            recognition.stop();
          }
        } catch (e) {
          // ignore already stopped
        }
      }
    };
  } catch (err: any) {
    onError(err?.message || 'Failed to start speech recognition');
    return { stop: () => {} };
  }
}

export function stopActiveRecognition() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {
      // ignore
    }
    activeRecognition = null;
  }
}

let activeFallbackAudio: HTMLAudioElement | null = null;

export function stopSpeaking() {
  if (activeFallbackAudio) {
    try {
      activeFallbackAudio.pause();
      activeFallbackAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeFallbackAudio = null;
  }
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Check if the browser currently has a native voice available for the language
 */
export function hasNativeVoice(langCode: string): boolean {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return false;
  const lower = (langCode || '').toLowerCase();
  const isTe = lower.startsWith('te') || lower.includes('telugu');
  const isHi = lower.startsWith('hi') || lower.includes('hindi');

  return voices.some(v => {
    const vl = (v.lang || '').toLowerCase();
    const vn = (v.name || '').toLowerCase();
    if (isTe) {
      return vl === 'te-in' || vl === 'te_in' || vl.startsWith('te') || vn.includes('telugu');
    }
    if (isHi) {
      return vl === 'hi-in' || vl === 'hi_in' || vl.startsWith('hi') || vn.includes('hindi');
    }
    return false;
  });
}

export function hasNativeTeluguVoice(): boolean {
  return hasNativeVoice('te');
}

export function hasNativeHindiVoice(): boolean {
  return hasNativeVoice('hi');
}

/**
 * Robust speakText function with audio context unlocking, stuck queue clearance,
 * native voice matching, rate/pitch tuning, and comprehensive Telugu normalization.
 */
export function speakText(
  text: string,
  onStartOrLang?: (() => void) | string,
  onEnd?: () => void,
  onError?: (err: string) => void,
  langCode: string = 'en-US'
): void {
  // Handle overloaded signatures: speakText(text, 'te') vs speakText(text, onStart, onEnd, onError, 'te-IN')
  let onStartCallback: (() => void) | undefined;
  let effectiveLang = langCode;

  if (typeof onStartOrLang === 'function') {
    onStartCallback = onStartOrLang;
  } else if (typeof onStartOrLang === 'string') {
    effectiveLang = onStartOrLang;
  }

  // 1. Stop any currently playing speech or fallback audio
  stopSpeaking();

  const isTelugu = effectiveLang.startsWith('te') || /[\u0C00-\u0C7F]/.test(text);
  const isHindi = effectiveLang.startsWith('hi') || /[\u0900-\u097F]/.test(text);

  // 2. Clean and normalize text
  let cleanSpeech = '';
  if (isTelugu) {
    cleanSpeech = cleanTextForTeluguTTS(text);
  } else if (isHindi) {
    cleanSpeech = cleanTextForHindiTTS(text);
  } else {
    cleanSpeech = text
      .replace(/[*_~`#\[\]\(\)\>\|\\]/g, ' ')
      .replace(/•/g, ' ')
      .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (!cleanSpeech) {
    onEnd?.();
    return;
  }

  // 3. Browser Speech Synthesis with voice matching & graceful fallback
  playViaBrowserSpeechSynthesis(cleanSpeech, isTelugu, isHindi, effectiveLang, onStartCallback, onEnd, onError);
}

/**
 * Fallback to Google TTS Audio stream when SpeechSynthesis encounters an error,
 * is blocked by browser policy, or unsupported on the client device.
 */
export function playGoogleTTSFallback(
  text: string,
  lang: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
): void {
  try {
    if (activeFallbackAudio) {
      try {
        activeFallbackAudio.pause();
        activeFallbackAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      activeFallbackAudio = null;
    }

    const lowerLang = (lang || '').toLowerCase();
    const langCode = lowerLang.startsWith('te') ? 'te' : (lowerLang.startsWith('hi') ? 'hi' : 'en');
    const textSegment = text.length > 200 ? text.slice(0, 195) + '...' : text;
    const encodedText = encodeURIComponent(textSegment);
    const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodedText}`;

    const audio = new Audio(fallbackUrl);
    activeFallbackAudio = audio;

    let started = false;

    audio.onplay = () => {
      if (!started) {
        started = true;
        onStart?.();
      }
    };

    audio.onended = () => {
      activeFallbackAudio = null;
      onEnd?.();
    };

    audio.onerror = (e) => {
      console.error('Google TTS audio fallback error event:', e);
      activeFallbackAudio = null;
      onError?.('Google TTS audio stream failed to load');
      onEnd?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error('Audio playback error: Google TTS playback blocked or rejected:', err);
        activeFallbackAudio = null;
        onError?.(err?.message || 'Audio playback blocked');
        onEnd?.();
      });
    }
  } catch (err: any) {
    console.error('Google TTS fallback initialization error:', err);
    activeFallbackAudio = null;
    onError?.(err?.message || 'Failed to initialize audio fallback');
    onEnd?.();
  }
}

function playViaBrowserSpeechSynthesis(
  cleanSpeech: string,
  isTelugu: boolean,
  isHindi: boolean,
  effectiveLang: string,
  onStartCallback?: () => void,
  onEnd?: () => void,
  onError?: (err: string) => void
) {
  const selectedLang = isTelugu ? 'te-IN' : (isHindi ? 'hi-IN' : (effectiveLang.includes('IN') ? 'en-IN' : 'en-US'));

  if (!isSpeechSynthesisSupported()) {
    console.info('SpeechSynthesis not supported, triggering Google TTS fallback');
    playGoogleTTSFallback(cleanSpeech, selectedLang, onStartCallback, onEnd, onError);
    return;
  }

  try {
    // Utterance Bounds: Clear any ongoing speech queues immediately before starting a new utterance to prevent speech overlaps or locking the browser's audio thread
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const voices = window.speechSynthesis.getVoices();
    let textToSpeak = cleanSpeech;
    let voiceToUse: SpeechSynthesisVoice | null = null;
    let langToUse = selectedLang;
    let rateToUse = 0.95;

    if (isTelugu) {
      // 1. Explicit search for native Telugu voice
      const teluguVoice = voices.find(v => v.lang === 'te-IN' || v.lang.startsWith('te'));
      if (teluguVoice) {
        voiceToUse = teluguVoice;
        langToUse = 'te-IN';
        rateToUse = 0.88;
        // Clean up mixed-language text for native Telugu voice engine:
        // Strip out English letters, brackets, and redundant characters so the native Telugu voice does not stumble
        textToSpeak = cleanSpeech.replace(/[a-zA-Z()]/g, '').replace(/\s+/g, ' ').trim();
      } else {
        // Fall back to default English voice with phonetic transliteration
        const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'))
          || voices.find(v => v.lang.toLowerCase().startsWith('en'))
          || voices.find(v => v.default)
          || voices[0] || null;

        voiceToUse = englishVoice;
        langToUse = englishVoice?.lang || 'en-US';
        rateToUse = 0.92;

        // Transliterate Telugu script into natural English phonetics for audio playback ONLY
        textToSpeak = transliterateTeluguToPhoneticEnglish(cleanSpeech);

        // Dynamically trigger brief on-screen alert, banner, or toast notification
        notifyVoiceNotice("⚠️ Telugu voice pack is not installed on this device. Playing English voice fallback. (To fix: Enable Telugu in your device's Text-to-Speech settings!)");
      }
    } else if (isHindi) {
      const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
      if (hindiVoice) {
        voiceToUse = hindiVoice;
        langToUse = 'hi-IN';
        rateToUse = 0.92;
        textToSpeak = cleanSpeech;
      } else {
        const englishVoice = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'))
          || voices.find(v => v.lang.toLowerCase().startsWith('en'))
          || voices.find(v => v.default)
          || voices[0] || null;

        voiceToUse = englishVoice;
        langToUse = englishVoice?.lang || 'en-US';
        rateToUse = 0.92;
        textToSpeak = cleanSpeech;
      }
    } else {
      const bestVoice = findBestVoiceForLang(selectedLang);
      if (bestVoice) {
        voiceToUse = bestVoice;
      }
      langToUse = selectedLang;
      rateToUse = 0.95;
      textToSpeak = cleanSpeech;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }
    utterance.lang = langToUse;
    utterance.rate = rateToUse;
    utterance.pitch = 1.0;

    let hasEnded = false;

    utterance.onstart = () => {
      onStartCallback?.();
    };

    utterance.onend = () => {
      if (!hasEnded) {
        hasEnded = true;
        onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesisUtterance error event:', e);
      if (!hasEnded) {
        hasEnded = true;
        if (e.error === 'canceled' || e.error === 'interrupted') {
          onEnd?.();
          return;
        }

        // If the browser blocks audio due to internal policy (e.g. 'not-allowed', 'audio-busy', 'language-unavailable', 'synthesis-failed', etc.)
        // Trigger immediate fallback to Google TTS audio stream
        console.info(`Triggering Google TTS fallback due to SpeechSynthesis error: ${e.error}`);
        playGoogleTTSFallback(cleanSpeech, selectedLang, onStartCallback, onEnd, onError);
      }
    };

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err: any) {
    console.warn('SpeechSynthesis exception, attempting Google TTS fallback:', err);
    playGoogleTTSFallback(cleanSpeech, selectedLang, onStartCallback, onEnd, onError);
  }
}
