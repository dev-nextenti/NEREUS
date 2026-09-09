export interface VoiceLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  speechLang: string; // BCP-47 tag for Web Speech API
  flag: string;
  region: string;
  sampleQueries: string[];
}

export const BUILTIN_LANGUAGES: VoiceLanguage[] = [
  {
    id: "en",
    code: "en",
    name: "English",
    nativeName: "English",
    speechLang: "en-IN",
    flag: "🇮🇳",
    region: "All Coasts & Maritime Ports",
    sampleQueries: [
      "Is it safe to venture into the sea tomorrow morning?",
      "Locate the nearest Potential Fishing Zone (PFZ) coordinates.",
      "Check cyclone and wave height warnings for the western coast.",
      "What is the sea surface temperature and wind speed right now?",
    ],
  },
  {
    id: "hi",
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechLang: "hi-IN",
    flag: "🇮🇳",
    region: "National / Western & Northern Coasts",
    sampleQueries: [
      "क्या कल सुबह मछली पकड़ने जाना सुरक्षित है?",
      "नजदीकी संभावित मत्स्य क्षेत्र (PFZ) कहां है?",
      "तटीय इलाकों में लहरों की ऊंचाई और हवा की गति क्या है?",
      "क्या किसी चक्रवात या तूफान की चेतावनी जारी की गई है?",
    ],
  },
  {
    id: "ta",
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechLang: "ta-IN",
    flag: "🇮🇳",
    region: "Coromandel Coast, Palk Strait, Gulf of Mannar",
    sampleQueries: [
      "நாளை காலை கடலுக்கு மீன்பிடிக்க செல்லலாமா?",
      "அருகிலுள்ள மீன்பிடி மண்டலம் (PFZ) எங்குள்ளது?",
      "பாக் ஜலசந்தியில் எல்லைப் பாதுகாப்பு எச்சரிக்கை உள்ளதா?",
      "அலைகளின் உயரம் மற்றும் காற்றின் வேகம் என்ன?",
    ],
  },
  {
    id: "te",
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechLang: "te-IN",
    flag: "🇮🇳",
    region: "Andhra Coast, Kakinada, Visakhapatnam",
    sampleQueries: [
      "రేపు ఉదయం వేటకు వెళ్లడం సురక్షితమేనా?",
      "సమీపంలో ఉన్న చేపల జోన్ (PFZ) ఎక్కడ ఉంది?",
      "సముద్రంలో అలల ఎత్తు మరియు తుఫాను హెచ్చరికలు ఉన్నాయా?",
      "కాకినాడ తీరంలో వాతావరణం ఎలా ఉంది?",
    ],
  },
  {
    id: "ml",
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechLang: "ml-IN",
    flag: "🇮🇳",
    region: "Malabar Coast, Kochi, Lakshadweep Sea",
    sampleQueries: [
      "നാളെ രാവിലെ കടലിൽ പോകുന്നത് സുരക്ഷിതമാണോ?",
      "ഏറ്റവും അടുത്തുള്ള മത്സ്യബന്ധന മേഖല (PFZ) എവിടെയാണ്?",
      "തീരദേശത്ത് ഉയർന്ന തിരമാല മുന്നറിയിപ്പുണ്ടോ?",
      "കാറ്റിന്റെ വേഗതയും മഴ സാധ്യതയും എത്രയാണ്?",
    ],
  },
  {
    id: "bn",
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechLang: "bn-IN",
    flag: "🇮🇳",
    region: "Bengal Coast, Sundarbans, Digha",
    sampleQueries: [
      "আগামীকাল সকালে সমুদ্রে মাছ ধরতে যাওয়া কি নিরাপদ?",
      "নিকটতম সম্ভাব্য মৎস্য অঞ্চল (PFZ) কোথায় অবস্থিত?",
      "বঙ্গোপসাগরে কি কোনো নিম্নচাপ বা ঘূর্ণিঝড়ের সতর্কতা আছে?",
      "দীঘা এবং সুন্দরবন উপকূলে আবহাওয়ার পূর্বাভাস কী?",
    ],
  },
  {
    id: "gu",
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechLang: "gu-IN",
    flag: "🇮🇳",
    region: "Gujarat Coast, Gulf of Kutch & Khambhat, Veraval",
    sampleQueries: [
      "શું કાલે સવારે દરિયામાં માછીમારી કરવા જવું સલામત છે?",
      "નજીકનો સંભવિત મત્સ્ય ઝોન (PFZ) ક્યાં આવેલો છે?",
      "વેરાવળ અને પોરબંદર દરિયાકિનારે પવનની ગતિ કેટલી છે?",
      "શું દરિયામાં કોઈ વાવાઝોડા કે ઊંચા મોજાંની ચેતવણી છે?",
    ],
  },
  {
    id: "mr",
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechLang: "mr-IN",
    flag: "🇮🇳",
    region: "Konkan Coast, Mumbai, Ratnagiri, Sindhudurg",
    sampleQueries: [
      "उद्या सकाळी समुद्रात मासेमारीसाठी जाणे सुरक्षित आहे का?",
      "जवळचे संभाव्य मासेमारी क्षेत्र (PFZ) कुठे आहे?",
      "कोकण किनारपट्टीवर लाटांची उंची व वाऱ्याचा वेग काय आहे?",
      "चक्रीवादळ किंवा वादळी वाऱ्याचा काही धोका आहे का?",
    ],
  },
  {
    id: "kn",
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechLang: "kn-IN",
    flag: "🇮🇳",
    region: "Canara Coast, Karwar, Mangaluru, Malpe",
    sampleQueries: [
      "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಸಮುದ್ರಕ್ಕೆ ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗುವುದು ಸುರಕ್ಷಿತವೇ?",
      "ಹತ್ತಿರದ ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕಾ ವಲಯ (PFZ) ಎಲ್ಲಿದೆ?",
      "ಮಂಗಳೂರು ಮತ್ತು ಮಾಲ್ಪೆ ಕರಾವಳಿಯಲ್ಲಿ ಅಲೆಗಳ ಎತ್ತರ ಎಷ್ಟಿದೆ?",
      "ಕರಾವಳಿ ತೀರದಲ್ಲಿ ಚಂಡಮಾರುತದ ಎಚ್ಚರಿಕೆ ಇದೆಯೇ?",
    ],
  },
  {
    id: "or",
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    speechLang: "or-IN",
    flag: "🇮🇳",
    region: "Odisha Coast, Paradip, Puri, Gopalpur",
    sampleQueries: [
      "ଆସନ୍ତାକାଲି ସକାଳେ ସମୁଦ୍ରକୁ ମାଛ ଧରିବାକୁ ଯିବା ନିରାପଦ କି?",
      "ନିକଟତମ ସମ୍ଭାବ୍ୟ ମତ୍ସ୍ୟ କ୍ଷେତ୍ର (PFZ) କେଉଁଠାରେ ଅଛି?",
      "ପାରାଦୀପ ଉପକୂଳରେ ଢେଉର ଉଚ୍ଚତା ଏବଂ ପବନର ବେଗ କେତେ?",
      "ବଙ୍ଗୋପସାଗରରେ କୌଣସି ଲଘୁଚାପ ବା ବାତ୍ୟା ସତର୍କତା ଅଛି କି?",
    ],
  },
];

