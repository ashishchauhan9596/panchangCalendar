/**
 * Helper to translate dynamic Panchang calculations, month names, and festival titles to Hindi.
 */

export function translatePanchang(text: string | undefined, lang: 'en' | 'hi'): string {
  if (!text) return '';
  if (lang === 'en') return text;

  let result = text;

  // 1. Replace Paksha names
  result = result.replace(/\bShukla\b/g, 'शुक्ल');
  result = result.replace(/\bKrishna\b/g, 'कृष्ण');

  // 2. Replace Tithi Names
  result = result.replace(/\bPratipada\b/g, 'प्रतिपदा');
  result = result.replace(/\bDwitiya\b/g, 'द्वितीया');
  result = result.replace(/\bTritiya\b/g, 'तृतीया');
  result = result.replace(/\bChaturthi\b/g, 'चतुर्थी');
  result = result.replace(/\bPanchami\b/g, 'पंचमी');
  result = result.replace(/\bShashthi\b/g, 'षष्ठी');
  result = result.replace(/\bSaptami\b/g, 'सप्तमी');
  result = result.replace(/\bAshtami\b/g, 'अष्टमी');
  result = result.replace(/\bNavami\b/g, 'नवमी');
  result = result.replace(/\bDashami\b/g, 'दशमी');
  result = result.replace(/\bEkadashi\b/g, 'एकादशी');
  result = result.replace(/\bDwadashi\b/g, 'द्वादशी');
  result = result.replace(/\bTrayodashi\b/g, 'त्रयोदशी');
  result = result.replace(/\bChaturdashi\b/g, 'चतुर्दशी');
  result = result.replace(/\bPurnima\b/g, 'पूर्णिमा');
  result = result.replace(/\bAmavasya\b/g, 'अमावस्या');

  // 3. Replace Nakshatra Names
  result = result.replace(/\bAshwini\b/g, 'अश्विनी');
  result = result.replace(/\bBharani\b/g, 'भरणी');
  result = result.replace(/\bKrittika\b/g, 'कृत्तिका');
  result = result.replace(/\bRohini\b/g, 'रोहिणी');
  result = result.replace(/\bMrigashira\b/g, 'मृगशिरा');
  result = result.replace(/\bArdra\b/g, 'आर्द्रा');
  result = result.replace(/\bPunarvasu\b/g, 'पुनर्वसु');
  result = result.replace(/\bPushya\b/g, 'पुष्य');
  result = result.replace(/\bAshlesha\b/g, 'आश्लेषा');
  result = result.replace(/\bMagha\b/g, 'मघा');
  result = result.replace(/\bPurva Phalguni\b/g, 'पूर्वाफाल्गुनी');
  result = result.replace(/\bUttara Phalguni\b/g, 'उत्तराफाल्गुनी');
  result = result.replace(/\bHasta\b/g, 'हस्त');
  result = result.replace(/\bChitra\b/g, 'चित्रा');
  result = result.replace(/\bSwati\b/g, 'स्वाति');
  result = result.replace(/\bVishakha\b/g, 'विशाखा');
  result = result.replace(/\bAnuradha\b/g, 'अनुराधा');
  result = result.replace(/\bJyeshtha\b/g, 'ज्येष्ठा');
  result = result.replace(/\bMoola\b/g, 'मूल');
  result = result.replace(/\bPurva Ashadha\b/g, 'पूर्वाषाढ़ा');
  result = result.replace(/\bUttara Ashadha\b/g, 'उत्तराषाढ़ा');
  result = result.replace(/\bShravana\b/g, 'श्रवण');
  result = result.replace(/\bDhanishta\b/g, 'धनिष्ठा');
  result = result.replace(/\bShatabhisha\b/g, 'शतभिषा');
  result = result.replace(/\bPurva Bhadrapada\b/g, 'पूर्वभाद्रपद');
  result = result.replace(/\bUttara Bhadrapada\b/g, 'उत्तरभाद्रपद');
  result = result.replace(/\bRevati\b/g, 'रेवती');

  // 4. Replace Yoga Names
  result = result.replace(/\bVishkumbha\b/g, 'विष्कम्भ');
  result = result.replace(/\bPriti\b/g, 'प्रीति');
  result = result.replace(/\bAyushman\b/g, 'आयुष्मान');
  result = result.replace(/\bSaubhagya\b/g, 'सौभाग्य');
  result = result.replace(/\bShobhana\b/g, 'शोभन');
  result = result.replace(/\bAtiganda\b/g, 'अतिगण्ड');
  result = result.replace(/\bSukarma\b/g, 'सुकर्मा');
  result = result.replace(/\bDhriti\b/g, 'धृति');
  result = result.replace(/\bShula\b/g, 'शूल');
  result = result.replace(/\bGanda\b/g, 'गण्ड');
  result = result.replace(/\bVriddhi\b/g, 'वृद्धि');
  result = result.replace(/\bDhruva\b/g, 'ध्रुव');
  result = result.replace(/\bVyaghata\b/g, 'व्याघात');
  result = result.replace(/\bHarshana\b/g, 'हर्षण');
  result = result.replace(/\bVajra\b/g, 'वज्र');
  result = result.replace(/\bSiddhi\b/g, 'सिद्धि');
  result = result.replace(/\bVyatipata\b/g, 'व्यतिपात');
  result = result.replace(/\bVariyana\b/g, 'वरीयान');
  result = result.replace(/\bParigha\b/g, 'परिघ');
  result = result.replace(/\bShiva\b/g, 'शिव');
  result = result.replace(/\bSiddha\b/g, 'सिद्ध');
  result = result.replace(/\bSadhya\b/g, 'साध्य');
  result = result.replace(/\bShubha\b/g, 'शुभ');
  result = result.replace(/\bBrahma\b/g, 'ब्रह्म');
  result = result.replace(/\bIndra\b/g, 'इन्द्र');
  result = result.replace(/\bVaidhriti\b/g, 'वैधृति');

  // 5. Replace Karana Names
  result = result.replace(/\bBava\b/g, 'बव');
  result = result.replace(/\bBalava\b/g, 'बालव');
  result = result.replace(/\bKaulava\b/g, 'कौलव');
  result = result.replace(/\bTaitila\b/g, 'तैतिल');
  result = result.replace(/\bGara\b/g, 'गर');
  result = result.replace(/\bVanija\b/g, 'वणिज');
  result = result.replace(/\bVishti\b/g, 'विष्टि');
  result = result.replace(/\bKimstughna\b/g, 'किंस्तुघ्न');
  result = result.replace(/\bShakuni\b/g, 'शकुनि');
  result = result.replace(/\bChatushpada\b/g, 'चतुष्पाद');
  result = result.replace(/\bNagava\b/g, 'नाग');

  // 6. Replace Weekdays (Vara)
  result = result.replace(/\bRavivara\b/g, 'रविवार');
  result = result.replace(/\bSomavara\b/g, 'सोमवार');
  result = result.replace(/\bMangalavara\b/g, 'मंगलवार');
  result = result.replace(/\bBudhavara\b/g, 'बुधवार');
  result = result.replace(/\bGuruvara\b/g, 'गुरुवार');
  result = result.replace(/\bShukravara\b/g, 'शुक्रवार');
  result = result.replace(/\bShanivara\b/g, 'शनिवार');
  result = result.replace(/\bSunday\b/g, 'रविवार');
  result = result.replace(/\bMonday\b/g, 'सोमवार');
  result = result.replace(/\bTuesday\b/g, 'मंगलवार');
  result = result.replace(/\bWednesday\b/g, 'बुधवार');
  result = result.replace(/\bThursday\b/g, 'गुरुवार');
  result = result.replace(/\bFriday\b/g, 'शुक्रवार');
  result = result.replace(/\bSaturday\b/g, 'शनिवार');

  // 7. Replace Months
  result = result.replace(/\bChaitra\b/g, 'चैत्र');
  result = result.replace(/\bVaishakha\b/g, 'वैशाख');
  result = result.replace(/\bJyeshtha\b/g, 'ज्येष्ठ');
  result = result.replace(/\bAshadha\b/g, 'आषाढ़');
  result = result.replace(/\bShravana\b/g, 'श्रावण');
  result = result.replace(/\bBhadrapada\b/g, 'भाद्रपद');
  result = result.replace(/\bAshwin\b/g, 'आश्विन');
  result = result.replace(/\bKartik\b/g, 'कार्तिक');
  result = result.replace(/\bMargashirsha\b/g, 'मार्गशीर्ष');
  result = result.replace(/\bPausha\b/g, 'पौष');
  result = result.replace(/\bMagha\b/g, 'माघ');
  result = result.replace(/\bPhalguna\b/g, 'फाल्गुन');
  result = result.replace(/\bAdhik\b/g, 'अधिक');
  result = result.replace(/\bNija\b/g, 'निज');

  // 8. Replace Festivals
  result = result.replace(/\bRam Navami & Hari Jayanti\b/g, 'राम नवमी और हरि जयंती');
  result = result.replace(/\bHanuman Jayanti\b/g, 'हनुमान जयंती');
  result = result.replace(/\bVasant Panchami & Shikshapatri Jayanti\b/g, 'वसंत पंचमी और शिक्षापत्री जयंती');
  result = result.replace(/\bMaha Shivratri\b/g, 'महा शिवरात्रि');
  result = result.replace(/\bHoli\b/g, 'होली');
  result = result.replace(/\bDhuleti \(Pushpadolotsav\)\b/g, 'धुलेंडी (पुष्पडोल उत्सव)');
  result = result.replace(/\bDhuleti\b/g, 'धुलेंडी');
  result = result.replace(/\bGuru Purnima\b/g, 'गुरु पूर्णिमा');
  result = result.replace(/\bRaksha Bandhan\b/g, 'रक्षाबंधन');
  result = result.replace(/\bKrishna Janmashtami\b/g, 'कृष्ण जन्माष्टमी');
  result = result.replace(/\bGanesh Chaturthi\b/g, 'गणेश चतुर्थी');
  result = result.replace(/\bJal Jhilani Ekadashi\b/g, 'जल झीनी एकादशी');
  result = result.replace(/\bDhanteras\b/g, 'धनतेरस');
  result = result.replace(/\bKali Chaudash\b/g, 'काली चौदस');
  result = result.replace(/\bDiwali\b/g, 'दिवाली');
  result = result.replace(/\bNutan Varsh \(Gujarati New Year\)\b/g, 'नूतन वर्ष (गुजराती नव वर्ष)');
  result = result.replace(/\bNutan Varsh\b/g, 'नूतन वर्ष');
  result = result.replace(/\bBhai Dooj \(Yama Dwitiya\)\b/g, 'भाई दूज (यम द्वितीया)');
  result = result.replace(/\bBhai Dooj\b/g, 'भाई दूज');
  result = result.replace(/\bDev Diwali\b/g, 'देव दिवाली');

  // General Ekadashi names
  result = result.replace(/\bKamada Ekadashi\b/g, 'कामदा एकादशी');
  result = result.replace(/\bVaruthini Ekadashi\b/g, 'वरुथिनी एकादशी');
  result = result.replace(/\bMohini Ekadashi\b/g, 'मोहिनी एकादशी');
  result = result.replace(/\bApara Ekadashi\b/g, 'अपरा एकादशी');
  result = result.replace(/\bNirjala Ekadashi\b/g, 'निर्जला एकादशी');
  result = result.replace(/\bYogini Ekadashi\b/g, 'योगिनी एकादशी');
  result = result.replace(/\bDevshayani Ekadashi\b/g, 'देवशयनी एकादशी');
  result = result.replace(/\bKamika Ekadashi\b/g, 'कामिका एकादशी');
  result = result.replace(/\bShravana Putrada Ekadashi\b/g, 'पुत्रदा एकादशी (श्रावण)');
  result = result.replace(/\bAja Ekadashi\b/g, 'अजा एकादशी');
  result = result.replace(/\bParivartini Ekadashi\b/g, 'परिवर्तिनी एकादशी');
  result = result.replace(/\bIndira Ekadashi\b/g, 'इन्दिरा एकादशी');
  result = result.replace(/\bPapankusha Ekadashi\b/g, 'पापांकुशा एकादशी');
  result = result.replace(/\bRama Ekadashi\b/g, 'रमा एकादशी');
  result = result.replace(/\bDevutthana \(Prabodhini\) Ekadashi\b/g, 'प्रबोधिनी एकादशी');
  result = result.replace(/\bPrabodhini Ekadashi\b/g, 'प्रबोधिनी एकादशी');
  result = result.replace(/\bUtpanna Ekadashi\b/g, 'उत्पन्ना एकादशी');
  result = result.replace(/\bMokshada Ekadashi\b/g, 'मोक्षदा एकादशी');
  result = result.replace(/\bSaphala Ekadashi\b/g, 'सफला एकादशी');
  result = result.replace(/\bPausha Putrada Ekadashi\b/g, 'पुत्रदा एकादशी (पौष)');
  result = result.replace(/\bShattila Ekadashi\b/g, 'षटतिला एकादशी');
  result = result.replace(/\bJaya Ekadashi\b/g, 'जया एकादशी');
  result = result.replace(/\bVijaya Ekadashi\b/g, 'विजया एकादशी');
  result = result.replace(/\bAmalaki Ekadashi\b/g, 'आमलकी एकादशी');
  result = result.replace(/\bPapmochani Ekadashi\b/g, 'पापमोचिनी एकादशी');
  result = result.replace(/\bPadmini Adhik Ekadashi\b/g, 'पद्मिनी अधिक एकादशी');
  result = result.replace(/\bParama Adhik Ekadashi\b/g, 'परमा अधिक एकादशी');
  result = result.replace(/\bEkadashi Fast\b/g, 'एकादशी व्रत');
  result = result.replace(/\bEkadashi\b/g, 'एकादशी');

  return result;
}
