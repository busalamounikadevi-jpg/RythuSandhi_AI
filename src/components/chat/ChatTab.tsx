import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Info,
  Layers,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Languages,
  ArrowRight,
  Building2,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ChatMessage, CropRequirement } from '../../types';
import { CROP_DATABASE, getCropRequirement } from '../../data/mockData';
import { CropRequirementCard } from './CropRequirementCard';
import { BuyerDemandSpecCard } from './BuyerDemandSpecCard';
import { 
  isSpeechRecognitionSupported, 
  isSpeechSynthesisSupported, 
  startSpeechRecognition, 
  stopActiveRecognition, 
  speakText, 
  stopSpeaking,
  cleanTextForTeluguTTS,
  cleanTextForHindiTTS,
  warmupSpeechVoices,
  onVoiceNotice
} from '../../utils/speech';

export interface ChatTabProps {
  messages: ChatMessage[];
  setMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSendMessage?: (text: string) => Promise<void> | void;
  buyerMatches?: any[];
  setBuyerMatches?: React.Dispatch<React.SetStateAction<any[]>>;
  activeLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onNavigateToMatrimony?: (cropFilter?: string) => void;
  onNavigateToSecurity?: () => void;
}

export const INITIAL_MESSAGES_EN: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'agent',
    text: 'Namaste! Welcome to RythuSandhi AI 🌾 — Your Pre-Harvest Buyer Connect & Advisory Partner. We help small farmers discover corporate buyers, verify quality specs, and secure harvest agreements before sowing.',
    timestamp: 'Just now'
  }
];

export const INITIAL_MESSAGES_TE: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'agent',
    text: 'నమస్తే! రైతుసంధి AI 🌾 కు స్వాగతం — మీ పంటకు ముందస్తు కొనుగోలుదారుల అనుసంధానం మరియు సాగు సలహా భాగస్వామి. చిన్న రైతులు విత్తే ముందే కార్పొరేట్ కొనుగోలుదారులను కనుగొనడంలో, నాణ్యతా ప్రమాణాలను నిర్ధారించడంలో మరియు పంట కొనుగోలు ఒప్పందాలను పొందడంలో మేము సహాయం చేస్తాము.',
    timestamp: 'ఇప్పుడే'
  }
];

export const INITIAL_MESSAGES_HI: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'agent',
    text: 'नमस्ते! रायथुसंधि AI 🌾 में आपका स्वागत है — आपका पूर्व-फसल खरीदार संपर्क एवं कृषि सलाहकार साथी। हम छोटे किसानों को बुवाई से पहले कॉर्पोरेट खरीदारों को खोजने, गुणवत्ता विनिर्देशों को सत्यापित करने और फसल खरीद समझौते सुरक्षित करने में मदद करते हैं।',
    timestamp: 'अभी'
  }
];

