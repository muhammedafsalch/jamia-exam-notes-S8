/**
 * JJC Thafseer Portal Application
 * Master Portal for Tafseer al-Jalalayn (Surah 53 An-Najm to Surah 76 Al-Insan)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThafseerApp();
});

let currentSurahIndex = 0;
let currentViewMode = 'easy'; // Default: Easy Mode (ലളിത പഠനം)
let currentPlayingAudio = null;
let currentPlayingBtn = null;
let currentFontSize = 100; // percent

const GLOSSARY_TERMS = [
  {
    termAr: 'التَّفْسِيرُ بِالْمَأْثُورِ',
    termMl: 'തഫ്സീറു ബിൽ മഅ്സൂർ',
    desc: 'ഖുർആൻ, തിരുസുന്നത്ത്, സ്വഹാബികളുടെയും താബിഉകളുടെയും നിവേദനങ്ങൾ എന്നിവ ആധാരമാക്കിയുള്ള ആധികാരിക തഫ്സീർ രീതി. ഉദാഹരണം: തഫ്സീറു ഇബ്നു കഥീർ, തഫ്സീറുത്ത്വബരി.'
  },
  {
    termAr: 'التَّفْسِيرُ بِالرَّأْيِ الْمَحْمُودِ',
    termMl: 'തഫ്സീറു ബിർറഅ്‌യ് (പ്രശംസനീയമായ ബുദ്ധിപൂർവ്വ തഫ്സീർ)',
    desc: 'അറബി ഭാഷാ നിയമങ്ങൾ, ഇസ്‌ലാമിക പ്രമാണങ്ങൾ, ശരീഅത്തിന്റെ തത്വങ്ങൾ എന്നിവക്ക് അനുസൃതമായി പണ്ഡിതന്മാർ നടത്തുന്ന സ്വതന്ത്രമായ ചിന്താപരമായ തഫ്സീർ.'
  },
  {
    termAr: 'أَسْبَابُ النُّزُولِ',
    termMl: 'അസ്ബാബുന്നുസൂൽ (അവതരണ പശ്ചാത്തലം)',
    desc: 'ഒരു ആയത്തോ സൂറത്തോ അവതരിക്കാൻ കാരണമായ സംഭവമോ പ്രവാചകനോട് ചോദിക്കപ്പെട്ട ചോദ്യമോ ആണ് അസ്ബാബുന്നുസൂൽ. ആയത്തുകളുടെ ശരിയായ ഉദ്ദേശ്യം ഗ്രഹിക്കാൻ ഇത് അത്യന്താപേക്ഷിതമാണ്.'
  },
  {
    termAr: 'الْمُحْكَمُ وَالْمُتَشَابِهُ',
    termMl: 'മുഹ്കമും മുതശാബിഹും',
    desc: 'മുഹ്കം: നേരിട്ട് വ്യക്തമായ അർത്ഥമുള്ള, സംശയത്തിനിടയില്ലാത്ത ആയത്തുകൾ. മുതശാബിഹ്: ഒളിവുള്ളതോ അല്ലാഹുവിന് മാത്രം പൂർണ്ണമായി അറിയാവുന്നതോ ആയ ആയത്തുകൾ (ഖുർആനിലെ കേവലാക്ഷരങ്ങൾ, സ്വർഗ്ഗ-നരക യാഥാർത്ഥ്യങ്ങൾ).'
  },
  {
    termAr: 'النَّاسِخُ وَالْمَنْسُوخُ',
    termMl: 'നാസിഖും മൻസൂഖും',
    desc: 'നാസിഖ്: പിന്നീട് അവതരിച്ച് മുൻവിധിയെ ദുർബലപ്പെടുത്തുന്ന നിയമം. മൻസൂഖ്: ദുർബലപ്പെടുത്തപ്പെട്ട മുൻവിധി. വിധികൾ ഘട്ടംഘട്ടമായി നടപ്പിലാക്കാനാണ് അല്ലാഹു നസ്ഖ് ഏർപ്പെടുത്തിയത്.'
  },
  {
    termAr: 'التَّفْسِيرُ الإِشَارِيُّ',
    termMl: 'തഫ്സീറുൽ ഇശാരി (ആത്മീയ സൂചനകൾ)',
    desc: 'ഖുർആൻ വചനങ്ങളുടെ പ്രകടമായ ബാഹ്യ അർത്ഥത്തെ നിഷേധിക്കാതെ, അതിനുപിന്നിലെ ഗൂഢമായ ആത്മീയ സത്യങ്ങളെയും ഹൃദയ സംസ്കരണ പാഠങ്ങളെയും വെളിപ്പെടുത്തുന്ന സൂഫി തഫ്സീർ ശൈലി.'
  },
  {
    termAr: 'التَّفْسِيرُ الْمَوْضُوعِيُّ',
    termMl: 'തഫ്സീറുൽ മൗളൂഈ (വിഷയാധിഷ്ഠിത തഫ്സീർ)',
    desc: 'ഖുർആനിലെ ഒരു നിർദ്ദിഷ്ട വിഷയത്തെ (ഉദാ: തഖ്‌വ, നീതി, കുടുംബം) ആസ്പദമാക്കി ഖുർആനിലെ മുഴുവൻ ആയത്തുകളെയും ഒരുമിച്ചുകൂട്ടി ആഴത്തിൽ നടത്തുന്ന സമഗ്ര പഠനം.'
  },
  {
    termAr: 'الإِعْجَازُ الْقُرْآنِيُّ',
    termMl: 'ഇഅ്ജാസുൽ ഖുർആൻ (ഖുർആന്റെ അമാനുഷികത)',
    desc: 'ഖുർആന്റെ സാഹിത്യം, അലങ്കാരം, നിയമനിർമ്മാണം, അദൃശ്യ പ്രവചനങ്ങൾ, ശാസ്ത്രീയ യാഥാർത്ഥ്യങ്ങൾ എന്നിവയിലെ ദൈവിക പൂർണ്ണതയും മനുഷ്യർക്ക് അതിനൊരു തുല്യം കൊണ്ടുവരാൻ കഴിയില്ലെന്ന തെളിവും.'
  },
  {
    termAr: 'الْكِنَايَةُ',
    termMl: 'കിനായത്ത് (പരോക്ഷ സൂചന)',
    desc: 'ഒരു പദത്തിന്റെ നേരിട്ടുള്ള അർത്ഥം ഉദ്ദേശിക്കാതെ അതിനോട് ബന്ധപ്പെട്ട മറ്റൊരു ആശയത്തെ പരോക്ഷമായി സൂചിപ്പിക്കുന്ന സാഹിത്യ ശൈലി. ഉദാ: സൂറത്തുൽ ഖമറിൽ കപ്പലിനെ «ذَاتِ أَلْوَاحٍ وَدُسُرٍ» (പലകകളും ആണികളും ചേർന്നത്) എന്ന് സൂചിപ്പിച്ചത്.'
  },
  {
    termAr: 'سُورَةٌ مَكِّيَّةٌ وَمَدَنِيَّةٌ',
    termMl: 'മക്കീ-മദനീ സൂറത്തുകൾ',
    desc: 'മക്കീ: നബി(സ)യുടെ ഹിജ്റക്ക് മുമ്പ് അവതരിച്ച സൂറത്തുകൾ (തൗഹീദ്, പരലോകം, ആഖിറം, മുൻപ്രവാചകന്മാരുടെ ചരിത്രം). മദനീ: ഹിജ്റക്ക് ശേഷം അവതരിച്ച സൂറത്തുകൾ (ശരീഅത്ത് നിയമങ്ങൾ, കുടുംബം, ജിഹാദ്, കപടവിശ്വാസികൾ).'
  }
];

function initThafseerApp() {
  if (typeof TAFSEER_DATA === 'undefined' || !Array.isArray(TAFSEER_DATA)) {
    console.error('TAFSEER_DATA is not defined!');
    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
      contentArea.innerHTML = `
        <div style="padding: 3rem; text-align: center; color: var(--color-error);">
          <h2>ഡാറ്റ ലോഡ് ചെയ്യുന്നതിൽ പിശക്</h2>
          <p>thafseer/data.js കൃത്യമായി ലഭ്യമായിട്ടില്ല. ദയവായി പേജ് റീഫ്രഷ് ചെയ്യുക.</p>
        </div>
      `;
    }
    return;
  }

  renderSurahList();
  renderCurrentSurah();
  setupViewModes();
  setupSearch();
  setupFontResizer();
  setupGlossaryModal();
  setupThemeToggle();
}

/**
 * Render the list of 24 Surahs in the sidebar
 */