export const AUTO_LANGUAGE: VoiceLanguage = {
  id: "auto",
  code: "auto",
  name: "Auto Detect",
  nativeName: "ಸ್ವಯಂ / தானியங்கி / സ്വയം",
  speechLang: "en-IN",
  flag: "🌐",
  region: "All Coasts (Auto Language & Script Classifier)",
  sampleQueries: [
    "Is it safe to fish tomorrow morning?",
    "நாளை காலை கடலுக்கு செல்லலாமா?",
    "कल मौसम कैसा रहेगा?",
    "തിരമാലകളുടെ ഉയരം എത്രയാണ്?",
    "రేపు వేటకు వెళ్లొచ్చా?",
  ],
};

export const getLanguageByCode = (code: string): VoiceLanguage => {
  if (code === "auto") return AUTO_LANGUAGE;
  const match = BUILTIN_LANGUAGES.find(
    (l) => l.code === code.toLowerCase() || l.id === code.toLowerCase()
  );
  return match || BUILTIN_LANGUAGES[0];
};

// Comprehensive lexical dictionaries for high-precision transliterated Indic language detection
const VOCAB_PATTERNS: Record<string, { high: string[]; mid: string[] }> = {
  ta: {
    high: [
      "eppadi", "irukku", "irukkiradhu", "irukirathu", "irukkuthu", "irukkum",
      "vanilai", "vaanilai", "kadal", "kadalooram", "kadaloora", "alai", "alaigal",
      "alavugal", "katru", "kaathu", "kaatru", "meen", "meenpidi", "meenavar",
      "meenavargal", "nalaikku", "naalai", "chellalama", "sellalama", "pogalama",
      "enna", "mudiyuma", "paathukaappu", "abayam", "echcharikkai", "puyal",
      "innikku", "inniku", "kaalai", "maalai", "sollunga", "parunga", "valaikuda", "kadalukku"
    ],
    mid: ["samudram", "illa", "illai", "ama", "aama", "venum", "koodathu", "aachu", "romba", "nalla"]
  },
  te: {
    high: [
      "ela undi", "vatavaranam", "vaatavaranam", "chepala veta", "chepalu", "chepala",
      "alalu", "gaalula", "toofanu", "tupanu", "tufanu", "vellavacha", "velloccha",
      "vellala", "cheppandi", "eeroju", "repati", "hecharika", "teeram", "padava"
    ],
    mid: [
      "ela", "samudram", "repu", "varsham", "bhadrata", "surakshitam",
      "ledu", "avunu", "kadu", "chala", "bavundi", "bagundi", "kavali", "undi", "vundi"
    ]
  },
  ml: {
    high: [
      "engane", "enganeyundu", "kaalavastha", "kalavastha", "kadal",
      "kadalil", "thiramala", "thiramaala", "kaattu", "kattu", "meen", "matsyam",
      "meenpidutham", "pokaamo", "pokamo", "pokan", "patto", "pattumo", "nale",
      "naale", "surakshitham", "munnariyippu", "chuzhalikkaattu", "mazha",
      "innum", "ravile", "vaikitt", "theeram", "vallam", "parayu", "ariyaamo"
    ],
    mid: ["samudram", "illa", "undu", "aano", "alla", "aanu", "valare", "nalla", "kooduthal"]
  },
  kn: {
    high: [
      "hege", "hegide", "havamana", "samudra", "alegalu", "alegal",
      "gaali", "meenu", "meenugarike", "naale", "surakshita", "eccharike",
      "chandamaruta", "karavali", "teera", "hogabahuda", "hogala", "male",
      "ivattu", "beligge", "sanje", "doni", "heli", "yavaga"
    ],
    mid: ["samudram", "ide", "illa", "houdu", "alla", "thumba", "bahala", "beku"]
  },
  gu: {
    high: [
      "kem", "kem chhe", "kevu", "kevu chhe", "havaaman", "daryo", "dariya",
      "mojan", "mojano", "pavan", "machhimar", "matsya", "kaale", "salaamat",
      "chetavni", "vavazodu", "kantho", "varsad", "aaje", "savare", "javay",
      "javanu", "bolone", "kaho"
    ],
    mid: ["chhe", "nathi", "ha", "na", "ghano", "saru", "ketlu"]
  },
  bn: {
    high: [
      "kemon", "kemon achhe", "kemon ache", "abohawa", "shomudro", "somudro",
      "dheu", "batas", "machh", "mach", "jawa jabe", "jaoa jabe",
      "shokal", "shokale", "nirapod", "shotorkota", "ghurnijhor", "brishti",
      "ekhon", "bolun", "upokul", "trawler"
    ],
    mid: ["achhe", "ache", "nei", "hobe", "khub", "bhalo"]
  },
  mr: {
    high: [
      "kasa", "kashi", "kase", "kasa ahe", "kashi ahe", "havaman", "samudra",
      "darya", "lata", "laata", "vara", "vaara", "mase", "masemari", "udya",
      "jaavu shakto", "jaave ka", "surakshit", "dhoka", "ishara", "vadal",
      "kinarpatti", "paus", "sakali", "sandhyakali", "sanga", "boti"
    ],
    mid: ["ahe", "aahe", "nahi", "naahi", "asel", "khup", "changla"]
  },
  or: {
    high: [
      "kemiti", "kemiti achhi", "kemiti achi", "panipaga", "samudra", "dheu",
      "pabana", "machha", "machhadhara", "kali", "nirapada", "satarkata",
      "batya", "upakula", "barsha", "aaji", "sakale", "kuhantu", "jaipariba"
    ],
    mid: ["achhi", "achi", "nahin", "heba", "bhala", "tike"]
  },
  hi: {
    high: [
      "kaisa", "kaise", "kaisi", "mausam", "samundar", "machli", "machhli",
      "toofan", "leher", "leherein", "lahar", "lahrein", "barish", "baarish",
      "surakshit", "khatra", "chetavni", "machuare", "machhuare", "hawa",
      "rahega", "rahegi", "sakta", "sakti", "sakte", "batao", "chahiye"
    ],
    mid: ["kya", "hai", "hain", "hoga", "hogi", "honge", "aaj", "kal", "subah", "shaam", "pani", "paani"]
  },
  en: {
    high: [
      "weather", "wave", "waves", "wind", "winds", "cyclone", "cyclones", "safe", "safety", "fishing",
      "fish", "fishes", "sea", "ocean", "port", "harbor", "temperature", "swell",
      "tomorrow", "today", "forecast", "tide", "tides", "height", "speed", "advisory",
      "warning", "vessel", "boat", "sail", "departure", "venture"
    ],
    mid: ["what", "how", "can", "is", "are", "the", "in", "to", "for", "me", "tell", "about", "give", "please"]
  }
};

