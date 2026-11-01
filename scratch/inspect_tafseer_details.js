const fs = require('fs');

let code = fs.readFileSync('thafseer/data.js', 'utf8').replace('const TAFSEER_DATA', 'global.TAFSEER_DATA');
eval(code);

console.log('Total Surahs:', global.TAFSEER_DATA.length);
global.TAFSEER_DATA.slice(0, 5).forEach(s => {
    console.log(`\n--- Surah ${s.surahNumber}: ${s.surahNameArabic} (${s.surahNameMalayalam}) ---`);
    if (s.asbabNuzul) console.log('Asbab:', s.asbabNuzul.substring(0, 150) + '...');
    if (s.topPoints) console.log('Top points count:', s.topPoints.length);
    if (s.topQuestions) console.log('Top questions count:', s.topQuestions.length);
});