function renderSurahList() {
  const listEl = document.getElementById('surahNavList');
  if (!listEl) return;

  listEl.innerHTML = '';
  TAFSEER_DATA.forEach((surah, idx) => {
    const li = document.createElement('li');
    li.className = 'chapter-item' + (idx === currentSurahIndex ? ' active' : '');
    li.dataset.index = idx;
    li.innerHTML = `
      <span class="chap-num" style="min-width:32px; height:32px; border-radius:50%; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem; color:var(--accent-gold-dark);">${surah.surahNumber}</span>
      <div class="chap-info" style="flex:1;">
        <div class="chap-name-ar" style="font-family:var(--font-arabic); font-size:1.15rem; color:var(--text-main); font-weight:700; direction:rtl;">${surah.surahNameArabic}</div>
        <div class="chap-name-ml" style="font-size:0.82rem; color:var(--text-muted);">${surah.surahNameMalayalam}</div>
      </div>
      <span style="font-size:0.75rem; background:rgba(35,82,60,0.08); color:var(--accent-teal); padding:0.15rem 0.5rem; border-radius:10px; font-weight:600;">${surah.ayahs.length} ആയത്ത്</span>
    `;

    li.addEventListener('click', () => {
      document.querySelectorAll('#surahNavList .chapter-item').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      currentSurahIndex = idx;
      renderCurrentSurah();
      window.scrollTo({ top: 380, behavior: 'smooth' });
    });

    listEl.appendChild(li);
  });
}

