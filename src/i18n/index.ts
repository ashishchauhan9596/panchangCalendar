import { useSettingsStore } from '../stores/settingsStore';
import { translatePanchang } from './translator';

// ─── English Dictionary ───────────────────────────────────────────────────────
const en = {
  ui: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    selected: 'Selected',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    rahuKaal: 'Rahu Kaal',
    abhijit: 'Abhijit Muhurat',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    paksha: 'Paksha',
    month: 'Month',
    year: 'Year',
    festivals: 'Festivals',
    fasting: 'Fasting',
    dayInfo: 'Day Information',
    lunarInfo: 'Lunar Information',
    importantTimings: 'Important Timings',
    vara: 'Vara',
    samvat: 'Samvat',
    elapsed: 'elapsed',
    activeTithi: 'Active Tithi',
    timeMachine: 'Time Machine',
    computing: 'Computing Panchang...',
    appTitle: 'Swarupa Panchang',
    monthAndYear: 'Month & Year',
    rahuKaalBeginsIn: 'Rahu Kaal begins in',
    rahuKaalEndsIn: 'Rahu Kaal ends in',
    abhijitBeginsIn: 'Abhijit begins in',
    abhijitEndsIn: 'Abhijit ends in',
    sunsetIn: 'Sunset in',
    sunriseIn: 'Sunrise in',
    nextEventToday: 'Next Event Today',
    noRemainingEvents: 'No remaining events today',
    day: 'Day',
    night: 'Night',
  },
  glossary: {
    tithi: {
      title: '🌙 Tithi (Lunar Day)',
      desc: 'A Tithi is a lunar day, defined by a 12-degree elongation difference between the Moon and the Sun. Unlike solar days, a Tithi can begin at any time and varies in duration (approx. 19–26 hours).',
    },
    nakshatra: {
      title: '⭐ Nakshatra (Star Constellation)',
      desc: "The ecliptic (Moon's orbit) is divided into 27 equal segments of 13°20' each. The Nakshatra of a day is determined by the constellation the Moon is currently traversing.",
    },
    yoga: {
      title: '☯️ Yoga (Solar-Lunar Alignment)',
      desc: "Yoga is computed by adding the sidereal longitudes of the Sun and Moon, divided into 27 equal divisions of 13°20' each. Each Yoga represents a specific energetic vibration for the day.",
    },
    karana: {
      title: '◐ Karana (Half Lunar Day)',
      desc: 'A Karana is half of a Tithi (spanning 6 degrees of Sun-Moon elongation). There are 60 Karanas in a lunar month — 7 repeating and 4 fixed ones.',
    },
    paksha: {
      title: '🌓 Paksha (Lunar Fortnight)',
      desc: 'Shukla Paksha is the waxing moon phase (bright fortnight), and Krishna Paksha is the waning moon phase (dark fortnight).',
    },
    rahuKaal: {
      title: '⚠️ Rahu Kaal (Inauspicious Period)',
      desc: 'An inauspicious daytime window of ~90 minutes, calculated by dividing the day into 8 equal parts and assigning one to Rahu based on the weekday. Traditionally avoided for starting new ventures.',
    },
    abhijit: {
      title: '☀️ Abhijit Muhurat (Auspicious Midday)',
      desc: 'An extremely auspicious ~48-minute window centred around solar noon. It can override negative planetary alignments, making it ideal for starting new tasks or travel (except on Wednesdays).',
    },
    vara: {
      title: '📅 Vara (Weekday)',
      desc: "The solar weekday, measured from local sunrise to the next day's sunrise. Each weekday has a ruling planetary deity that governs the nature of actions taken on that day.",
    },
  },
} as const;

