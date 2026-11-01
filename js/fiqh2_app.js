/**
 * Fiqh 2 (Sharh al-Mahalli Part 4: Kitab al-Raj'ah to Kitab al-Nafaqat) Interactive Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentChapterId = FIQH2_DATA[0].id;
  let currentViewMode = "easy"; // 'easy' (Matn + Simple Mas'ala), 'matn', 'sharh', 'malayalam', 'all'
  let currentArabicSize = 1.55;
  let isDarkMode = false;
  let activeAudioUtterance = null;

  // DOM Elements
  const chaptersListEl = document.getElementById("chapterNavList");
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

  // Show Toast
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2400);
  }

  // Render Sidebar with Chapter and all its Fasls
  function renderSidebar() {
    if (!chaptersListEl) return;
    chaptersListEl.innerHTML = "";
    FIQH2_DATA.forEach((chap) => {
      const isCurrent = chap.id === currentChapterId;
      const li = document.createElement("li");
      li.className = `chapter-nav-item ${isCurrent ? "active" : ""}`;
      li.dataset.chapId = chap.id;

      // Sub-list for fasls of this chapter
      let faslListHtml = "";
      if (chap.sections && chap.sections.length > 0) {
        faslListHtml = `
          <ul class="sidebar-fasl-list" style="${isCurrent ? 'display: flex;' : 'display: none;'}">
            ${chap.sections.map((s, idx) => `
              <li class="sidebar-fasl-item" data-sec-id="${s.subId}" title="${s.subtitleMalayalam}">
                ${idx + 1}. ${s.subtitleArabic.replace('فصل: ', '')}
              </li>
            `).join("")}
          </ul>
        `;
      }

      li.innerHTML = `
        <div class="chap-nav-header">
          <span class="chap-nav-num">ബാബ് ${chap.order} (${chap.sections ? chap.sections.length : 0} ഫസ്ലുകൾ)</span>
          <span class="chap-nav-ar">${chap.titleArabic}</span>
          <span class="chap-nav-ml">${chap.titleMalayalam}</span>
        </div>
        ${faslListHtml}
      `;

      // Chapter click
      li.querySelector(".chap-nav-header").addEventListener("click", () => {
        if (currentChapterId !== chap.id) {
          currentChapterId = chap.id;
          renderSidebar();
          renderCurrentChapter();
          window.scrollTo({ top: document.querySelector(".sticky-nav").offsetTop - 10, behavior: "smooth" });
        }
      });

      // Fasl item clicks inside sidebar
      li.querySelectorAll(".sidebar-fasl-item").forEach(faslItem => {
        faslItem.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetSecId = faslItem.dataset.secId;
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

      chaptersListEl.appendChild(li);
    });
  }

  // Render Current Chapter
  function renderCurrentChapter(filterQuery = "") {
    const chapter = FIQH2_DATA.find((c) => c.id === currentChapterId);
    if (!chapter) return;

    let sections = chapter.sections || [];
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().trim();
      sections = sections.filter(sec => 
        sec.matn.toLowerCase().includes(q) ||
        sec.sharh.toLowerCase().includes(q) ||
        sec.malayalam.toLowerCase().includes(q) ||
        sec.subtitleArabic.toLowerCase().includes(q) ||
        sec.subtitleMalayalam.toLowerCase().includes(q)
      );
    }

    const keyPointsHtml = chapter.keyPoints && chapter.keyPoints.length > 0 ? `
      <div class="chap-key-points">
        <div class="chap-key-points-title">പ്രധാന വിഷയങ്ങൾ (ഖുലാസ):</div>
        <ul>
          ${chapter.keyPoints.map(kp => `<li>${kp}</li>`).join("")}
        </ul>
      </div>
    ` : "";

    // Fasl Quick Jump navigation bar
    const faslsJumpHtml = chapter.sections && chapter.sections.length > 0 ? `
      <div class="fasl-nav-wrapper">
        <div class="fasl-nav-label">
          <span>📜 ഈ ബാബിലെ മുഴുവൻ ഫസ്ലുകൾ (${chapter.sections.length} ഫസ്ലുകൾ):</span>
        </div>
        <div class="fasl-nav-pills">
          ${chapter.sections.map((s, idx) => `
            <a href="#sec_${s.subId}" class="fasl-pill" title="${s.subtitleMalayalam}">
              <span class="num">${idx + 1}.</span> ${s.subtitleArabic.replace('فصل: ', '')}
            </a>
          `).join("")}
        </div>
      </div>
    ` : "";

    const sectionsHtml = sections.length > 0 ? sections.map((sec, idx) => `
      <article class="section-card" id="sec_${sec.subId}">
        <div class="section-card-header">
          <div class="sec-titles">
            <h3 class="sec-title-ar">${sec.subtitleArabic}</h3>
            <span class="sec-title-ml">${idx + 1}. ${sec.subtitleMalayalam}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon-action btn-copy-matn" title="മത്‌ൻ കോപ്പി ചെയ്യുക" data-text="${escapeQuotes(sec.matn)}">
              📜
            </button>
            <button class="btn-icon-action btn-copy-all" title="മുഴുവൻ വിവരങ്ങളും കോപ്പി ചെയ്യുക" data-id="${sec.subId}">
              📋
            </button>
            <button class="btn-icon-action btn-tts" title="അറബിക് കേൾക്കുക" data-arabic="${escapeQuotes(sec.matn)}">
              🔊
            </button>
          </div>
        </div>

        <div class="section-body">
          <!-- 1. Matn Section (Minhaj al-Talibin - Imam Nawawi) -->
          <div class="box-matn">
            <span class="box-label label-matn">📜 മത്‌നുൽ മിൻഹാജ് (الإمام النووي)</span>
            <div class="arabic-text matn-text">${sec.matn}</div>
          </div>

          <!-- 2. Malayalam Translation & Mas'ala Explanation -->
          <div class="box-malayalam">
            <span class="box-label label-trans">🌐 ലളിതമായ കർമ്മശാസ്ത്ര മസ്അല വിശദീകരണം</span>
            <div class="malayalam-text">${sec.malayalam}</div>
          </div>

          <!-- Toggle Sharh Button -->
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-toggle-sharh" data-target="sharh_${sec.subId}">
              📖 ശറഹുൽ മഹല്ലി ഇബാറത്ത് കാണുക / മറക്കുക
            </button>
          </div>

          <!-- 3. Sharh Section (Kanz al-Raghibin - Al-Mahalli) -->
          <div class="box-sharh" id="sharh_${sec.subId}">
            <span class="box-label label-sharh">🖋️ ശറഹുൽ മഹല്ലി (الإمام جلال الدين المحلي)</span>
            <div class="arabic-text sharh-text">${formatSharhText(sec.sharh)}</div>
          </div>

          <!-- 4. Fiqh Notes Callout -->
          ${sec.fiqhNotes ? `
            <div class="box-fiqh-notes">
              <span class="box-label label-notes">💡 മഹല്ലി ഫവാഇദ് / പരീക്ഷാ പോയിന്റ്</span>
              <div class="fiqh-notes-text">${sec.fiqhNotes}</div>
            </div>
          ` : ""}
        </div>
      </article>
    `).join("") : `
      <div style="text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <p style="font-size: 1.1rem; color: var(--text-muted); font-family: var(--font-malayalam);">
          തിരഞ്ഞ പദങ്ങൾ ഈ ബാബിൽ കണ്ടെത്താനായില്ല. ദയവായി മറ്റൊന്ന് തിരയുക.
        </p>
      </div>
    `;

    contentAreaEl.innerHTML = `
      <section class="chapter-header-card">
        <span class="chap-badge">ബാബ് ${chapter.order} • ഫിഖ്ഹ് 2 (ഭാഗം 4)</span>
        <h2 class="chap-title-ar">${chapter.titleArabic}</h2>
        <h3 class="chap-title-ml">${chapter.titleMalayalam}</h3>
        <p class="chap-desc">${chapter.descMalayalam}</p>
        ${keyPointsHtml}
        ${faslsJumpHtml}
      </section>

      <div class="sections-container">
        ${sectionsHtml}
      </div>
    `;

    // Apply current font size
    applyArabicFontSize();

    // Attach listeners to newly rendered elements
    attachCardListeners();
  }

  // Escape quotes for HTML attributes
  function escapeQuotes(str) {
    if (!str) return "";
    return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Attach Card Actions Listeners
  function attachCardListeners() {
    // Copy Matn
    document.querySelectorAll(".btn-copy-matn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          showToast("മത്‌ൻ കോപ്പി ചെയ്തു ✓");
        });
      });
    });

    // Copy All
    document.querySelectorAll(".btn-copy-all").forEach((btn) => {
      btn.addEventListener("click", () => {
        const subId = btn.dataset.id;
        const chapter = FIQH2_DATA.find((c) => c.id === currentChapterId);
        const sec = chapter.sections.find((s) => s.subId === subId);
        if (sec) {
          const fullText = `[${sec.subtitleArabic} - ${sec.subtitleMalayalam}]\n\n*മത്‌ൻ:*\n${sec.matn}\n\n*ശറഹ്:*\n${sec.sharh}\n\n*ലളിത മസ്അല:*\n${sec.malayalam}\n\n*ഫവാഇദ്:*\n${sec.fiqhNotes || ""}`;
          navigator.clipboard.writeText(fullText).then(() => {
            showToast("മുഴുവൻ വിവരങ്ങളും കോപ്പി ചെയ്തു ✓");
          });
        }
      });
    });

    // Toggle single card Sharh
    document.querySelectorAll(".btn-toggle-sharh").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.toggle("show-sharh");
          if (targetEl.classList.contains("show-sharh")) {
            btn.textContent = "🔼 ശറഹുൽ മഹല്ലി ഇബാറത്ത് മറക്കുക";
            btn.style.background = "var(--primary-emerald)";
            btn.style.color = "#ffffff";
          } else {
            btn.textContent = "📖 ശറഹുൽ മഹല്ലി ഇബാറത്ത് കാണുക / മറക്കുക";
            btn.style.background = "";
            btn.style.color = "";
          }
        }
      });
    });

    // TTS Arabic
    document.querySelectorAll(".btn-tts").forEach((btn) => {
      btn.addEventListener("click", () => {
        const arabicText = btn.dataset.arabic;
        if (!("speechSynthesis" in window)) {
          showToast("നിങ്ങളുടെ ബ്രൗസറിൽ ഓഡിയോ വോയിസ് ലഭ്യമല്ല");
          return;
        }

        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          showToast("ഓഡിയോ നിർത്തി");
          return;
        }

        const utterance = new SpeechSynthesisUtterance(arabicText);
        utterance.lang = "ar-SA";
        utterance.rate = 0.85;

        utterance.onstart = () => showToast("അറബിക് വായിക്കുന്നു... 🔊");
        utterance.onend = () => showToast("വായന പൂർത്തിയായി ✓");
        utterance.onerror = () => showToast("ഓഡിയോ പ്ലേ ചെയ്യുന്നതിൽ തകരാർ");

        window.speechSynthesis.speak(utterance);
      });
    });
  }

  // Switch View Mode
  function setViewMode(mode) {
    currentViewMode = mode;
    contentAreaEl.className = `content-area view-${mode}`;

    viewBtns.forEach((btn) => {
      if (btn.dataset.mode === mode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const modeLabels = {
      easy: "✨ ലളിത പഠനം (മത്‌നും മസ്അലയും)",
      matn: "📜 മത്‌ൻ മാത്രം",
      sharh: "🖋️ മഹല്ലി ശറഹ്",
      malayalam: "🌐 മലയാളം മാത്രം",
      all: "📖 ത്രിമാന പഠനം (All)"
    };
    showToast(`മോഡ് മാറ്റി: ${modeLabels[mode] || mode}`);
  }

  // Arabic Font Size Controls
  function applyArabicFontSize() {
    document.querySelectorAll(".arabic-text").forEach((el) => {
      el.style.fontSize = `${currentArabicSize}rem`;
    });
  }

  fontIncBtn.addEventListener("click", () => {
    if (currentArabicSize < 2.4) {
      currentArabicSize += 0.15;
      applyArabicFontSize();
      showToast(`അക്ഷര വലുപ്പം: ${(currentArabicSize * 100 / 1.55).toFixed(0)}%`);
    }
  });

  fontDecBtn.addEventListener("click", () => {
    if (currentArabicSize > 1.1) {
      currentArabicSize -= 0.15;
      applyArabicFontSize();
      showToast(`അക്ഷര വലുപ്പം: ${(currentArabicSize * 100 / 1.55).toFixed(0)}%`);
    }
  });

  // Dark/Light Theme Toggle
  themeToggleBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      themeToggleBtn.innerHTML = "☀️ ലൈറ്റ്";
      showToast("ഡാർക്ക് മോഡ് സജീവമാക്കി 🌙");
    } else {
      document.body.classList.remove("dark-mode");
      themeToggleBtn.innerHTML = "🌙 ഡാർക്ക്";
      showToast("ലൈറ്റ് മോഡ് സജീവമാക്കി ☀️");
    }
  });

  // Search Filter with Debounce
  let searchDebounceTimeout = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
      renderCurrentChapter(e.target.value);
    }, 280);
  });

  // View Buttons
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setViewMode(btn.dataset.mode);
    });
  });

  // Glossary Modal
  function populateGlossary() {
    if (!glossaryListEl) return;
    glossaryListEl.innerHTML = "";
    FIQH2_GLOSSARY.forEach((item) => {
      const card = document.createElement("div");
      card.className = "glossary-item";
      card.innerHTML = `
        <div class="glossary-term-ar">${item.term}</div>
        <div class="glossary-term-ml">${item.trans}</div>
        <p class="glossary-term-desc">${item.meaning}</p>
      `;
      glossaryListEl.appendChild(card);
    });
  }

  glossaryBtn.addEventListener("click", () => {
    populateGlossary();
    glossaryModal.classList.add("show");
  });

  modalCloseBtn.addEventListener("click", () => {
    glossaryModal.classList.remove("show");
  });

  glossaryModal.addEventListener("click", (e) => {
    if (e.target === glossaryModal) {
      glossaryModal.classList.remove("show");
    }
  });

  // Set default view mode to "easy"
  setViewMode("easy");

  // Initial Render
  renderSidebar();
  renderCurrentChapter();
});