/**
 * Render the currently selected Surah
 */
function renderCurrentSurah() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  const surah = TAFSEER_DATA[currentSurahIndex];
  if (!surah) return;

  // Determine revelation type based on Surah number
  const isMadani = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76].includes(surah.surahNumber);
  const revType = isMadani ? 'മദനീയ്യ സൂറത്ത് (مدنية)' : 'മക്കീയ്യ സൂറത്ത് (مكية)';
  const revBadgeClass = isMadani ? 'badge-madani' : 'badge-makki';

  let html = `
    <!-- Surah Header Card -->
    <div class="surah-main-card" style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:2rem; margin-bottom:2rem; box-shadow:var(--shadow-sm); border-top:4px solid var(--accent-gold);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.6rem;">
            <span style="background:var(--accent-gold-light); color:var(--accent-gold-dark); border:1px solid var(--accent-gold-border); font-size:0.8rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:999px;">
              സൂറത്ത് നമ്പർ ${surah.surahNumber}
            </span>
            <span style="background:rgba(35,82,60,0.1); color:var(--accent-teal); font-size:0.8rem; font-weight:700; padding:0.25rem 0.75rem; border-radius:999px;">
              ${revType}
            </span>
            <span style="background:var(--bg-surface-elevated); color:var(--text-muted); font-size:0.8rem; font-weight:600; padding:0.25rem 0.75rem; border-radius:999px;">
              ആകെ ${surah.ayahs.length} ആയത്തുകൾ
            </span>
          </div>
          <h2 style="font-size:1.8rem; color:var(--text-main); margin-bottom:0.3rem; font-weight:800;">
            ${surah.surahNameMalayalam}
          </h2>
          <div style="font-size:0.95rem; color:var(--text-muted);">
            തഫ്സീറുൽ ജലാലൈനി (ഇമാം ജലാലുദ്ദീൻ അൽ മഹല്ലി & ഇമാം ജലാലുദ്ദീൻ അസ്സുയൂഥി)
          </div>
        </div>

        <div style="text-align:right;">
          <div style="font-family:var(--font-arabic-heading); font-size:2.6rem; color:#23523c; direction:rtl; line-height:1.2;">
            ${surah.surahNameArabic}
          </div>
        </div>
      </div>

      <!-- Highlights Box -->
      ${renderSurahHighlights(surah)}
    </div>

    <!-- Ayahs Container -->
    <div class="ayahs-list" id="ayahsList">
  `;

  surah.ayahs.forEach(ayah => {
    // Format 3-digit strings for EveryAyah CDN
    const sPad = String(surah.surahNumber).padStart(3, '0');
    const aPad = String(ayah.ayahNumber).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`;

    // Highlight Matn text in Jalalayn & Malayalam
    const highlightedTafseer = ayah.jalalayn.replace(/«(.*?)»/g, '<span class="matn-highlight" style="color:#1b3a2b; font-weight:700; background:rgba(226,186,73,0.18); padding:0 3px; border-radius:3px;">«$1»</span>');
    const highlightedMalayalam = ayah.malayalam.replace(/«(.*?)»/g, '<strong style="color:#23523c;">«$1»</strong>');

    html += `
      <div class="ayah-card" id="ayah-${ayah.ayahNumber}" style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:1.5rem; box-shadow:var(--shadow-sm); transition:box-shadow 0.2s ease;">
        <div class="ayah-card-top" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; padding-bottom:0.8rem; border-bottom:1px solid var(--border-subtle);">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span class="ayah-badge" style="background:#23523c; color:#ffffff; font-weight:700; font-size:0.85rem; width:32px; height:32px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
              ${ayah.ayahNumber}
            </span>
            <span style="font-size:0.85rem; font-weight:600; color:var(--text-muted);">
              സൂറത്ത് ${surah.surahNumber} : ആയത്ത് ${ayah.ayahNumber}
            </span>
          </div>

          <div style="display:flex; gap:0.5rem; align-items:center;">
            <!-- Audio Play Button -->
            <button class="audio-play-btn" data-audio="${audioUrl}" data-ayah="${surah.surahNumber}:${ayah.ayahNumber}" title="ആയത്ത് പാരായണം കേൾക്കുക" style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.4rem 0.8rem; font-size:0.82rem; font-weight:600; color:var(--text-main); display:inline-flex; align-items:center; gap:0.35rem; cursor:pointer;">
              <span class="audio-icon">▶️</span> <span class="audio-text">പാരായണം</span>
            </button>
            <!-- Copy Button -->
            <button class="copy-ayah-btn" data-text="${ayah.quranText.replace(/"/g, '&quot;')}" title="ആയത്ത് കോപ്പി ചെയ്യുക" style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.4rem 0.7rem; font-size:0.82rem; cursor:pointer;">
              📋
            </button>
          </div>
        </div>

        <!-- 1. Quran Text -->
        <div class="quran-text-wrap" style="margin-bottom:1.2rem;">
          <div class="quran-ayah-text arabic-text" style="font-family:var(--font-arabic-heading); font-size:1.6rem; line-height:2.1; color:#183626; direction:rtl; text-align:right;">
            ${ayah.quranText}
          </div>
        </div>

        <!-- 2. Jalalayn Commentary (Shown in Jalalayn & All modes) -->
        <div class="jalalayn-text-wrap" style="background:#f9fbf9; border:1px solid #d9e8df; border-radius:var(--radius-sm); padding:1rem 1.25rem; margin-bottom:1rem;">
          <div style="font-size:0.75rem; font-weight:700; color:#23523c; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
            <span>🖋️ തഫ്സീറുൽ ജലാലൈനി (تفسير الجلالين)</span>
          </div>
          <div class="jalalayn-arabic arabic-text" style="font-family:var(--font-arabic); font-size:1.35rem; line-height:2.0; color:#24362b; direction:rtl; text-align:right;">
            ${highlightedTafseer}
          </div>
        </div>

        <!-- 3. Malayalam Easy Meaning (Shown in Easy, Malayalam & All modes) -->
        <div class="malayalam-text-wrap" style="background:#fdfbf7; border:1px solid #ebd9b6; border-radius:var(--radius-sm); padding:1rem 1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--accent-gold-dark); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.4rem; display:flex; align-items:center; gap:0.4rem;">
            <span>💡 ലളിതമായ മലയാള ആശയം &amp; മസ്അല:</span>
          </div>
          <div class="malayalam-content" style="font-size:1rem; line-height:1.75; color:var(--text-main);">
            ${highlightedMalayalam}
          </div>
        </div>
      </div>
    `;
  });

  html += `
    </div>

    <!-- Surah Bottom Summary & Top Questions -->
    ${renderSurahFooterSummary(surah)}
  `;

  contentArea.innerHTML = html;
  applyViewModeToContent();
  applyFontSize();
  setupAudioListeners();
  setupCopyListeners();
}

/**
 * Render Highlights box at top of Surah
 */
function renderSurahHighlights(surah) {
  let content = '';

  if (surah.topPoints && surah.topPoints.length > 0) {
    content += `
      <div style="margin-top:1.2rem; background:rgba(35,82,60,0.04); border-left:4px solid #23523c; border-radius:var(--radius-sm); padding:1rem 1.2rem;">
        <h4 style="font-size:0.95rem; font-weight:700; color:#23523c; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
          📌 പ്രധാന ആശയങ്ങൾ (Core Themes)
        </h4>
        <ul style="margin:0; padding-left:1.2rem; font-size:0.92rem; color:var(--text-main); line-height:1.6;">
          ${surah.topPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  return content;
}

