const fs = require('fs');
const path = require('path');

const surahNamesMl = {
    53: "സൂറത്തുന്നജ്മ് (നക്ഷത്രം)",
    54: "സൂറത്തുൽ ഖമർ (ചന്ദ്രൻ)",
    55: "സൂറത്തുറഹ്‌മാൻ (പരമകാരുണികൻ)",
    56: "സൂറത്തുൽ വാഖിഅ (സംഭവിക്കുന്ന കാര്യം)",
    57: "സൂറത്തുൽ ഹദീദ് (ഇരുമ്പ്)",
    58: "സൂറത്തുൽ മുജാദല (തർക്കിക്കുന്നവൾ)",
    59: "സൂറത്തുൽ ഹശ്ർ (സംഗമം)",
    60: "സൂറത്തുൽ മുംതഹിന (പരീക്ഷിക്കപ്പെടുന്നവൾ)",
    61: "സൂറത്തുസ്സ്വഫ്ഫ് (അണി)",
    62: "സൂറത്തുൽ ജുമുഅ (വെള്ളിയാഴ്ച)",
    63: "സൂറത്തുൽ മുനാഫിഖൂൻ (കപടവിശ്വാസികൾ)",
    64: "സൂറത്തുത്തഗാബുൻ (നഷ്ടം വെളിപ്പെടൽ)",
    65: "സൂറത്തുത്ത്വലാഖ് (വിവാഹമോചനം)",
    66: "സൂറത്തുത്തഹ്‌രീം (നിഷിദ്ധമാക്കൽ)",
    67: "സൂറത്തുൽ മുൽക് (ആധിപത്യം)",
    68: "സൂറത്തുൽ ഖലം (പേന)",
    69: "സൂറത്തുൽ ഹാഖ്ഖ (യാഥാർത്ഥ്യം)",
    70: "സൂറത്തുൽ മആരിജ് (കയറുപടികൾ)",
    71: "സൂറത്തു നൂഹ് (നൂഹ് നബി)",
    72: "സൂറത്തുൽ ജിന്ന് (ജിന്ന്)",
    73: "സൂറത്തുൽ മുസ്സമ്മിൽ (പുതച്ചു മൂടിയവൻ)",
    74: "സൂറത്തുൽ മുദ്ദസ്സിർ (വസ്ത്രം ചുറ്റിയവൻ)",
    75: "സൂറത്തുൽ ഖിയാമ (ഉയിർത്തെഴുന്നേൽപ്)",
    76: "സൂറത്തുൽ ഇൻസാൻ (മനുഷ്യൻ)"
};

async function fetchSurah(number) {
    console.log(`Fetching Surah ${number}...`);
    try {
        // Fetch original Arabic text
        const arRes = await fetch(`http://api.alquran.cloud/v1/surah/${number}`);
        const arData = await arRes.json();
        
        // Fetch Jalalayn Tafseer
        const jalRes = await fetch(`http://api.alquran.cloud/v1/surah/${number}/ar.jalalayn`);
        const jalData = await jalRes.json();
        
        // Fetch Malayalam translation (Abdul Hameed & Kunhi Mohammed)
        const mlRes = await fetch(`http://api.alquran.cloud/v1/surah/${number}/ml.abdulhameed`);
        const mlData = await mlRes.json();
        
        const surahInfo = {
            surahNumber: arData.data.number,
            surahNameArabic: arData.data.name,
            surahNameMalayalam: surahNamesMl[number] || arData.data.englishName,
            ayahs: []
        };

        for (let i = 0; i < arData.data.ayahs.length; i++) {
            surahInfo.ayahs.push({
                ayahNumber: arData.data.ayahs[i].numberInSurah,
                quranText: arData.data.ayahs[i].text,
                jalalayn: jalData.data.ayahs[i].text,
                malayalam: mlData.data.ayahs[i].text
            });
        }
        
        return surahInfo;
    } catch(e) {
        console.error("Error fetching surah " + number, e);
        return null;
    }
}

async function main() {
    const allSurahs = [];
    // From Surah An-Najm (53) to Surah Al-Insan (76)
    for (let i = 53; i <= 76; i++) {
        const surah = await fetchSurah(i);
        if (surah) {
            allSurahs.push(surah);
        }
        // sleep a bit to not overwhelm API
        await new Promise(r => setTimeout(r, 500));
    }
    
    fs.writeFileSync(
        path.join(__dirname, 'data.js'), 
        'const TAFSEER_DATA = ' + JSON.stringify(allSurahs, null, 2) + ';'
    );
    console.log(`\n✅ Successfully written all ${allSurahs.length} Surahs to data.js!`);
}

main();