export const AudioWaveIndicator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-end gap-0.5 h-3.5 ${className}`}>
    <span className="w-0.5 bg-current rounded-full animate-bounce [animation-duration:0.6s] h-2" />
    <span className="w-0.5 bg-current rounded-full animate-bounce [animation-duration:0.4s] [animation-delay:0.15s] h-3.5" />
    <span className="w-0.5 bg-current rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:0.3s] h-2.5" />
    <span className="w-0.5 bg-current rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.1s] h-3" />
  </div>
);

interface QuickPrompt {
  id: string;
  role: 'farmer' | 'buyer' | 'all';
  icon: string;
  label: string;
  query: string;
}

const QUICK_PROMPTS_EN: QuickPrompt[] = [
  // Farmer Prompts
  { id: 'f-1', role: 'farmer', icon: '🌾', label: '3 Acres: Best Returns?', query: 'I have 3 acres of land, whats the best crop to grow where I get good returns' },
  { id: 'f-2', role: 'farmer', icon: '🌱', label: '1 Acre: Open Field or Indoor?', query: 'I have 1 acre of land. Can I grow open-field Aloe Vera or should I do indoor crops?' },
  { id: 'f-3', role: 'farmer', icon: '🍄', label: 'Mushrooms: Weekly Cash', query: 'How to grow mushrooms on vertical shelves for steady weekly household cash?' },
  { id: 'f-4', role: 'farmer', icon: '🥗', label: 'Microgreens Quick Cycle', query: 'What are microgreens and how do they give quick cash near the house?' },
  { id: 'f-5', role: 'farmer', icon: '🌸', label: 'Saffron Climate Setup', query: 'How can I grow Saffron in a small shaded room without using open field land?' },
  { id: 'f-6', role: 'farmer', icon: '🛡️', label: 'Protect From Advance Fraud', query: 'How can I protect myself from fake buyers asking for upfront registration fees?' },

  // Buyer Prompts
  { id: 'b-1', role: 'buyer', icon: '🏢', label: 'Source 10 Tonnes Aloe Vera', query: 'I need a farmer to source 10 tonnes of Aloe Vera under contract' },
  { id: 'b-2', role: 'buyer', icon: '🍄', label: 'Source Button Mushrooms (500kg/wk)', query: 'We are looking for verified farmers to supply 500 kg fresh button mushrooms weekly' },
  { id: 'b-3', role: 'buyer', icon: '🥗', label: 'Source Daily Microgreens for Hotels', query: 'Procuring gourmet microgreens for luxury restaurants in Hyderabad' },
  { id: 'b-4', role: 'buyer', icon: '📋', label: 'Post Procurement Request', query: 'How can I post a buyer demand and connect with verified farmer FPOs?' }
];

const QUICK_PROMPTS_TE: QuickPrompt[] = [
  // Farmer Prompts
  { id: 'f-1', role: 'farmer', icon: '🌾', label: '3 ఎకరాలు: ఎక్కువ రాబడి?', query: 'నాకు 3 ఎకరాల పొలం ఉంది, మంచి రాబడి వచ్చే పంట ఏది?' },
  { id: 'f-2', role: 'farmer', icon: '🌱', label: '1 ఎకరం: ఏ పంట వేయాలి?', query: 'నాకు 1 ఎకరం భూమి ఉంది, అలోవెరా వేయవచ్చా లేదా గది పంటలు మేలా?' },
  { id: 'f-3', role: 'farmer', icon: '🍄', label: 'పుట్టగొడుగులు: వారపు ఆదాయం', query: 'గదిలో నిలువు అరలపై పుట్టగొడుగులను ఎలా సాగు చేసి వారపు ఆదాయం పొందాలి?' },
  { id: 'f-4', role: 'farmer', icon: '🥗', label: 'మైక్రోగ్రీన్స్ త్వరిత రాబడి', query: 'మైక్రోగ్రీన్స్ సాగుతో ఇంటి దగ్గరే తక్కువ రోజుల్లో రాబడి ఎలా వస్తుంది?' },
  { id: 'f-5', role: 'farmer', icon: '🌸', label: 'గదిలో కుంకుమపువ్వు', query: 'చిన్న గదిలో కుంకుమపువ్వు (కేసర్) సాగు చేయడానికి ఏర్పాట్లు ఏమిటి?' },
  { id: 'f-6', role: 'farmer', icon: '🛡️', label: 'అడ్వాన్స్ మోసాల నుండి రక్షణ', query: 'రిజిస్ట్రేషన్ ఫీజుల పేరిట జరిగే మోసాల నుండి నన్ను నేను ఎలా రక్షించుకోవాలి?' },

  // Buyer Prompts
  { id: 'b-1', role: 'buyer', icon: '🏢', label: '10 టన్నుల అలోవెరా కావాలి', query: 'మా కంపెనీకి కాంట్రాక్ట్ కింద 10 టన్నుల తాజా అలోవెరా కావాలి, రైతులు కావాలి' },
  { id: 'b-2', role: 'buyer', icon: '🍄', label: 'వారం 500 కిలోల పుట్టగొడుగులు', query: 'వారానికి 500 కిలోల తాజా బటన్ పుట్టగొడుగులను సరఫరా చేయగల రైతులు కావాలి' },
  { id: 'b-3', role: 'buyer', icon: '🥗', label: 'హోటళ్లకు మైక్రోగ్రీన్స్ కొనుగోలు', query: 'హైదరాబాద్ మరియు విజయవాడ రెస్టారెంట్ల కోసం మైక్రోగ్రీన్స్ రైతులను కోరుతున్నాము' },
  { id: 'b-4', role: 'buyer', icon: '📋', label: 'కొత్త కొనుగోలు డిమాండ్ నమోదు', query: 'కొనుగోలుదారుగా నేను నా కొనుగోలు డిమాండ్‌ను ఎలా నమోదు చేయాలి?' }
];

const QUICK_PROMPTS_HI: QuickPrompt[] = [
  // Farmer Prompts
  { id: 'f-1', role: 'farmer', icon: '🌾', label: '3 एकड़: सबसे ज्यादा कमाई?', query: 'मेरे पास 3 एकड़ जमीन है, अच्छी कमाई के लिए कौन सी फसल लगानी चाहिए?' },
  { id: 'f-2', role: 'farmer', icon: '🌱', label: '1 एकड़: कौन सी फसल चुनें?', query: 'मेरे पास 1 एकड़ जमीन है, क्या मैं एलोवेरा लगाऊँ या कमरे वाली फसलें?' },
  { id: 'f-3', role: 'farmer', icon: '🍄', label: 'मशरूम: हर हफ्ते आय', query: 'कमरे में वर्टिकल रैक पर मशरूम की खेती करके हर हफ्ते आय कैसे प्राप्त करें?' },
  { id: 'f-4', role: 'farmer', icon: '🥗', label: 'माइक्रोग्रीन्स कम समय में', query: 'माइक्रोग्रीन्स से घर के पास जल्दी और नियमित नकद कैसे कमाएं?' },
  { id: 'f-5', role: 'farmer', icon: '🌸', label: 'कमरे में केसर (जाफरान)', query: 'छोटे ठंडे कमरे में केसर की खेती के लिए क्या सेटअप चाहिए?' },
  { id: 'f-6', role: 'farmer', icon: '🛡️', label: 'एडवांस फ्रॉड से सुरक्षा', query: 'रजिस्ट्रेशन फीस मांगने वाले फर्जी खरीदारों से कैसे बचें?' },

  // Buyer Prompts
  { id: 'b-1', role: 'buyer', icon: '🏢', label: '10 टन एलोवेरा खरीदनी है', query: 'मुझे अनुबंध पर 10 टन ताजा एलोवेरा खरीदने के लिए सत्यापित किसान चाहिए' },
  { id: 'b-2', role: 'buyer', icon: '🍄', label: 'प्रति सप्ताह 500 किग्रा मशरूम', query: 'हमें हर हफ्ते 500 किग्रा ताजा बटन मशरूम की नियमित आपूर्ति चाहिए' },
  { id: 'b-3', role: 'buyer', icon: '🥗', label: 'होटलों के लिए माइक्रोग्रीन्स', query: 'रेस्टोरेंट और होटलों के लिए माइक्रोग्रीन्स उत्पादक किसानों से जुड़ना चाहते हैं' },
  { id: 'b-4', role: 'buyer', icon: '📋', label: 'खरीद मांग दर्ज करें', query: 'एक खरीदार के रूप में मैं अपनी मांग कैसे दर्ज करूँ और किसानों से जुडूँ?' }
];

function playAlertChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_e) {
    // audio context may be restricted
  }
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  setMessages, 
  onSendMessage,
  buyerMatches: buyerMatchesProp,
  setBuyerMatches: setBuyerMatchesProp,
  activeLanguage, 
  onChangeLanguage, 
  onNavigateToMatrimony, 
  onNavigateToSecurity 
}) => {
  const isTelugu = activeLanguage === 'te';
  const isHindi = activeLanguage === 'hi';
  const [inputText, setInputText] = useState('');
  const [buyerMatches, setBuyerMatches] = useState<any[]>(buyerMatchesProp || []);

  useEffect(() => {
    if (buyerMatchesProp) {
      setBuyerMatches(buyerMatchesProp);
    }
  }, [buyerMatchesProp]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTranscript, setRecordingTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedBuyerMessages, setExpandedBuyerMessages] = useState<Record<string, boolean>>({});
  const [expandedCitationMessages, setExpandedCitationMessages] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionControllerRef = useRef<{ stop: () => void } | null>(null);
  const activeAudioPlaybackRef = useRef<{ isPlaying: boolean; messageId: string | null }>({ isPlaying: false, messageId: null });

  const sttSupported = isSpeechRecognitionSupported();
  const ttsSupported = isSpeechSynthesisSupported() || (typeof window !== 'undefined' && typeof Audio !== 'undefined');

  /**
   * Unified stopAllAudio function:
   * Cancels native browser speech synthesis, pauses and resets any active HTML5 audio element,
   * resumes paused audio contexts, and clears tracking refs.
   */
  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        // ignore
      }
    }
    stopSpeaking();
    activeAudioPlaybackRef.current = { isPlaying: false, messageId: null };
    setSpeakingMessageId(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  useEffect(() => {
    // When language changes, cancel active recognition and speech queues immediately
    stopAllAudio();
    stopActiveRecognition();
    setIsRecording(false);
    setSpeechError(null);
  }, [activeLanguage]);

  useEffect(() => {
    // Warm up speech synthesis voices on component mount
    warmupSpeechVoices();

    // Subscribe to voice fallback notifications (e.g. missing Telugu voice pack)
    const unsubscribeNotice = onVoiceNotice((notice) => {
      setVoiceNotice(notice);
      const timer = setTimeout(() => {
        setVoiceNotice((curr) => (curr === notice ? null : curr));
      }, 8000);
      return () => clearTimeout(timer);
    });

    return () => {
      unsubscribeNotice();
      stopActiveRecognition();
      stopAllAudio();
    };
  }, []);

  const handleToggleVoiceRecording = () => {
    setSpeechError(null);

    if (isRecording) {
      if (recognitionControllerRef.current) {
        recognitionControllerRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!sttSupported) {
      setSpeechError(
        isTelugu 
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.' 
          : isHindi 
            ? 'इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। कृपया टाइप करें।'
            : 'Speech recognition is not supported in this browser. Please type your query.'
      );
      return;
    }

    setRecordingTranscript('');
    setIsRecording(true);

    const speechLang = isTelugu ? 'te-IN' : (isHindi ? 'hi-IN' : 'en-US');

    const controller = startSpeechRecognition(
      (result) => {
        setRecordingTranscript(result.transcript);
        if (result.isFinal) {
          setInputText(result.transcript);
          setIsRecording(false);
          // Auto send spoken query
          setTimeout(() => {
            handleSendMessage(result.transcript);
          }, 300);
        }
      },
      (err) => {
        setSpeechError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      },
      speechLang
    );

    recognitionControllerRef.current = controller;
  };

  /**
   * Explicit localized welcome notes for all 3 supported languages
   */
  const getLocalizedWelcomeNote = (): string => {
    if (activeLanguage === 'te') {
      return 'నమస్తే! రైతుసంధి AI 🌾 కు స్వాగతం — మీ పంటకు ముందస్తు కొనుగోలుదారుల అనుసంధానం మరియు సాగు సలహా భాగస్వామి. చిన్న రైతులు విత్తే ముందే కార్పొరేట్ కొనుగోలుదారులను కనుగొనడంలో, నాణ్యతా ప్రమాణాలను నిర్ధారించడంలో మరియు పంట కొనుగోలు ఒప్పందాలను పొందడంలో మేము సహాయం చేస్తాము.';
    }
    if (activeLanguage === 'hi') {
      return 'नमस्ते! रायथुसंधि AI 🌾 में आपका स्वागत है — आपका पूर्व-फसल खरीदार संपर्क एवं कृषि सलाहकार साथी। हम छोटे किसानों को बुवाई से पहले कॉर्पोरेट खरीदारों को खोजने, गुणवत्ता विनिर्देशों को सत्यापित करने और फसल खरीद समझौते सुरक्षित करने में मदद करते हैं।';
    }
    return 'Namaste! Welcome to RythuSandhi AI 🌾 — Your Pre-Harvest Buyer Connect & Advisory Partner. We help small farmers discover corporate buyers, verify quality specs, and secure harvest agreements before sowing.';
  };

  /**
   * Speak dynamically provided text with real-time UI state toggle
   * Supports Telugu ('te'), Hindi ('hi'), and English ('en') voice synthesis
   */
  const handleSpeakMessage = (messageId: string, textToSpeak?: string) => {
    // If currently speaking this specific message, stop all audio
    if (activeAudioPlaybackRef.current.isPlaying && activeAudioPlaybackRef.current.messageId === messageId) {
      stopAllAudio();
      return;
    }

    // Stop and cancel all ongoing native speech and HTML5 audio before playing new content
    stopAllAudio();

    // Explicitly unlock browser audio context on user interaction
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        // ignore
      }
    }

    activeAudioPlaybackRef.current = { isPlaying: true, messageId };
    setSpeakingMessageId(messageId);

    // Extract exact message string or default welcome string
    const fallbackDefault = getLocalizedWelcomeNote();
    const rawText = (typeof textToSpeak === 'string' && textToSpeak.trim().length > 0) 
      ? textToSpeak.trim() 
      : fallbackDefault;

    // Detect language code
    const currentLang = activeLanguage === 'te' ? 'te-IN' : (activeLanguage === 'hi' ? 'hi-IN' : 'en-US');
    let voiceLang = currentLang;
    if (/[\u0C00-\u0C7F]/.test(rawText)) {
      voiceLang = 'te-IN';
    } else if (/[\u0900-\u097F]/.test(rawText)) {
      voiceLang = 'hi-IN';
    }

    // Execute cleanup before speaking (converting numerals and language formatting)
    const isTeluguText = voiceLang.startsWith('te') || /[\u0C00-\u0C7F]/.test(rawText);
    const isHindiText = voiceLang.startsWith('hi') || /[\u0900-\u097F]/.test(rawText);
    const cleanedText = isTeluguText 
      ? cleanTextForTeluguTTS(rawText) 
      : (isHindiText ? cleanTextForHindiTTS(rawText) : rawText);

    speakText(
      cleanedText,
      () => {
        activeAudioPlaybackRef.current = { isPlaying: true, messageId };
        setSpeakingMessageId(messageId);
      },
      () => {
        if (activeAudioPlaybackRef.current.messageId === messageId) {
          activeAudioPlaybackRef.current = { isPlaying: false, messageId: null };
          setSpeakingMessageId(null);
        }
      },
      (err) => {
        console.warn('TTS playback error:', err);
        if (activeAudioPlaybackRef.current.messageId === messageId) {
          activeAudioPlaybackRef.current = { isPlaying: false, messageId: null };
          setSpeakingMessageId(null);
        }
      },
      voiceLang
    );
  };

  // Helper to dynamically detect user message language
  const detectMessageLanguage = (text: string, currentActiveLang: string): 'te' | 'hi' | 'en' => {
    const devanagariRegex = /[\u0900-\u097F]/;
    const teluguRegex = /[\u0C00-\u0C7F]/;

    if (devanagariRegex.test(text)) {
      return 'hi';
    }
    if (teluguRegex.test(text)) {
      return 'te';
    }

    const lower = text.toLowerCase();
    
    // Hindi agricultural keywords or transliterated Hindi terms
    const hindiKeywords = [
      'namaste', 'namaskar', 'kisan', 'kisaan', 'kheti', 'zameen', 'zamin', 'kharidar', 
      'khareedar', 'fasal', 'ekad', 'kamai', 'bechna', 'aamdani', 'kharidna', 'khareedna', 
      'mushrooms', 'kesar', 'jafran', 'aloevera', 'ghritkumari', 'kamra', 'daam', 'bhav', 
      'kharid', 'khareed', 'crop', 'fasal'
    ];
    
    // Telugu keywords
    const teluguKeywords = [
      'namaskaram', 'raithu', 'rythu', 'polam', 'ekaram', 'ekaraalu', 'saagu', 'panta', 
      'kalabanda', 'puttagodugulu', 'aadayam', 'labham', 'konugolu', 'ammadam'
    ];

    if (teluguKeywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(lower))) {
      return 'te';
    }
    if (hindiKeywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(lower))) {
      return 'hi';
    }

    if (currentActiveLang === 'hi') return 'hi';
    if (currentActiveLang === 'te') return 'te';
    return 'en';
  };



  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    setInputText('');
    setRecordingTranscript('');

    if (onSendMessage) {
      await onSendMessage(text);
      return;
    }

    // 1. Instantly append the user's message to the chat message history state
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (setMessages) {
      setMessages(prev => [...prev, userMessage]);
    }
    setIsTyping(true);

    // 2. Make an asynchronous POST fetch request to the server agronomist API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text,
          message: text,
          history: messages ? [...messages, userMessage] : [userMessage],
          farmerId: 'farmer_001',
          language: activeLanguage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 3. Update the chat message state with the backend's "answer"
      // and update the buyer card/carousel state with the returned "buyerMatches" array.
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.answer || data.reply || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        buyerMatches: data.buyerMatches || [],
        fpoMessage: data.fpoMessage,
        citations: data.citations
      };

      if (setMessages) {
        setMessages(prev => [...prev, botMessage]);
      }

      if (data.buyerMatches && Array.isArray(data.buyerMatches)) {
        setBuyerMatches(data.buyerMatches);
        if (setBuyerMatchesProp) {
          setBuyerMatchesProp(data.buyerMatches);
        }
        if (data.buyerMatches.length > 0) {
          playAlertChime();
        }
      } else {
        setBuyerMatches([]);
        if (setBuyerMatchesProp) {
          setBuyerMatchesProp([]);
        }
      }
    } catch (error) {
      // 4. If the fetch fails (or the backend is offline), catch the error, log it,
      // and append a friendly fallback message referencing the Cloud Run endpoint.
      console.error('Error connecting to backend API:', error);

      const fallbackMessage: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: 'Unable to connect to the agricultural advisory server (https://rythusetu-api-1041209551164.us-central1.run.app/). Please ensure the API is active and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (setMessages) {
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    stopActiveRecognition();
    setSpeakingMessageId(null);
    if (setMessages) {
      if (isTelugu) {
        setMessages(INITIAL_MESSAGES_TE);
      } else if (isHindi) {
        setMessages(INITIAL_MESSAGES_HI);
      } else {
        setMessages(INITIAL_MESSAGES_EN);
      }
    }
  };

  const [quickPromptRole, setQuickPromptRole] = useState<'all' | 'farmer' | 'buyer'>('all');

  const allPrompts = isTelugu 
    ? QUICK_PROMPTS_TE 
    : (isHindi ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN);

  const activeSuggested = quickPromptRole === 'all'
    ? allPrompts
    : allPrompts.filter((p) => p.role === quickPromptRole);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Main Messages List */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5">
        {messages.map((message) => {
          const isUser = message.sender === 'user';
          const isSpeakingThis = speakingMessageId === message.id;

          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Sender Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-slate-700 text-white'
                    : 'bg-emerald-800 text-emerald-100 ring-2 ring-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                
                {/* Bubble Body */}
                <div
                  className={`rounded-2xl p-3 sm:p-3.5 shadow-2xs text-xs sm:text-[13px] leading-relaxed relative group ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  {/* Text Content */}
                  <div className="whitespace-pre-line font-normal">
                    {message.text}
                  </div>

                  {/* Message Bottom Action Bar */}
                  <div className={`mt-2 pt-1.5 flex items-center justify-between border-t gap-2 text-[10px] ${
                    isUser ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>{message.timestamp}</span>

                    {/* DYNAMIC TEXT-TO-SPEECH VOLUME BUTTON:
                        Passes message text directly to handleSpeakMessage() without resolving to 'HI' */}
                    {ttsSupported && (
                      <button
                        type="button"
                        onClick={() => {
                          const messageText = message.text || (message as any).content || (isTelugu ? "రైతు సోదరులకు నమస్కారం! రైతుసేతు AI కి స్వాగతం." : getLocalizedWelcomeNote());
                          handleSpeakMessage(message.id, messageText);
                        }}
                        title={isSpeakingThis ? 'Stop Audio' : 'Listen to this message'}
                        className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
                          isSpeakingThis
                            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                            : isUser
                              ? 'hover:bg-slate-800 text-slate-300'
                              : 'hover:bg-slate-100 text-emerald-800 font-semibold'
                        }`}
                      >
                        {isSpeakingThis ? (
                          <>
                            <AudioWaveIndicator className="text-amber-800 mr-0.5" />
                            <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                            <span>{isTelugu ? 'ఆపండి' : (isHindi ? 'रोकें' : 'Stop')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isTelugu ? 'వినండి' : (isHindi ? 'सुनें' : 'Listen')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-Card: Crop Requirement Card if matched */}
                {message.cropRequirement && !isUser && (
                  <div className="w-full">
                    <CropRequirementCard
                      crop={message.cropRequirement}
                      onExploreMatch={(cropName) => onNavigateToMatrimony?.(cropName)}
                    />
                  </div>
                )}

                {/* Sub-Card: Buyer Demand Spec Form Card if buyer intent triggered */}
                {message.isBuyerIntent && !isUser && (
                  <div className="w-full">
                    <BuyerDemandSpecCard onNavigateToMatrimony={onNavigateToMatrimony} />
                  </div>
                )}

                {/* Sub-Card: On-Demand Matching Corporate Buyers (Collapsed by default for a clean, clear chat) */}
                {message.buyerMatches && message.buyerMatches.length > 0 && !isUser && (
                  <div className="w-full mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedBuyerMessages(prev => ({
                          ...prev,
                          [message.id]: !prev[message.id]
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-850 text-[11px] font-semibold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        {expandedBuyerMessages[message.id] 
                          ? (isTelugu ? 'కొనుగోలుదారులను దాచండి' : (isHindi ? 'खरीदार विवरण छुपाएं' : 'Hide Matching Buyers'))
                          : (isTelugu ? `సరిపోలే వ్యాపార సంస్థలను చూడండి (${message.buyerMatches.length})` : (isHindi ? `संबंधित खरीदार देखें (${message.buyerMatches.length})` : `Show Matching Corporate Buyers (${message.buyerMatches.length})`))}
                      </span>
                      {expandedBuyerMessages[message.id] ? (
                        <ChevronUp className="w-3 h-3 text-emerald-600 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-emerald-600 ml-0.5" />
                      )}
                    </button>

                    {expandedBuyerMessages[message.id] && (
                      <div className="mt-2 space-y-2">
                        {message.buyerMatches.map((bm: any, idx: number) => (
                          <div key={idx} className="bg-white/95 border border-emerald-300/80 shadow-2xs rounded-xl p-2.5 text-xs">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-emerald-950">{bm.buyerName}</span>
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-850 px-1.5 py-0.5 rounded shrink-0">
                                {bm.offeredPrice}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1">
                              📍 {bm.location} • 📦 {bm.quantity}
                            </div>
                            {bm.qualityGrade && (
                              <div className="text-[10px] text-emerald-700 mt-0.5 font-medium flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                                <span>{bm.qualityGrade}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => onNavigateToMatrimony?.(bm.crop || 'Aloe Vera')}
                              className="mt-2 w-full py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                            >
                              <span>{isTelugu ? 'బయ్యర్‌తో సంప్రదించండి' : (isHindi ? 'खरीदार से संपर्क करें' : 'Connect with Buyer')}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Card: Render FPO Aggregation Notice if present and expanded */}
                {message.fpoMessage && !isUser && (
                  <div className="w-full mt-2 bg-amber-50/90 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-950 shadow-2xs">
                    <div className="font-bold flex items-center gap-1 text-amber-950 mb-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{isTelugu ? 'క్లస్టర్ అగ్రిగేషన్ సలహా' : 'Cluster Aggregation Advisory'}</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      {message.fpoMessage}
                    </p>
                  </div>
                )}

                {/* Sub-Card: On-Demand Verified Citations (Collapsed by default for a clean, clear chat) */}
                {message.citations && message.citations.length > 0 && !isUser && (
                  <div className="w-full mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedCitationMessages(prev => ({
                          ...prev,
                          [message.id]: !prev[message.id]
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>
                        {expandedCitationMessages[message.id]
                          ? (isTelugu ? 'ఆధారాలను దాచండి' : (isHindi ? 'स्रोत छुपाएं' : 'Hide Agronomic Sources'))
                          : (isTelugu ? 'ప్రామాణిక ఆధారాలు చూడండి' : (isHindi ? 'प्रमाणित स्रोत देखें' : 'View Verified Agronomic Sources'))}
                      </span>
                      {expandedCitationMessages[message.id] ? (
                        <ChevronUp className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                      ) : (
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                      )}
                    </button>

                    {expandedCitationMessages[message.id] && (
                      <div className="mt-1 px-2.5 py-2 text-[10px] text-slate-600 space-y-1 bg-slate-100/80 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                          <span>{isTelugu ? 'ప్రామాణిక వ్యవసాయ వనరులు:' : 'Verified Agronomic Sources:'}</span>
                        </div>
                        {message.citations.map((c: any, idx: number) => (
                          <div key={idx} className="text-slate-600 pl-1">
                            • <strong className="text-slate-800">{c.source}:</strong> {c.topic}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-9">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-slate-500 font-medium ml-1">
              {isTelugu ? 'సమాధానం సిద్ధం చేస్తోంది...' : (isHindi ? 'रायथुसंधि AI जवाब तैयार कर रहा है...' : 'RythuSandhi AI is analyzing...')}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Active Audio Playback Notification Toast / Status Wave Indicator */}
      {speakingMessageId && (
        <div className="bg-amber-50 border-t border-b border-amber-200 px-3.5 py-2 text-xs text-amber-900 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-900 shrink-0">
              <AudioWaveIndicator className="text-amber-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-amber-950 text-xs">
                {isTelugu ? 'ఆడియో ప్లే అవుతోంది...' : (isHindi ? 'ऑडियो चल रहा है...' : 'Audio playing...')}
              </span>
              <span className="text-[10px] text-amber-800">
                {isTelugu ? 'సందేశాన్ని వాయిస్ ద్వారా చదువుతోంది' : (isHindi ? 'आवाज में संदेश सुनाया जा रहा है' : 'Reading out message audio')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={stopAllAudio}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors border border-amber-300 shadow-2xs"
          >
            <VolumeX className="w-3.5 h-3.5 text-amber-900" />
            <span>{isTelugu ? 'ఆపండి' : (isHindi ? 'रोकें' : 'Stop Audio')}</span>
          </button>
        </div>
      )}

      {/* Speech Error Banner if any */}
      {speechError && (
        <div className="bg-rose-50 border-t border-rose-200 px-3 py-1.5 text-[11px] text-rose-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5">
            <span>⚠️</span>
            <span>{speechError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSpeechError(null)}
            className="text-rose-600 font-bold hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Voice Fallback Notice / Tip Banner (e.g. Telugu voice pack missing on device) */}
      {voiceNotice && (
        <div className="bg-amber-100 border-t border-b border-amber-300 px-3.5 py-2 text-xs text-amber-950 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-start space-x-2 mr-2">
            <span className="text-[11px] font-medium leading-relaxed">
              {voiceNotice}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceNotice(null)}
            className="text-amber-900 font-bold hover:text-black px-1.5 py-0.5 rounded text-xs shrink-0"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1-Tap Quick Action Prompts with Role Toggle (Farmer / Buyer / All) */}
      <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>
              {isTelugu ? '1-ట్యాప్ ప్రశ్నలు' : (isHindi ? '1-टैप त्वरित प्रश्न' : '1-Tap Quick Actions')}
            </span>
          </div>

          {/* Quick Role Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
            <button
              type="button"
              onClick={() => setQuickPromptRole('all')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                quickPromptRole === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isTelugu ? 'అన్నీ' : (isHindi ? 'सभी' : 'All')}
            </button>
            <button
              type="button"
              onClick={() => setQuickPromptRole('farmer')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center space-x-0.5 ${
                quickPromptRole === 'farmer'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              <span>🌾</span>
              <span>{isTelugu ? 'రైతు' : (isHindi ? 'किसान' : 'Farmer')}</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickPromptRole('buyer')}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center space-x-0.5 ${
                quickPromptRole === 'buyer'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <span>🏢</span>
              <span>{isTelugu ? 'బయ్యర్' : (isHindi ? 'क्रेता' : 'Buyer')}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {activeSuggested.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSendMessage(item.query)}
              className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                item.role === 'buyer'
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : 'bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border-slate-200 text-slate-700 hover:text-emerald-900'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Message Input Bar with Microphone and Send Button */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Speech-to-Text Button */}
          <button
            type="button"
            onClick={handleToggleVoiceRecording}
            title={isRecording ? (isTelugu ? 'రికార్డింగ్ ఆపండి' : (isHindi ? 'रिकॉर्डिंग रोकें' : 'Stop Recording')) : (isTelugu ? 'మాట్లాడండి' : (isHindi ? 'बोलकर पूछें' : 'Speak your query'))}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isRecording 
                  ? (recordingTranscript || (isTelugu ? 'వినబడుతోంది... మాట్లాడండి' : (isHindi ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now')))
                  : (isTelugu ? 'మీ ప్రశ్నను ఇక్కడ అడగండి (ఉదా: 3 ఎకరాలకు ఏ పంట మంచిది?)...' : (isHindi ? 'यहाँ अपना प्रश्न पूछें (उदा: 3 एकड़ के लिए कौन सी फसल बेहतर है?)...' : 'Ask anything (e.g., I have 3 acres, what is the best crop?)...'))
              }
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border font-medium focus:outline-none transition-colors ${
                isRecording
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900'
                  : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-emerald-700 text-slate-900'
              }`}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !isRecording}
            className="p-2.5 bg-emerald-900 hover:bg-emerald-950 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-xs shrink-0 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