/**
 * Render Bottom Footer Summary & Top Questions
 */
function renderSurahFooterSummary(surah) {
  if (!surah.topQuestions || surah.topQuestions.length === 0) return '';

  return `
    <div class="surah-footer-card" style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:2rem; margin-top:2.5rem; box-shadow:var(--shadow-sm);">
      <h3 style="font-size:1.25rem; color:#23523c; font-weight:700; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
        🎓 പ്രധാന പരീക്ഷാ ചോദ്യങ്ങൾ (Top Exam Questions)
      </h3>
      <div class="questions-list">
        ${surah.topQuestions.map((item, idx) => {
          const qText = typeof item === 'object' ? item.q : item;
          const aText = typeof item === 'object' ? item.a : '';
          return `
            <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:1rem 1.25rem; margin-bottom:0.8rem;">
              <div style="font-weight:700; color:#1b3a2b; font-size:0.95rem; margin-bottom:0.3rem;">
                ചോദ്യം ${idx + 1}: ${qText}
              </div>
              ${aText ? `<div style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;"><strong>ഉത്തരം:</strong> ${aText}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Setup Audio Recitation Player
 */
function setupAudioListeners() {
  document.querySelectorAll('.audio-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const audioUrl = btn.dataset.audio;
      const iconSpan = btn.querySelector('.audio-icon');
      const textSpan = btn.querySelector('.audio-text');

      if (currentPlayingAudio && currentPlayingBtn === btn) {
        // Toggle pause
        if (currentPlayingAudio.paused) {
          currentPlayingAudio.play();
          if (iconSpan) iconSpan.textContent = '⏸️';
          if (textSpan) textSpan.textContent = 'നിർത്തുക';
        } else {
          currentPlayingAudio.pause();
          if (iconSpan) iconSpan.textContent = '▶️';
          if (textSpan) textSpan.textContent = 'പാരായണം';
        }
        return;
      }

      // Stop previous
      if (currentPlayingAudio) {
        currentPlayingAudio.pause();
        currentPlayingAudio.currentTime = 0;
        if (currentPlayingBtn) {
          const prevIcon = currentPlayingBtn.querySelector('.audio-icon');
          const prevText = currentPlayingBtn.querySelector('.audio-text');
          if (prevIcon) prevIcon.textContent = '▶️';
          if (prevText) prevText.textContent = 'പാരായണം';
        }
      }

      // Start new audio
      currentPlayingAudio = new Audio(audioUrl);
      currentPlayingBtn = btn;
      if (iconSpan) iconSpan.textContent = '⏳';
      if (textSpan) textSpan.textContent = 'ലോഡിംഗ്...';

      currentPlayingAudio.play().then(() => {
        if (iconSpan) iconSpan.textContent = '⏸️';
        if (textSpan) textSpan.textContent = 'നിർത്തുക';
      }).catch(err => {
        console.warn('Audio playback error:', err);
        if (iconSpan) iconSpan.textContent = '⚠️';
        if (textSpan) textSpan.textContent = 'ലഭ്യമല്ല';
      });

      currentPlayingAudio.addEventListener('ended', () => {
        if (iconSpan) iconSpan.textContent = '▶️';
        if (textSpan) textSpan.textContent = 'പാരായണം';
        currentPlayingAudio = null;
        currentPlayingBtn = null;
      });
    });
  });
}

/**
 * Setup Copy Ayah Text
 */
function setupCopyListeners() {
  document.querySelectorAll('.copy-ayah-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.text;
      navigator.clipboard.writeText(text).then(() => {
        showToast('ആയത്ത് കോപ്പി ചെയ്തു!');
      }).catch(() => {
        showToast('കോപ്പി ചെയ്യാൻ കഴിഞ്ഞില്ല');
      });
    });
  });
}

/**
 * Setup View Modes (Easy, Quran Only, Malayalam Only, Jalalayn, All)
 */
function setupViewModes() {
  const buttons = document.querySelectorAll('.view-modes .view-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.dataset.view;
      applyViewModeToContent();
    });
  });
}

function applyViewModeToContent() {
  const contentArea = document.getElementById('contentArea');
  if (!contentArea) return;

  // Clear existing mode classes
  contentArea.classList.remove('view-easy', 'view-quran', 'view-malayalam', 'view-jalalayn', 'view-all');
  contentArea.classList.add(`view-${currentViewMode}`);

  // Style display accordingly
  const quranWraps = document.querySelectorAll('.quran-text-wrap');
  const jalalaynWraps = document.querySelectorAll('.jalalayn-text-wrap');
  const malayalamWraps = document.querySelectorAll('.malayalam-text-wrap');

  if (currentViewMode === 'easy') {
    // Easy mode: Show Quran + Simple Malayalam (hide heavy Jalalayn commentary)
    quranWraps.forEach(el => el.style.display = 'block');
    jalalaynWraps.forEach(el => el.style.display = 'none');
    malayalamWraps.forEach(el => el.style.display = 'block');
  } else if (currentViewMode === 'quran') {
    // Quran text only
    quranWraps.forEach(el => el.style.display = 'block');
    jalalaynWraps.forEach(el => el.style.display = 'none');
    malayalamWraps.forEach(el => el.style.display = 'none');
  } else if (currentViewMode === 'malayalam') {
    // Malayalam translation only
    quranWraps.forEach(el => el.style.display = 'none');
    jalalaynWraps.forEach(el => el.style.display = 'none');
    malayalamWraps.forEach(el => el.style.display = 'block');
  } else if (currentViewMode === 'jalalayn') {
    // Quran + Jalalayn commentary
    quranWraps.forEach(el => el.style.display = 'block');
    jalalaynWraps.forEach(el => el.style.display = 'block');
    malayalamWraps.forEach(el => el.style.display = 'none');
  } else if (currentViewMode === 'all') {
    // Everything visible
    quranWraps.forEach(el => el.style.display = 'block');
    jalalaynWraps.forEach(el => el.style.display = 'block');
    malayalamWraps.forEach(el => el.style.display = 'block');
  }
}

/**
 * Live Search across Surahs, Ayahs, Arabic, and Malayalam
 */
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderCurrentSurah();
      return;
    }

    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    let matches = [];
    TAFSEER_DATA.forEach((surah, sIdx) => {
      surah.ayahs.forEach(ayah => {
        const ar = ayah.quranText.toLowerCase();
        const jal = ayah.jalalayn.toLowerCase();
        const ml = ayah.malayalam.toLowerCase();
        const sName = surah.surahNameMalayalam.toLowerCase();
        const sNum = String(surah.surahNumber);
        const aNum = String(ayah.ayahNumber);

        if (ar.includes(q) || jal.includes(q) || ml.includes(q) || sName.includes(q) || sNum === q || `${sNum}:${aNum}` === q) {
          matches.push({ surah, ayah, sIdx });
        }
      });
    });

    if (matches.length === 0) {
      contentArea.innerHTML = `
        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:3rem; text-align:center;">
          <h3 style="color:var(--text-muted); margin-bottom:0.5rem;">ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</h3>
          <p style="color:var(--text-muted); font-size:0.95rem;">'${q}' എന്നതിനോട് യോജിക്കുന്ന ആയത്തുകളോ തഫ്സീറോ കണ്ടെത്താനായില്ല. മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് തിരയുക.</p>
        </div>
      `;
      return;
    }

    let searchHtml = `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.2rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:#23523c;">'${q}' എന്നതിന് ${matches.length} ഫലങ്ങൾ കണ്ടെത്തി</span>
        <button id="clearSearchBtn" style="background:#23523c; color:#fff; border:none; padding:0.4rem 0.9rem; border-radius:var(--radius-sm); font-size:0.85rem; cursor:pointer;">തിരച്ചിൽ അവസാനിപ്പിക്കുക</button>
      </div>
      <div class="ayahs-list">
    `;

    matches.slice(0, 50).forEach(m => {
      searchHtml += `
        <div class="ayah-card" style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span style="background:var(--accent-gold-light); color:var(--accent-gold-dark); padding:0.2rem 0.6rem; border-radius:999px; font-size:0.82rem; font-weight:700;">
              ${m.surah.surahNumber}. ${m.surah.surahNameMalayalam} : ആയത്ത് ${m.ayah.ayahNumber}
            </span>
          </div>
          <div class="quran-ayah-text arabic-text" style="font-family:var(--font-arabic-heading); font-size:1.45rem; line-height:2.0; color:#183626; direction:rtl; text-align:right; margin-bottom:0.8rem;">
            ${m.ayah.quranText}
          </div>
          <div style="background:#fdfbf7; border:1px solid #ebd9b6; border-radius:var(--radius-sm); padding:0.8rem 1rem; font-size:0.95rem; color:var(--text-main); line-height:1.6;">
            ${m.ayah.malayalam}
          </div>
        </div>
      `;
    });

    if (matches.length > 50) {
      searchHtml += `<div style="text-align:center; padding:1rem; color:var(--text-muted); font-size:0.9rem;">ആദ്യ 50 ഫലങ്ങൾ മാത്രം കാണിക്കുന്നു...</div>`;
    }

    searchHtml += `</div>`;
    contentArea.innerHTML = searchHtml;

    document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
      searchInput.value = '';
      renderCurrentSurah();
    });
  });
}

/**
 * Font Resizer
 */
function setupFontResizer() {
  const decBtn = document.getElementById('fontDecBtn');
  const incBtn = document.getElementById('fontIncBtn');

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (currentFontSize > 75) {
        currentFontSize -= 10;
        applyFontSize();
      }
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (currentFontSize < 160) {
        currentFontSize += 10;
        applyFontSize();
      }
    });
  }
}

function applyFontSize() {
  document.querySelectorAll('.arabic-text').forEach(el => {
    el.style.fontSize = `${(currentFontSize / 100) * 1.5}rem`;
  });
}

/**
 * Glossary Modal
 */
function setupGlossaryModal() {
  const modal = document.getElementById('glossaryModal');
  const openBtn = document.getElementById('glossaryBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const listEl = document.getElementById('glossaryList');

  if (!modal || !openBtn) return;

  if (listEl) {
    listEl.innerHTML = GLOSSARY_TERMS.map(item => `
      <div style="padding:1rem 0; border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.3rem;">
          <h4 style="font-size:1.05rem; color:#23523c; margin:0; font-weight:700;">${item.termMl}</h4>
          <span style="font-family:var(--font-arabic); font-size:1.2rem; color:var(--accent-gold-dark); direction:rtl;">${item.termAr}</span>
        </div>
        <p style="margin:0; font-size:0.92rem; color:var(--text-muted); line-height:1.6;">${item.desc}</p>
      </div>
    `).join('');
  }

  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Theme Toggle
 */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('jjc-theme', isDark ? 'dark' : 'light');
    toggleBtn.innerHTML = isDark ? '☀️ തീം' : '🌙 തീം';
  });

  if (localStorage.getItem('jjc-theme') === 'dark') {
    document.body.classList.add('dark-theme');
    toggleBtn.innerHTML = '☀️ തീം';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}
