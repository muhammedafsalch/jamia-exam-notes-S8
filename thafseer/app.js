document.addEventListener("DOMContentLoaded", () => {
    if (typeof TAFSEER_DATA !== 'undefined') {
        initApp(TAFSEER_DATA);
    } else {
        document.getElementById('app').innerHTML = `<div style="color:red; text-align:center;">Error: TAFSEER_DATA not found. Make sure data.js is loaded.</div>`;
    }
});

function initApp(surahs) {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Clear loading

    // Navigation and Dropdown
    const nav = document.createElement('div');
    nav.className = 'nav-container';
    
    const label = document.createElement('label');
    label.htmlFor = 'surah-select';
    label.textContent = 'സൂറത്ത് തിരഞ്ഞെടുക്കുക (Select Surah):';
    label.className = 'nav-label';

    const select = document.createElement('select');
    select.id = 'surah-select';
    select.className = 'minimal-select';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Surah --';
    select.appendChild(defaultOption);

    surahs.forEach((surah, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${surah.surahNumber}. ${surah.surahNameMalayalam} - ${surah.surahNameArabic}`;
        select.appendChild(option);
    });

    nav.appendChild(label);
    nav.appendChild(select);
    app.appendChild(nav);

    // Content container
    const content = document.createElement('div');
    content.id = 'surah-content';
    content.innerHTML = '<div class="empty-state">Please select a Surah to read.</div>';
    app.appendChild(content);

    select.addEventListener('change', (e) => {
        const idx = e.target.value;
        if (idx === '') {
            content.innerHTML = '<div class="empty-state">Please select a Surah to read.</div>';
        } else {
            renderSurah(surahs[idx], content);
        }
    });
}

function renderSurah(surah, container) {
    container.innerHTML = '';
    const surahCard = document.createElement('div');
    surahCard.className = 'surah-card';

    const header = `
        <div class="surah-header">
            <h2>${surah.surahNumber}. ${surah.surahNameMalayalam}</h2>
            <span class="surah-name-ar">${surah.surahNameArabic}</span>
        </div>
    `;
    surahCard.innerHTML = header;

    surah.ayahs.forEach(ayah => {
        // Highlight the Matn (Quran text) enclosed in « » with a specific class for both Arabic and Malayalam
        const highlightedTafseer = ayah.jalalayn.replace(/«(.*?)»/g, '<span class="matn-highlight">«$1»</span>');
        const highlightedMalayalam = ayah.malayalam.replace(/«(.*?)»/g, '<span class="matn-highlight">«$1»</span>');

        const ayahHtml = `
            <div class="ayah-container">
                <div style="margin-bottom: 0.5rem;">
                    <span class="ayah-number">${ayah.ayahNumber}</span>
                </div>
                
                <div class="quran-text">${ayah.quranText}</div>
                <div class="jalalayn-text">${highlightedTafseer}</div>
                <div class="malayalam-text">${highlightedMalayalam}</div>
            </div>
        `;
        surahCard.innerHTML += ayahHtml;
    });

    // Add Summary and Highlights section at the very end of the Surah
    const summaryHtml = `
        <div class="surah-summary-section">
            <h3 class="summary-title">സംഗ്രഹം (Summary & Highlights)</h3>
            
            <div class="summary-box">
                <h4>പ്രധാന ആശയങ്ങൾ (Top Points)</h4>
                <ul class="summary-list">
                    ${surah.topPoints && surah.topPoints.length ? surah.topPoints.map(p => `<li>${p}</li>`).join('') : '<li>ഈ സൂറത്തിന്റെ പ്രധാന ആശയങ്ങൾ ഉടൻ ചേർക്കുന്നതാണ്. (Points will be added soon)</li>'}
                </ul>
            </div>

            <div class="summary-box">
                <h4>ചോദ്യോത്തരങ്ങൾ (Top Questions)</h4>
                <ul class="summary-list">
                    ${surah.topQuestions && surah.topQuestions.length ? surah.topQuestions.map(q => `<li><strong>Q:</strong> ${q.q} <br> <strong>A:</strong> ${q.a}</li>`).join('') : '<li>ഈ സൂറത്തിലെ പ്രധാന ചോദ്യങ്ങൾ ഉടൻ ചേർക്കുന്നതാണ്. (Questions will be added soon)</li>'}
                </ul>
            </div>

            <div class="summary-box">
                <h4>അവതരണ പശ്ചാത്തലം (أسباب النزول - Reasons for Revelation)</h4>
                <ul class="summary-list">
                    ${surah.asbabAlNuzul && surah.asbabAlNuzul.length ? surah.asbabAlNuzul.map(a => `
                        <li style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px dashed #eee;">
                            <strong>ആയത്ത് ${a.ayahNumber}:</strong> <br>
                            <div dir="rtl" style="font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 1.4rem; color: #111; margin: 0.5rem 0; line-height: 2;">${a.arabicSnippet.replace(/«(.*?)»/g, '<span class="matn-highlight">«$1»</span>')}</div>
                            <div style="color: #333; line-height: 1.8; margin-top: 0.5rem; background: #fdfdfd; padding: 0.6rem 0.8rem; border-left: 3px solid #2c7a4b; border-radius: 4px;"><strong>പശ്ചാത്തലം:</strong> ${a.malayalamSnippet.replace(/«(.*?)»/g, '<span class="matn-highlight">«$1»</span>')}</div>
                        </li>
                    `).join('') : '<li>ഈ സൂറത്തിൽ അവതരണ പശ്ചാത്തലം പ്രത്യേകം പരാമർശിച്ചിട്ടില്ല. (No specific revelation background mentioned)</li>'}
                </ul>
            </div>
        </div>
    `;
    surahCard.innerHTML += summaryHtml;

    container.appendChild(surahCard);
}
