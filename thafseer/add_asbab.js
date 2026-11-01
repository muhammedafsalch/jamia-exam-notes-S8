const fs = require('fs');

try {
    let content = fs.readFileSync('d:\\jjc\\thafseer\\data.js', 'utf8');
    let prefix = 'const TAFSEER_DATA = ';
    let jsonStr = content.substring(prefix.length).trim();
    if (jsonStr.endsWith(';')) {
        jsonStr = jsonStr.slice(0, -1);
    }
    
    let data;
    eval('data = ' + jsonStr + ';');
    
    const asbabData = require('./translations/asbab_data');
    
    data.forEach(surah => {
        let sNum = surah.surahNumber;
        if (asbabData[sNum] && asbabData[sNum].length > 0) {
            surah.asbabAlNuzul = asbabData[sNum];
        } else {
            surah.asbabAlNuzul = [];
        }
        
        // Add Arabic text to top points/questions if needed
        if (surah.topPoints && surah.topPoints.length > 0 && !surah.topPoints[0].includes('(')) {
            surah.topPoints[0] = surah.topPoints[0] + " (خلاصة السورة)";
        }
    });
    
    fs.writeFileSync('d:\\jjc\\thafseer\\data.js', prefix + JSON.stringify(data, null, 2) + ';');
    console.log('Successfully updated Asbab al-Nuzul (Revelation reasons) with validated Sharh data!');
} catch(e) {
    console.error('Error:', e);
}