// ─── Hindi Dictionary ─────────────────────────────────────────────────────────
const hi = {
  ui: {
    today: 'आज',
    tomorrow: 'कल',
    selected: 'चयनित',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    rahuKaal: 'राहु काल',
    abhijit: 'अभिजित मुहूर्त',
    tithi: 'तिथि',
    nakshatra: 'नक्षत्र',
    yoga: 'योग',
    karana: 'करण',
    paksha: 'पक्ष',
    month: 'मास',
    year: 'वर्ष',
    festivals: 'त्यौहार',
    fasting: 'उपवास',
    dayInfo: 'दिन की जानकारी',
    lunarInfo: 'चंद्र जानकारी',
    importantTimings: 'महत्वपूर्ण समय',
    vara: 'वार',
    samvat: 'संवत',
    elapsed: 'व्यतीत',
    activeTithi: 'सक्रिय तिथि',
    timeMachine: 'समय चक्र',
    computing: 'पंचांग की गणना की जा रही है...',
    appTitle: 'स्वरूप पंचांग',
    monthAndYear: 'मास और वर्ष',
    rahuKaalBeginsIn: 'राहु काल शुरू होगा',
    rahuKaalEndsIn: 'राहु काल समाप्त होगा',
    abhijitBeginsIn: 'अभिजित शुरू होगा',
    abhijitEndsIn: 'अभिजित समाप्त होगा',
    sunsetIn: 'सूर्यास्त होगा',
    sunriseIn: 'सूर्योदय होगा',
    nextEventToday: 'अगला योग/काल आज',
    noRemainingEvents: 'आज कोई और काल नहीं',
    day: 'दिन',
    night: 'रात्रि',
  },
  glossary: {
    tithi: {
      title: '🌙 तिथि (चंद्र दिवस)',
      desc: 'एक तिथि एक चंद्र दिवस है, जिसकी गणना सूर्य और चंद्रमा के बीच के अनुदैर्ध्य कोण को 12 डिग्री तक बढ़ने में लगने वाले समय से की जाती है।',
    },
    nakshatra: {
      title: '⭐ नक्षत्र (चंद्र घर)',
      desc: "नक्षत्र क्रांतिवृत्त के साथ एक क्षेत्र है। 27 नक्षत्र हैं, जिनमें से प्रत्येक चंद्रमा के पथ के एक खंड का प्रतिनिधित्व करता है।",
    },
    yoga: {
      title: '☯️ योग',
      desc: 'सूर्य और चंद्रमा के देशांतरों को जोड़कर और 13°20\' से विभाजित करके योग की गणना की जाती है। यह सूर्य और चंद्रमा के बीच के संबंध को दर्शाता है।',
    },
    karana: {
      title: '◐ करण',
      desc: 'करण एक तिथि का आधा हिस्सा है (अलगाव के 6 डिग्री)। 11 विभिन्न करण हैं।',
    },
    paksha: {
      title: '🌓 पक्ष (चंद्र पखवाड़ा)',
      desc: 'शुक्ल पक्ष बढ़ता हुआ चंद्र चरण है, और कृष्ण पक्ष घटता हुआ चंद्र चरण है।',
    },
    rahuKaal: {
      title: '⚠️ राहु काल',
      desc: 'दिन का एक अशुभ काल, राहु द्वारा शासित। नए, महत्वपूर्ण कार्यों को शुरू करने के लिए आमतौर पर इससे बचा जाता है।',
    },
    abhijit: {
      title: '☀️ अभिजित मुहूर्त',
      desc: 'दिन के मध्य में एक अत्यंत शुभ काल, जो कई दोषों को नष्ट करने में सक्षम है।',
    },
    vara: {
      title: '📅 वार (सप्ताह का दिन)',
      desc: 'सौर सप्ताह का दिन, जिसे पारंपरिक रूप से स्थानीय सूर्योदय से अगले दिन के सूर्योदय तक मापा जाता है। प्रत्येक दिन का एक शासक ग्रह देवता होता है।',
    },
  },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export const dictionaries = { en, hi };
export type LanguageCode = keyof typeof dictionaries;

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends string
          ? K
          : `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = DeepKeys<typeof en>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const language = useSettingsStore((state) => state.language) as LanguageCode;

  const t = (key: TranslationKey, fallback?: string): string => {
    const validLang = dictionaries[language] ? language : 'en';
    const dict = dictionaries[validLang];

    let result = getNestedValue(dict, key);

    // Fallback to English if translation is missing
    if (!result && validLang !== 'en') {
      result = getNestedValue(dictionaries.en, key);
    }

    return result || fallback || key;
  };

  const tVal = (value: string | undefined): string => {
    return translatePanchang(value, language);
  };

  return { t, tVal, language };
}
