/**
 * Kitab al-Mahalli - Shafi'i Fiqh Interactive Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentChapterId = KITHAB_DATA[0].id;
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
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2400);
  }

  // Render Sidebar with Chapter and all its Fasls
  function renderSidebar() {
    chaptersListEl.innerHTML = "";
    KITHAB_DATA.forEach((chap) => {
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
    const chapter = KITHAB_DATA.find((c) => c.id === currentChapterId);
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

          <!-- Toggle Sharh Button (for quick reading without clutter) -->
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
      <div style="padding: 3rem; text-align: center; background: var(--bg-surface); border-radius: var(--radius-md);">
        <p style="font-size: 1.1rem; color: var(--text-muted);">തിരഞ്ഞ വാക്കിന് അനുയോജ്യമായ വിഷയങ്ങൾ ഈ അധ്യായത്തിൽ കണ്ടെത്താനായില്ല.</p>
      </div>
    `;

    contentAreaEl.innerHTML = `
      <div class="chapter-banner">
        <div class="chap-badge-row">
          <span class="chap-pill">ഭാഗം 3: അധ്യായം ${chapter.order}</span>
          <span style="font-size: 0.85rem; color: var(--accent-gold-dark); font-weight: 700;">കൻസുർറാഗിബീൻ ശറഹു മിൻഹാജിത്ത്വാലിബീൻ</span>
        </div>
        <h2 class="chap-title-arabic">${chapter.titleArabic}</h2>
        <h3 class="chap-title-malayalam">${chapter.titleMalayalam}</h3>
        <p class="chap-desc-malayalam">${chapter.descMalayalam}</p>
        ${keyPointsHtml}
        ${faslsJumpHtml}
      </div>

      <div class="sections-container" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${sectionsHtml}
      </div>
    `;

    // Apply current view mode class to content area
    updateViewModeClass();

    // Attach listeners to cards
    attachCardEvents(sections);
  }

  function escapeQuotes(str) {
    return (str || "").replace(/"/g, '&quot;');
  }

  function attachCardEvents(sections) {
    // Copy Matn
    document.querySelectorAll(".btn-copy-matn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        navigator.clipboard.writeText(text).then(() => {
          showToast("മത്‌ൻ ക്ലിപ്പ്ബോർഡിലേക്ക് കോപ്പി ചെയ്തു!");
        });
      });
    });

    // Copy All
    document.querySelectorAll(".btn-copy-all").forEach(btn => {
      btn.addEventListener("click", () => {
        const secId = btn.dataset.id;
        const sec = sections.find(s => s.subId === secId);
        if (sec) {
          const fullText = `[മത്‌നുൽ മിൻഹാജ്]\n${sec.matn}\n\n[ലളിത മസ്അല]\n${sec.malayalam}\n\n[ശറഹുൽ മഹല്ലി]\n${sec.sharh}`;
          navigator.clipboard.writeText(fullText).then(() => {
            showToast("പൂർണ്ണ രൂപം കോപ്പി ചെയ്തു!");
          });
        }
      });
    });

    // Toggle Sharh In-place Button
    document.querySelectorAll(".btn-toggle-sharh").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.classList.toggle("show-sharh");
          if (targetEl.classList.contains("show-sharh")) {
            btn.textContent = "✖ ശറഹുൽ മഹല്ലി മറക്കുക";
          } else {
            btn.textContent = "📖 ശറഹുൽ മഹല്ലി ഇബാറത്ത് കാണുക";
          }
        }
      });
    });

    // TTS Audio
    document.querySelectorAll(".btn-tts").forEach(btn => {
      btn.addEventListener("click", () => {
        const arabicText = btn.dataset.arabic;
        playArabicTTS(arabicText, btn);
      });
    });
  }

  // Audio TTS
  function playArabicTTS(text, btnElement) {
    if (!('speechSynthesis' in window)) {
      showToast("ബ്രൗസറിൽ വോയ്സ് റീഡർ ലഭ്യമല്ല.");
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      if (activeAudioUtterance && activeAudioUtterance.btnRef === btnElement) {
        btnElement.textContent = "🔊";
        activeAudioUtterance = null;
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    btnElement.textContent = "⏹️";
    activeAudioUtterance = { utterance, btnRef: btnElement };

    utterance.onend = () => {
      btnElement.textContent = "🔊";
      activeAudioUtterance = null;
    };

    utterance.onerror = () => {
      btnElement.textContent = "🔊";
      activeAudioUtterance = null;
      showToast("ഓഡിയോ വായിക്കുന്നതിൽ തടസ്സം നേരിട്ടു.");
    };

    speechSynthesis.speak(utterance);
  }

  // View Mode Change
  function updateViewModeClass() {
    contentAreaEl.classList.remove("view-all", "view-easy", "view-matn", "view-sharh", "view-malayalam");
    contentAreaEl.classList.add(`view-${currentViewMode}`);
  }

  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentViewMode = btn.dataset.mode;
      updateViewModeClass();
    });
  });

  // Search filter
  searchInput.addEventListener("input", (e) => {
    renderCurrentChapter(e.target.value);
  });

  // Font resize
  fontIncBtn.addEventListener("click", () => {
    if (currentArabicSize < 2.3) {
      currentArabicSize += 0.15;
      document.documentElement.style.setProperty("--arabic-size", `${currentArabicSize}rem`);
      showToast(`അറബി ഫോണ്ട് വലുപ്പം: ${Math.round(currentArabicSize * 16)}px`);
    }
  });

  fontDecBtn.addEventListener("click", () => {
    if (currentArabicSize > 1.2) {
      currentArabicSize -= 0.15;
      document.documentElement.style.setProperty("--arabic-size", `${currentArabicSize}rem`);
      showToast(`അറബി ഫോണ്ട് വലുപ്പം: ${Math.round(currentArabicSize * 16)}px`);
    }
  });

  // Dark/Light Theme
  themeToggleBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
      themeToggleBtn.innerHTML = "☀️ ലൈറ്റ്";
    } else {
      document.body.removeAttribute("data-theme");
      themeToggleBtn.innerHTML = "🌙 ഡാർക്ക്";
    }
  });

  // Fiqh Glossary
  function populateGlossary() {
    glossaryListEl.innerHTML = GLOSSARY.map(g => `
      <div class="glossary-item">
        <div class="glossary-term">${g.term}</div>
        <div class="glossary-meaning">${g.meaning}</div>
      </div>
    `).join("");
  }

  glossaryBtn.addEventListener("click", () => {
    populateGlossary();
    glossaryModal.classList.add("active");
  });

  modalCloseBtn.addEventListener("click", () => {
    glossaryModal.classList.remove("active");
  });

  glossaryModal.addEventListener("click", (e) => {
    if (e.target === glossaryModal) {
      glossaryModal.classList.remove("active");
    }
  });

  // Initialize
  renderSidebar();
  renderCurrentChapter();
});
