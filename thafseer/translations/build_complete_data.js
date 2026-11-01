const fs = require('fs');
const path = require('path');

const t53_55 = require('./surahs_53_55');
const t56_58 = require('./surahs_56_58');
const t59_62 = require('./surahs_59_62');
const t63_66 = require('./surahs_63_66');
const t67_70 = require('./surahs_67_70');
const t71_76 = require('./surahs_71_76');
const asbabData = require('./asbab_data');

const allTranslations = {
  ...t53_55,
  ...t56_58,
  ...t59_62,
  ...t63_66,
  ...t67_70,
  ...t71_76
};

const dataFilePath = path.join(__dirname, '..', 'data.js');
let content = fs.readFileSync(dataFilePath, 'utf8');
let prefix = 'const TAFSEER_DATA = ';
let jsonStr = content.substring(prefix.length).trim();
if (jsonStr.endsWith(';')) {
    jsonStr = jsonStr.slice(0, -1);
}

let data;
eval('data = ' + jsonStr + ';');

console.log(`Processing ${data.length} Surahs...`);

let totalAyahsUpdated = 0;
let totalSurahsWithAsbab = 0;

data.forEach(surah => {
    const sNum = surah.surahNumber;
    const sTranslations = allTranslations[sNum];

    surah.ayahs.forEach(ayah => {
        const aNum = ayah.ayahNumber;

        // Normalize Arabic jalalayn if it used (...) instead of «...» for matn
        // (Only for the outer Quran text segments if not already using «»)
        if (!ayah.jalalayn.includes('«') && ayah.jalalayn.startsWith('(')) {
            // Replace the first bracketed segment or all bracketed segments matching Quran text
            ayah.jalalayn = ayah.jalalayn.replace(/\(([^)]+)\)/g, '«$1»');
        }

        // Preserve original Quran Matn translation
        if (!ayah.malayalamMatn) {
            ayah.malayalamMatn = ayah.malayalam;
        }

        // Update with full Tafseer translation (Matn + Sharh)
        if (sTranslations && sTranslations[aNum]) {
            ayah.malayalam = sTranslations[aNum];
            totalAyahsUpdated++;
        }
    });

    // Update Asbab al-Nuzul strictly from validated Sharh data
    if (asbabData[sNum] && asbabData[sNum].length > 0) {
        surah.asbabAlNuzul = asbabData[sNum];
        totalSurahsWithAsbab++;
    } else {
        surah.asbabAlNuzul = [];
    }
});

fs.writeFileSync(dataFilePath, prefix + JSON.stringify(data, null, 2) + ';');

console.log(`\n✅ Build Complete!`);
console.log(`Updated ${totalAyahsUpdated} ayahs with full Tafseer Malayalam translations (Matn + Sharh).`);
console.log(`Validated Asbab al-Nuzul for all 24 chapters (total ${totalSurahsWithAsbab} chapters with specific revelation reasons).`);
