// Builder for Kitab al-Mahalli Part 3 complete dataset
const fs = require('fs');
const path = require('path');

const bookMetadata = {
  titleArabic: "كَنْزُ الرَّاغِبِينَ شَرْحُ مِنْهَاجِ الطَّالِبِينَ",
  popularName: "كتاب المحلي (Kitab al-Mahalli)",
  part: "الجزء الثالث (Part 3)",
  range: "مِنْ كِتَابِ الإِقْرَارِ إِلَى كِتَابِ الوَقْفِ (From Kitab al-Iqrar to Kitab al-Waqf)",
  matnAuthor: "الإمام محيي الدين أبو زكريا يحيى بن شرف النووي الشافعي (ت 676 هـ)",
  sharhAuthor: "الإمام جلال الدين محمد بن أحمد المحلي الشافعي (ت 864 هـ)",
  madhhab: "المذهب الشافعي (Shafi'i Madhhab)",
  sourceEdition: "دار الكتب العلمية - طبعة حاشيتا قليوبي وعميرة على كنز الراغبين (ج 3 ص 1-558) - عبر جامع الكتب الإسلامية",
  descriptionMalayalam: "ഇമാം നവവി (റഹ്) യുടെ മിൻഹാജുത്ത്വാലിബീൻ മത്‌നും ഇമാം ജലാലുദ്ദീൻ അൽ മഹല്ലി (റഹ്) യുടെ കൻസുർറാഗിബീൻ ശറഹും ഉൾക്കൊള്ളുന്ന സമ്പൂർണ്ണ മൂന്നാം ഭാഗം (ബാബുൽ ഇഖ്റാർ മുതൽ ബാബുൽ വഖ്ഫ് വരെ). എല്ലാ ബാബുകളിലെയും മുഴുവൻ ഫസ്ലുകളും പ്രധാനപ്പെട്ട ശാഖാവിധികളും (ഫുറൂഉകൾ) മലയാള വിശദീകരണ സഹിതം ഉൾപ്പെടുത്തിയിരിക്കുന്നു.",
  totalChapters: 9,
  totalSections: 53
};

console.log('Book metadata ready');
