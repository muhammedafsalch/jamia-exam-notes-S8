/**
 * Sahih al-Bukhari Interactive Controller (Hadees Portal)
 * Jamia Nooriya Coordination (JJC) Hadith Curriculum
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentBookId = HADEES_DATA[0].id;
  let currentViewMode = "easy"; // 'easy' (Matn + Simple Mas'ala), 'matn', 'sharh', 'malayalam', 'all'
  let currentArabicSize = 1.55;
  let isDarkMode = false;
  let activeAudioUtterance = null;

  // DOM Elements
  const booksListEl = document.getElementById("bookNavList");
  const contentAreaEl = document.getElementById("contentArea");
  const searchInput = document.getElementById("searchInput");
  const viewBtns = document.querySelectorAll(".view-btn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const fontDecBtn = document.getElementById("fontDecBtn");
  const fontIncBtn = document.getElementById("fontIncBtn");
  const glossaryBtn = document.getElementById("glossaryBtn");
  const glossaryModal = document.getElementById("glossaryModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const glossaryListEl = document.getElementById("glossaryList");
  const toastEl = document.getElementById("toastMsg");

  // Format Sharh text to highlight Matn phrases
  function formatSharhText(text) {
    if (!text) return "";
    return text.replace(/\((.*?)\)/g, '<span class="sharh-matn-highlight">($1)</span>');
  }

  // Show Toast Message
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2400);
  }

  // Render Sidebar with Books and their Hadiths
  function renderSidebar() {
    if (!booksListEl) return;
    booksListEl.innerHTML = "";
    HADEES_DATA.forEach((book) => {
      const isCurrent = book.id === currentBookId;
      const li = document.createElement("li");
      li.className = `chapter-nav-item ${isCurrent ? "active" : ""}`;
      li.dataset.bookId = book.id;

      // Sub-list for hadiths of this book
      let hadithListHtml = "";
      if (book.sections && book.sections.length > 0) {
        hadithListHtml = `
          <ul class="sidebar-fasl-list" style="${isCurrent ? 'display: flex;' : 'display: none;'}">
            ${book.sections.map((s) => `
              <li class="sidebar-fasl-item" data-sec-id="${s.subId}" title="${s.babMalayalam}">
                ح ${s.hadithNumber}: ${s.babArabic.replace('بَابُ ', '').slice(0, 32)}...
              </li>
            `).join("")}
          </ul>
        `;
      }

      li.innerHTML = `
        <div class="chap-nav-header">
          <span class="chap-nav-num">കിതാബ് ${book.order} (${book.hadithRange})</span>
          <span class="chap-nav-ar">${book.titleArabic}</span>
          <span class="chap-nav-ml">${book.titleMalayalam}</span>
        </div>
        ${hadithListHtml}
      `;

      // Book click
      li.querySelector(".chap-nav-header").addEventListener("click", () => {
        if (currentBookId !== book.id) {
          currentBookId = book.id;
          renderSidebar();
          renderCurrentBook();
          const stickyNav = document.querySelector(".sticky-nav");
          if (stickyNav) {
            window.scrollTo({ top: stickyNav.offsetTop - 10, behavior: "smooth" });
          }
        }
      });

      // Hadith item clicks inside sidebar
      li.querySelectorAll(".sidebar-fasl-item").forEach(item => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetSecId = item.dataset.secId;
          const targetEl = document.getElementById(`sec_${targetSecId}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            targetEl.style.boxShadow = "0 0 0 3px var(--accent-gold)";
            setTimeout(() => {
              targetEl.style.boxShadow = "";
            }, 1800);
          }
        });
      });

      booksListEl.appendChild(li);
    });
  }

  // Render Current Book View
  function renderCurrentBook() {
    const book = HADEES_DATA.find((b) => b.id === currentBookId);
    if (!book || !contentAreaEl) return;

    let keyPointsHtml = "";
    if (book.keyPoints && book.keyPoints.length > 0) {
      keyPointsHtml = `
        <div class="chapter-keypoints">
          <div class="keypoints-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ഈ കിതാബിലെ പ്രധാന ആശയങ്ങൾ &amp; പരീക്ഷാ ചോദ്യ പശ്ചാത്തലം:
          </div>
          <ul class="keypoints-list">
            ${book.keyPoints.map(kp => `<li>${kp}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    let hadithsHtml = "";
    if (book.sections && book.sections.length > 0) {
      hadithsHtml = book.sections.map((sec) => `
        <article class="fasl-card" id="sec_${sec.subId}" data-sec-id="${sec.subId}">
          <header class="fasl-card-header">
            <div class="fasl-header-top">
              <span class="fasl-number-badge">ഹദീഥ് നമ്പർ: ${sec.hadithNumber}</span>
              <div class="fasl-actions">
                <button class="btn-action play-audio-btn" data-text="${encodeURIComponent(sec.matn)}" title="അറബിക് ഉച്ചാരണം കേൾക്കുക (ഓഡിയോ)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>ശ്രവിക്കുക</span>
                </button>
                <button class="btn-action copy-text-btn" data-text="${encodeURIComponent(sec.matn)}" title="മത്‌ൻ കോപ്പി ചെയ്യുക">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <span>കോപ്പി</span>
                </button>
              </div>
            </div>
            <h3 class="fasl-title-ar">${sec.babArabic}</h3>
            <div class="fasl-title-ml">${sec.babMalayalam}</div>
          </header>

          <div class="fasl-card-body">
            <!-- 1. Matn Section (Always visible) -->
            <div class="text-block matn-block">
              <div class="text-block-tag matn-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                മത്‌ൻ (متن الحديث الشريف) - സ്വഹീഹുൽ ബുഖാരി
              </div>
              <p class="arabic-text matn-text" style="font-size: ${currentArabicSize}rem;">
                ${sec.matn}
              </p>
            </div>

            <!-- 2. Sharh Section (Expandable/Collapsible, hidden by default in Easy Mode) -->
            <div class="text-block sharh-block ${currentViewMode === 'easy' ? 'sharh-collapsed' : ''}">
              <div class="text-block-tag sharh-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                ശറഹു ഫത്‌ഹുൽ ബാരി (شرح فتح الباري للحافظ ابن حجر العسقلاني)
              </div>
              <p class="arabic-text sharh-text" style="font-size: ${currentArabicSize * 0.9}rem;">
                ${formatSharhText(sec.sharh)}
              </p>
            </div>

            <!-- Sharh Toggle Button for Easy Mode -->
            <div class="sharh-toggle-row">
              <button class="btn btn-sm btn-outline toggle-sharh-btn" data-target="sec_${sec.subId}">
                <span class="btn-icon-text">📖 ശറഹ് (ഫത്‌ഹുൽ ബാരി) കാണുക / മറക്കുക</span>
              </button>
            </div>

            <!-- 3. Simplified Malayalam Translation & Meaning -->
            <div class="text-block malayalam-block">
              <div class="text-block-tag malayalam-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ലളിതമായ ആശയം &amp; കർമ്മശാസ്ത്ര വിധികൾ (മലയാളത്തിൽ)
              </div>
              <p class="malayalam-text">
                ${sec.malayalam}
              </p>
            </div>

            <!-- 4. Fiqh & Exam Notes -->
            ${sec.fiqhNotes ? `
              <div class="fiqh-notes-box" style="background:#eef6f9; border-left:4px solid #1a4356; padding:0.9rem 1.2rem; border-radius:6px; margin-top:1rem; font-size:0.92rem; color:#1a4356;">
                <strong>💡 പരീക്ഷാ ഓർമ്മക്കുറിപ്പ്:</strong> ${sec.fiqhNotes}
              </div>
            ` : ""}

          </div>
        </article>
      `).join("");
    }

    let predictionsHtml = "";
    if (book.examPredictions && book.examPredictions.length > 0) {
      predictionsHtml = `
        <div class="exam-prediction-card">
          <div class="exam-prediction-title">
            <span>🎯 പരീക്ഷാ ചോദ്യ മാതൃകകളും ഉത്തരങ്ങളും (JJC Exam Predicted Questions):</span>
          </div>
          <div class="predictions-list">
            ${book.examPredictions.map((p, idx) => `
              <div class="prediction-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; flex-wrap:wrap; gap:0.4rem;">
                  <span style="font-size:0.78rem; font-weight:700; color:var(--accent-gold-dark); background:var(--accent-gold-light); padding:0.15rem 0.6rem; border-radius:999px; border:1px solid var(--accent-gold-border);">
                    ${p.pattern}
                  </span>
                  <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">ചോദ്യം ${idx + 1}</span>
                </div>
                <div class="prediction-item-q">${p.q}</div>
                <div class="prediction-item-a"><strong>ഉത്തരം:</strong> ${p.a}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    contentAreaEl.innerHTML = `
      <section class="chapter-hero">
        <div class="chapter-hero-meta">
          <span class="chapter-hero-badge">സ്വഹീഹുൽ ബുഖാരി | കിതാബ് ${book.order}</span>
          <span class="chapter-hero-portion">${book.hadithRange} • ${book.sections ? book.sections.length : 0} പ്രധാന ഹദീഥുകൾ</span>
        </div>
        <h1 class="chapter-hero-title-ar">${book.titleArabic}</h1>
        <h2 class="chapter-hero-title-ml">${book.titleMalayalam}</h2>
        <p class="chapter-hero-desc">${book.descMalayalam}</p>
        <div style="margin-top:1.2rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
          <a href="papers/hadees/index.html" class="btn btn-sm" style="background:rgba(255,255,255,0.2); color:#ffffff; border:1px solid rgba(255,255,255,0.4); text-decoration:none; border-radius:var(--radius-sm); font-weight:600;">
            📝 ഈ കിതാബിലെ മുൻവർഷ ചോദ്യങ്ങൾ കാണുക
          </a>
        </div>
      </section>

      <!-- Chapter Tabs: Notes & Exam Patterns vs Important Hadiths -->
      <div class="chapter-tabs-bar">
        <button class="chapter-tab-btn active" id="btnTabNotes" data-target="panelNotes">
          📌 കിതാബ് നോട്‌സും പരീക്ഷാ മാതൃകകളും (Chapter Notes &amp; Exam Pattern)
        </button>
        <button class="chapter-tab-btn" id="btnTabHadiths" data-target="panelHadiths">
          📜 പ്രധാനപ്പെട്ട ഹദീഥുകൾ (${book.sections ? book.sections.length : 0})
        </button>
      </div>

      <!-- Panel 1: Notes & Exam Patterns (Default View) -->
      <div class="chapter-tab-panel" id="panelNotes">
        ${keyPointsHtml}
        ${predictionsHtml}

        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:2rem; text-align:center;">
          <h3 style="font-size:1.15rem; color:#163e50; margin-bottom:0.5rem; font-weight:700;">ഈ കിതാബിലെ പ്രധാനപ്പെട്ട ഹദീഥുകളുടെ അറബിക് മത്‌നും ഫത്ഹുൽ ബാരി ശറഹും പഠിക്കാം</h3>
          <p style="color:var(--text-muted); font-size:0.92rem; margin-bottom:1rem;">തിരഞ്ഞെടുത്ത പ്രധാന ഹദീഥുകൾ, അവയുടെ നിവേദക പരമ്പര, ഫത്ഹുൽ ബാരി ശറഹ് ഹൈലൈറ്റുകൾ, ലളിതമായ മലയാള ആശയം എന്നിവ പരിശോധിക്കുക.</p>
          <button class="btn btn-primary" id="jumpToHadithsBtn" style="background:#163e50; color:#fff; border:none; padding:0.65rem 1.4rem; border-radius:var(--radius-sm); font-weight:700; cursor:pointer;">
            📜 പ്രധാനപ്പെട്ട ഹദീഥുകൾ വായിക്കുക (${book.sections ? book.sections.length : 0} ഹദീഥുകൾ) ➔
          </button>
        </div>
      </div>

      <!-- Panel 2: Hadiths List -->
      <div class="chapter-tab-panel" id="panelHadiths" style="display:none;">
        <div class="fasl-cards-container view-${currentViewMode}">
          ${hadithsHtml}
        </div>
      </div>
    `;

    // Tab switching logic
    const tabNotesBtn = document.getElementById("btnTabNotes");
    const tabHadithsBtn = document.getElementById("btnTabHadiths");
    const panelNotes = document.getElementById("panelNotes");
    const panelHadiths = document.getElementById("panelHadiths");
    const jumpBtn = document.getElementById("jumpToHadithsBtn");

    function showTab(tabName) {
      if (tabName === 'hadiths') {
        tabNotesBtn.classList.remove('active');
        tabHadithsBtn.classList.add('active');
        panelNotes.style.display = 'none';
        panelHadiths.style.display = 'block';
      } else {
        tabHadithsBtn.classList.remove('active');
        tabNotesBtn.classList.add('active');
        panelHadiths.style.display = 'none';
        panelNotes.style.display = 'block';
      }
    }

    if (tabNotesBtn) tabNotesBtn.addEventListener("click", () => showTab('notes'));
    if (tabHadithsBtn) tabHadithsBtn.addEventListener("click", () => showTab('hadiths'));
    if (jumpBtn) {
      jumpBtn.addEventListener("click", () => {
        showTab('hadiths');
        window.scrollTo({ top: panelHadiths.offsetTop - 80, behavior: "smooth" });
      });
    }

    // Attach event listeners for audio, copy, and sharh toggles
    attachCardListeners();
  }

  // Attach card interaction listeners
  function attachCardListeners() {
    // 1. Audio recitation (TTS)
    document.querySelectorAll(".play-audio-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const textToSpeak = decodeURIComponent(btn.dataset.text);
        playArabicSpeech(textToSpeak, btn);
      });
    });

    // 2. Copy Matn text
    document.querySelectorAll(".copy-text-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const textToCopy = decodeURIComponent(btn.dataset.text);
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("മത്‌ൻ ക്ലിപ്പ്ബോർഡിലേക്ക് കോപ്പി ചെയ്തു!");
        }).catch(() => {
          showToast("കോപ്പി ചെയ്യാൻ സാധിച്ചില്ല.");
        });
      });
    });

    // 3. Toggle Sharh block visibility
    document.querySelectorAll(".toggle-sharh-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetCardId = btn.dataset.target;
        const card = document.getElementById(targetCardId);
        if (card) {
          const sharhBlock = card.querySelector(".sharh-block");
          if (sharhBlock) {
            sharhBlock.classList.toggle("sharh-collapsed");
            const isCollapsed = sharhBlock.classList.contains("sharh-collapsed");
            btn.innerHTML = isCollapsed
              ? "📖 ശറഹ് (ഫത്‌ഹുൽ ബാരി) കാണുക"
              : "📕 ശറഹ് മറക്കുക";
          }
        }
      });
    });
  }

  // Arabic Text-to-Speech
  function playArabicSpeech(text, btnElement) {
    if (!("speechSynthesis" in window)) {
      showToast("നിങ്ങളുടെ ബ്രൗസർ ഓഡിയോ സപ്പോർട്ട് ചെയ്യുന്നില്ല.");
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      document.querySelectorAll(".play-audio-btn").forEach(b => b.classList.remove("playing"));
      return;
    }

    const cleanText = text.replace(/[\u064B-\u065F\u0670]/g, ""); // Optionally clean diacritics for smoother TTS
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onstart = () => {
      if (btnElement) btnElement.classList.add("playing");
      showToast("ഓഡിയോ വായിക്കുന്നു...");
    };

    utterance.onend = () => {
      if (btnElement) btnElement.classList.remove("playing");
    };

    utterance.onerror = () => {
      if (btnElement) btnElement.classList.remove("playing");
      showToast("ഓഡിയോ പ്ലേ ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു.");
    };

    activeAudioUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // View Mode Switcher
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentViewMode = btn.dataset.view;

      const container = document.querySelector(".fasl-cards-container");
      if (container) {
        container.className = `fasl-cards-container view-${currentViewMode}`;
      }

      // If switching to 'all' or 'sharh', ensure sharh blocks are expanded
      if (currentViewMode === "all" || currentViewMode === "sharh") {
        document.querySelectorAll(".sharh-block").forEach(sb => sb.classList.remove("sharh-collapsed"));
      } else if (currentViewMode === "easy") {
        document.querySelectorAll(".sharh-block").forEach(sb => sb.classList.add("sharh-collapsed"));
      }

      showToast(`മോഡ് മാറ്റി: ${btn.textContent.trim()}`);
    });
  });

  // Search Functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        renderCurrentBook();
        return;
      }
      performSearch(query);
    });
  }

  function performSearch(query) {
    if (!contentAreaEl) return;
    const results = [];

    HADEES_DATA.forEach((book) => {
      if (book.sections) {
        book.sections.forEach((sec) => {
          const matchMatn = sec.matn.toLowerCase().includes(query);
          const matchSharh = sec.sharh.toLowerCase().includes(query);
          const matchMalayalam = sec.malayalam.toLowerCase().includes(query);
          const matchBabAr = sec.babArabic.toLowerCase().includes(query);
          const matchBabMl = sec.babMalayalam.toLowerCase().includes(query);
          const matchNumber = sec.hadithNumber.toString() === query;

          if (matchMatn || matchSharh || matchMalayalam || matchBabAr || matchBabMl || matchNumber) {
            results.push({ book, sec });
          }
        });
      }
    });

    if (results.length === 0) {
      contentAreaEl.innerHTML = `
        <div class="search-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3>ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</h3>
          <p>"${query}" എന്നതിന് അനുയോജ്യമായ ഹദീഥുകളോ ബാബുകളോ ലഭ്യമല്ല. മറ്റൊരു പദം നൽകി തിരയുക.</p>
        </div>
      `;
      return;
    }

    contentAreaEl.innerHTML = `
      <div class="search-results-header">
        <h2>തിരച്ചിൽ ഫലങ്ങൾ: "${query}"</h2>
        <span class="badge badge-gold">${results.length} ഹദീഥുകൾ കണ്ടെത്തി</span>
      </div>
      <div class="fasl-cards-container view-${currentViewMode}">
        ${results.map(({ book, sec }) => `
          <article class="fasl-card" id="sec_${sec.subId}">
            <header class="fasl-card-header">
              <div class="fasl-header-top">
                <span class="fasl-number-badge">${book.titleMalayalam} | ഹദീഥ്: ${sec.hadithNumber}</span>
                <span class="badge" style="background:#1a4356; color:#fff;">${book.titleArabic}</span>
              </div>
              <h3 class="fasl-title-ar">${sec.babArabic}</h3>
              <div class="fasl-title-ml">${sec.babMalayalam}</div>
            </header>
            <div class="fasl-card-body">
              <div class="text-block matn-block">
                <p class="arabic-text matn-text" style="font-size: ${currentArabicSize}rem;">${sec.matn}</p>
              </div>
              <div class="text-block malayalam-block">
                <p class="malayalam-text">${sec.malayalam}</p>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;

    attachCardListeners();
  }

  // Font Size Scaling
  if (fontIncBtn) {
    fontIncBtn.addEventListener("click", () => {
      if (currentArabicSize < 2.3) {
        currentArabicSize += 0.12;
        updateArabicFontSize();
      }
    });
  }

  if (fontDecBtn) {
    fontDecBtn.addEventListener("click", () => {
      if (currentArabicSize > 1.1) {
        currentArabicSize -= 0.12;
        updateArabicFontSize();
      }
    });
  }

  function updateArabicFontSize() {
    document.querySelectorAll(".matn-text").forEach(el => {
      el.style.fontSize = `${currentArabicSize}rem`;
    });
    document.querySelectorAll(".sharh-text").forEach(el => {
      el.style.fontSize = `${currentArabicSize * 0.9}rem`;
    });
    showToast(`അക്ഷര വലിപ്പം: ${(currentArabicSize * 16).toFixed(0)}px`);
  }

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
      localStorage.setItem("jjc_theme", isDarkMode ? "dark" : "light");
      showToast(isDarkMode ? "ഡാർക്ക് മോഡ് സജീവമാക്കി" : "ലൈറ്റ് മോഡ് സജീവമാക്കി");
    });

    const savedTheme = localStorage.getItem("jjc_theme");
    if (savedTheme === "dark") {
      isDarkMode = true;
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  // Glossary Modal
  if (glossaryBtn && glossaryModal) {
    glossaryBtn.addEventListener("click", () => {
      renderGlossary();
      glossaryModal.classList.add("active");
    });
  }

  if (modalCloseBtn && glossaryModal) {
    modalCloseBtn.addEventListener("click", () => {
      glossaryModal.classList.remove("active");
    });
  }

  if (glossaryModal) {
    glossaryModal.addEventListener("click", (e) => {
      if (e.target === glossaryModal) {
        glossaryModal.classList.remove("active");
      }
    });
  }

  function renderGlossary() {
    if (!glossaryListEl || typeof HADEES_GLOSSARY === "undefined") return;
    glossaryListEl.innerHTML = HADEES_GLOSSARY.map(item => `
      <div class="glossary-item">
        <div class="glossary-header">
          <span class="glossary-ar">${item.termArabic}</span>
          <span class="glossary-ml">${item.termMalayalam}</span>
        </div>
        <div class="glossary-def">${item.definition}</div>
      </div>
    `).join("");
  }

  // Initial Boot
  renderSidebar();
  renderCurrentBook();
});