/**
 * High-speed Unicode script & weighted lexical language classifier for Indian languages.
 */
export const detectLanguageFromText = (text: string): VoiceLanguage => {
  if (!text || !text.trim()) return AUTO_LANGUAGE;

  let devalCount = 0;
  let tamilCount = 0;
  let teluguCount = 0;
  let kannadaCount = 0;
  let malayalamCount = 0;
  let gujaratiCount = 0;
  let bengaliCount = 0;
  let odiaCount = 0;

  for (let i = 0; i < text.length; i++) {
    const cp = text.charCodeAt(i);
    if (cp >= 0x0900 && cp <= 0x097f) devalCount++;
    else if (cp >= 0x0b80 && cp <= 0x0bff) tamilCount++;
    else if (cp >= 0x0c00 && cp <= 0x0c7f) teluguCount++;
    else if (cp >= 0x0c80 && cp <= 0x0cff) kannadaCount++;
    else if (cp >= 0x0d00 && cp <= 0x0d7f) malayalamCount++;
    else if (cp >= 0x0a80 && cp <= 0x0aff) gujaratiCount++;
    else if (cp >= 0x0980 && cp <= 0x09ff) bengaliCount++;
    else if (cp >= 0x0b00 && cp <= 0x0b7f) odiaCount++;
  }

  // 1. Authoritative check for native non-Devanagari Indic scripts
  if (malayalamCount > 0) return getLanguageByCode("ml");
  if (tamilCount > 0) return getLanguageByCode("ta");
  if (teluguCount > 0) return getLanguageByCode("te");
  if (kannadaCount > 0) return getLanguageByCode("kn");
  if (gujaratiCount > 0) return getLanguageByCode("gu");
  if (bengaliCount > 0) return getLanguageByCode("bn");
  if (odiaCount > 0) return getLanguageByCode("or");

  // 2. Devanagari: accurately distinguish Marathi vs Hindi
  if (devalCount > 0) {
    const lower = text.toLowerCase();
    // Marathi specific characters (ळ: \u0933, ऱ: \u0931) or distinctive vocabulary
    if (/[\u0933\u0931]/.test(text)) return getLanguageByCode("mr");
    const marathiMarkers = [
      "आहे", "नाही", "काय", "कसा", "कशी", "कसे", "लाटा", "मासेमारी", "मासे",
      "किनारपट्टी", "धोक्याची", "चेतावणी", "उद्या", "वारा", "सांगा", "करू", "शकतो", "का", "वादळ"
    ];
    if (marathiMarkers.some((m) => lower.includes(m))) {
      return getLanguageByCode("mr");
    }
    return getLanguageByCode("hi");
  }

  // 3. Token-Based Weighted Scoring for Romanized / Transliterated text
  const lower = text.toLowerCase();
  const rawTokens = lower.match(/\b[a-z]{2,}\b/g) || [];
  const tokenSet = new Set(rawTokens);

  const scores: Record<string, number> = {};
  for (const code of Object.keys(VOCAB_PATTERNS)) {
    scores[code] = 0;
  }

  for (const [code, dicts] of Object.entries(VOCAB_PATTERNS)) {
    // High-confidence domain keywords
    for (const w of dicts.high) {
      if (w.includes(" ")) {
        if (lower.includes(w)) scores[code] += 15.0;
      } else {
        if (tokenSet.has(w)) scores[code] += 8.0;
      }
    }
    // Mid-confidence markers
    for (const w of dicts.mid) {
      if (tokenSet.has(w)) scores[code] += 2.0;
    }
  }

  // Find top score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topCode, topScore] = sorted[0];

  if (topScore >= 6.0) {
    return getLanguageByCode(topCode);
  }

  if (scores["en"] > 0) {
    return getLanguageByCode("en");
  }

  if (topScore > 0) {
    return getLanguageByCode(topCode);
  }

  return getLanguageByCode("en");
};
