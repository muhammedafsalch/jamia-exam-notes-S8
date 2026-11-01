const data = require('../kithab_mahalli_part3.json');
console.log('Book title:', data.bookInfo.popularName);
console.log('Total chapters in file:', data.chapters.length);
let totalSections = 0;
data.chapters.forEach((ch, i) => {
    console.log(`${i+1}. ${ch.titleArabic} - ${ch.sections.length} sections`);
    totalSections += ch.sections.length;
    ch.sections.forEach((s, si) => {
        console.log(`   ${si+1}. ${s.subtitleArabic}`);
    });
});

console.log(`\nTotal sections across all chapters: ${totalSections}`);
