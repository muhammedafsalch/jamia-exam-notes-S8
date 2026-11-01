/**
 * Complete Dataset Builder for Kitab al-Mahalli Part 3
 * Assembles all 9 chapters into a single JSON file and data.js
 */

const fs = require('fs');
const path = require('path');

const ch1 = require('./chapters/ch1_iqrar');
const ch2 = require('./chapters/ch2_ariyah');
const ch3 = require('./chapters/ch3_ghasb');
const ch4 = require('./chapters/ch4_shufah');
const ch5 = require('./chapters/ch5_qirad');
const ch6 = require('./chapters/ch6_musaqah');
const ch7 = require('./chapters/ch7_ijarah');
const ch8 = require('./chapters/ch8_ihya');
const ch9 = require('./chapters/ch9_waqf');

const chapters = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9];

let totalSections = 0;
chapters.forEach(ch => { totalSections += ch.sections.length; });

const bookData = {
  bookInfo: {
    titleArabic: "كَنْزُ الرَّاغِبِينَ شَرْحُ مِنْهَاجِ الطَّالِبِينَ",
    popularName: "كتاب المحلي (Kitab al-Mahalli)",
    part: "الجزء الثالث (Part 3)",
    range: "مِنْ كِتَابِ الإِقْرَارِ إِلَى كِتَابِ الوَقْفِ",
    matnAuthor: "الإمام محيي الدين أبو زكريا يحيى بن شرف النووي الشافعي (ت 676 هـ)",
    sharhAuthor: "الإمام جلال الدين محمد بن أحمد المحلي الشافعي (ت 864 هـ)",
    madhhab: "المذهب الشافعي (Shafi'i Madhhab)",
    sourceEdition: "دار الكتب العلمية - حاشيتا قليوبي وعميرة على كنز الراغبين (ج 3) - aljam3.com/ar/34775/65882",
    descriptionMalayalam: "ഇമാം നവവി (റഹ്) യുടെ മിൻഹാജുത്ത്വാലിബീൻ മത്‌നും ഇമാം ജലാലുദ്ദീൻ അൽ മഹല്ലി (റഹ്) യുടെ കൻസുർറാഗിബീൻ ശറഹും ഉൾക്കൊള്ളുന്ന സമ്പൂർണ്ണ മൂന്നാം ഭാഗം (ബാബുൽ ഇഖ്റാർ മുതൽ ബാബുൽ വഖ്ഫ് വരെ). ഒൻപത് ബാബുകളിലെ മുഴുവൻ ഫസ്ലുകളും ഫുറൂഉകളും (ശാഖാ-വിധികൾ) ഉൾക്കൊള്ളുന്ന ദർസ് ക്ലാസ്സ് ഉപകരണം.",
    totalChapters: 9,
    totalSections: totalSections
  },
  chapters: chapters
};

// Write JSON file
const jsonPath = path.join(__dirname, '..', 'kithab_mahalli_part3.json');
fs.writeFileSync(jsonPath, JSON.stringify(bookData, null, 2), 'utf8');
console.log(`✅ Written: kithab_mahalli_part3.json (${totalSections} sections across 9 chapters)`);

// Write data.js file
const dataJsHeader = `/**
 * Kitab al-Mahalli (Kanz al-Raghibin Sharh Minhaj al-Talibin)
 * Part 3: From Kitab al-Iqrar to Kitab al-Waqf
 * Complete classical text with ${totalSections} sections across 9 chapters.
 * Auto-generated from chapter files. Do not edit manually.
 */

const KITHAB_METADATA = ${JSON.stringify(bookData.bookInfo, null, 2)};

const KITHAB_DATA = ${JSON.stringify(chapters, null, 2)};
`;

const dataJsPath = path.join(__dirname, '..', 'js', 'data.js');
fs.writeFileSync(dataJsPath, dataJsHeader, 'utf8');
console.log(`✅ Written: js/data.js`);

// Summary
console.log('\n📚 Chapter Summary:');
chapters.forEach(ch => {
  console.log(`  ${ch.order}. ${ch.titleArabic} — ${ch.sections.length} sections`);
  ch.sections.forEach(s => {
    console.log(`     • ${s.subtitleArabic}`);
  });
});
console.log(`\nTotal: ${totalSections} sections`);
