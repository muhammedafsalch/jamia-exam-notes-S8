/**
 * Aqeedah Interactive Controller (Sharh al-Aqa'id al-Nasafiyyah Digital Portal)
 * Jamia Nooriya Coordination (JJC) Curriculum
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentChapId = AQEEDAH_DATA[0].id;
  let currentViewMode = "easy"; // 'easy', 'matn', 'sharh', 'malayalam', 'all'
  let currentArabicSize = 1.55;
  let isDarkMode = false;

  // DOM Elements
  const chapListEl = document.getElementById("chapNavList");
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

  // Render Sidebar
  function renderSidebar() {
    if (!chapListEl) return;
    chapListEl.innerHTML = "";
    AQEEDAH_DATA.forEach((chap) => {
      const isCurrent = chap.id === currentChapId;
      const li = document.createElement("li");
      li.className = `chapter-nav-item ${isCurrent ? "active" : ""}`;
      li.dataset.chapId = chap.id;

      let subListHtml = "";
      if (chap.sections && chap.sections.length > 0) {
        subListHtml = `
          <ul class="sidebar-fasl-list" style="${isCurrent ? 'display: flex;' : 'display: none;'}">
            ${chap.sections.map((s) => `
              <li class="sidebar-fasl-item" data-sec-id="${s.subId}" title="${s.sectionTitleMl}">
                § ${s.sectionTitleAr.slice(0, 30)}...
              </li>
            `).join("")}
          </ul>
        `;
      }

      li.innerHTML = `
        <div class="chap-nav-header">
          <span class="chap-nav-num">ബാബ് ${chap.order}</span>
          <span class="chap-nav-ar">${chap.titleArabic}</span>
          <span class="chap-nav-ml">${chap.titleMalayalam}</span>
        </div>
        ${subListHtml}
      `;

      li.querySelector(".chap-nav-header").addEventListener("click", () => {
        if (currentChapId !== chap.id) {
          currentChapId = chap.id;
          renderSidebar();
          renderCurrentChap();
          const stickyNav = document.querySelector(".sticky-nav");
          if (stickyNav) {
            window.scrollTo({ top: stickyNav.offsetTop - 10, behavior: "smooth" });
          }
        }
      });

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

      chapListEl.appendChild(li);
    });
  }

  // Render Current Chapter
  function renderCurrentChap() {
    if (!contentAreaEl) return;
    const chap = AQEEDAH_DATA.find((c) => c.id === currentChapId);
    if (!chap) return;

    let sectionsHtml = "";
    if (chap.sections && chap.sections.length > 0) {
      sectionsHtml = chap.sections
        .map((s, index) => {
          // Render unshortened definitions
          let defsHtml = "";
          if (s.definitions && s.definitions.length > 0) {
            defsHtml = `
              <div class="definitions-box" style="margin-top: 1.5rem; background: var(--bg-surface); border: 2px solid var(--accent-gold); border-radius: var(--radius-md); padding: 1.25rem 1.5rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px dashed var(--accent-gold-border); padding-bottom: 0.5rem;">
                  <span style="font-weight: 700; color: #58182b; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
                    📖 അഖീദ തഅ്‌രീഫുകൾ (മുഴുവൻ നിർവ്വചനങ്ങളും - Do Not Short):
                  </span>
                  <span style="font-size: 0.78rem; background: var(--accent-gold-light); color: var(--accent-gold-dark); padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700;">
                    ${s.definitions.length} തഅ്‌രീഫുകൾ
                  </span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${s.definitions.map(d => `
                    <div style="background: var(--bg-surface-elevated); border-left: 4px solid var(--accent-gold); padding: 0.85rem 1.1rem; border-radius: var(--radius-sm);">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
                        <span style="font-family: var(--font-arabic); font-size: 1.3rem; font-weight: 700; color: #58182b;">${d.termAr}</span>
                        <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted);">${d.termMl}</span>
                      </div>
                      <div class="arabic-text" style="font-size: 1.25rem; color: #111; line-height: 1.8; margin-bottom: 0.4rem; direction: rtl; text-align: right;">
                        «${d.exactDefinitionAr}»
                      </div>
                      <div class="malayalam-text" style="font-size: 0.93rem; color: var(--text-main); line-height: 1.6;">
                        ${d.definitionMl}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `;
          }

          return `
            <article class="fasl-card" id="sec_${s.subId}">
              <header class="fasl-card-header">
                <div class="fasl-badge">ഖണ്ഡിക ${index + 1}</div>
                <h3 class="fasl-title-ar">${s.sectionTitleAr}</h3>
                <h4 class="fasl-title-ml">${s.sectionTitleMl}</h4>
              </header>

              <div class="fasl-card-body">
                <!-- Matn Card -->
                <div class="text-block block-matn" data-block="matn">
                  <div class="block-tag">
                    <span>مَتْنُ الْعَقَائِدِ النَّسَفِيَّةِ</span>
                    <button class="audio-btn" data-text="${s.matn.replace(/"/g, '&quot;')}" title="മത്‌ൻ ഉച്ചാരണം കേൾക്കുക">🔊 കേൾക്കുക</button>
                  </div>
                  <div class="arabic-text matn-text" style="font-size: ${currentArabicSize}rem;">
                    ${s.matn}
                  </div>
                </div>

                <!-- Sharh Card -->
                <div class="text-block block-sharh" data-block="sharh">
                  <div class="block-tag">
                    <span>شَرْحُ الْعَلَّامَةِ التَّفْتَازَانِيِّ (مَعَ الْخَيَالِيِّ)</span>
                    <button class="audio-btn" data-text="${s.sharh.replace(/"/g, '&quot;')}" title="ശറഹ് കേൾക്കുക">🔊 കേൾക്കുക</button>
                  </div>
                  <div class="arabic-text sharh-text" style="font-size: ${currentArabicSize * 0.95}rem;">
                    ${formatSharhText(s.sharh)}
                  </div>
                </div>

                <!-- Malayalam Translation & Breakdown -->
                <div class="text-block block-trans" data-block="malayalam">
                  <div class="block-tag">
                    <span>മലയാള വിശദീകരണവും സംഗ്രഹവും</span>
                  </div>
                  <div class="malayalam-text">
                    ${s.malayalam}
                  </div>
                  ${s.aqeedahNotes ? `
                    <div class="fiqh-note-box" style="margin-top: 1rem; border-left: 3px solid #58182b; background: rgba(88, 24, 43, 0.05); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
                      <strong>📌 അഖീദ നുറുങ്ങുകൾ (Exam Pointer):</strong> ${s.aqeedahNotes}
                    </div>
                  ` : ''}
                </div>

                <!-- Full Unshortened Definitions -->
                ${defsHtml}
              </div>
            </article>
          `;
        })
        .join("");
    }

    // Key Takeaways & Exam Predictions
    let examBoxHtml = "";
    if (chap.examPredictions && chap.examPredictions.length > 0) {
      examBoxHtml = `
        <div class="exam-prep-box" style="margin: 2rem 0; border: 2px solid var(--accent-gold); border-radius: var(--radius-lg); background: var(--bg-surface); padding: 1.5rem 2rem;">
          <h3 style="color: #58182b; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem; font-size: 1.25rem;">
            <span>🎯</span> പരീക്ഷാ ചോദ്യ മാതൃകകളും ഉത്തരങ്ങളും (${chap.titleMalayalam})
          </h3>
          <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            ${chap.examPredictions.map(p => `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.2rem;">
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--accent-gold-dark); text-transform: uppercase; margin-bottom: 0.4rem;">
                  ⭐ ${p.pattern}
                </div>
                <div style="font-family: var(--font-arabic); font-size: 1.35rem; color: #58182b; font-weight: 700; direction: rtl; margin-bottom: 0.3rem;">
                  ${p.questionAr}
                </div>
                <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.6rem; color: var(--text-main);">
                  ചോദ്യം: ${p.questionMl}
                </div>
                <div style="background: rgba(88, 24, 43, 0.04); border-right: 3px solid #58182b; padding: 0.8rem 1rem; border-radius: 4px; margin-bottom: 0.5rem; direction: rtl; text-align: right; font-family: var(--font-arabic); font-size: 1.2rem;">
                  <strong>الإجابة:</strong> ${p.answerAr}
                </div>
                <div style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;">
                  <strong>ഉത്തരം (മലയാളം):</strong> ${p.answerMl}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    contentAreaEl.innerHTML = `
      <section class="chapter-content-header" style="background: linear-gradient(135deg, rgba(88, 24, 43, 0.08) 0%, rgba(197, 155, 39, 0.08) 100%); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem; border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="chap-badge" style="background: #58182b; color: #fff; padding: 0.25rem 0.8rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">ബാബ് ${chap.order}</span>
            <h2 class="chap-title-ar" style="font-family: var(--font-arabic); font-size: 2.3rem; margin: 0.6rem 0 0.2rem; color: #58182b; line-height: 1.4;">${chap.titleArabic}</h2>
            <h3 class="chap-title-ml" style="font-size: 1.35rem; color: var(--text-main); margin-bottom: 0.8rem;">${chap.titleMalayalam}</h3>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="aqeedah_paper_2025.html" class="exam-paper-link-btn" style="background: #58182b; color: #fff; text-decoration: none; padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.82rem; font-weight: 600;">📝 2025 ചോദ്യങ്ങൾ</a>
            <a href="aqeedah_paper_2024.html" class="exam-paper-link-btn" style="background: var(--accent-gold); color: #000; text-decoration: none; padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">📝 2024 ചോദ്യങ്ങൾ</a>
          </div>
        </div>
        <p class="chap-summary-text" style="font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin: 0.8rem 0 1.2rem;">
          ${chap.summary}
        </p>
        <div class="key-points-pill-list" style="display: flex; flex-direction: column; gap: 0.4rem;">
          ${chap.keyPoints.map(kp => `
            <div style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.9rem; color: var(--text-main);">
              <span style="color: var(--accent-gold); font-size: 1.1rem; line-height: 1.2;">✦</span>
              <span>${kp}</span>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Chapter Sections -->
      <div class="sections-container">
        ${sectionsHtml}
      </div>

      <!-- Exam Prep Box -->
      ${examBoxHtml}

      <!-- Chapter Bottom Navigation -->
      <div class="chapter-bottom-nav" style="display: flex; justify-content: space-between; align-items: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 1rem;">
        ${getPrevChapBtn(chap.order)}
        ${getNextChapBtn(chap.order)}
      </div>
    `;

    applyViewMode(currentViewMode);
    attachAudioListeners();
  }

  function getPrevChapBtn(order) {
    if (order <= 1) return `<div></div>`;
    const prev = AQEEDAH_DATA.find(c => c.order === order - 1);
    if (!prev) return `<div></div>`;
    return `
      <button class="chap-nav-action-btn prev-btn" data-chap-id="${prev.id}" style="padding: 0.6rem 1.2rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
        ← മുൻപത്തെ ബാബ്: ${prev.titleMalayalam}
      </button>
    `;
  }

  function getNextChapBtn(order) {
    if (order >= AQEEDAH_DATA.length) return `<div></div>`;
    const next = AQEEDAH_DATA.find(c => c.order === order + 1);
    if (!next) return `<div></div>`;
    return `
      <button class="chap-nav-action-btn next-btn" data-chap-id="${next.id}" style="padding: 0.6rem 1.2rem; background: #58182b; color: #fff; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
        അടുത്ത ബാബ്: ${next.titleMalayalam} →
      </button>
    `;
  }

  // Handle Bottom Nav clicks
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".chap-nav-action-btn");
    if (btn) {
      currentChapId = btn.dataset.chapId;
      renderSidebar();
      renderCurrentChap();
      const stickyNav = document.querySelector(".sticky-nav");
      if (stickyNav) {
        window.scrollTo({ top: stickyNav.offsetTop - 10, behavior: "smooth" });
      }
    }
  });

  // Apply View Mode
  function applyViewMode(mode) {
    currentViewMode = mode;
    if (!contentAreaEl) return;

    contentAreaEl.classList.remove("view-easy", "view-matn", "view-sharh", "view-malayalam", "view-all");
    contentAreaEl.classList.add(`view-${mode}`);

    viewBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    const cards = contentAreaEl.querySelectorAll(".fasl-card");
    cards.forEach((card) => {
      const matnBlock = card.querySelector(".block-matn");
      const sharhBlock = card.querySelector(".block-sharh");
      const transBlock = card.querySelector(".block-trans");

      if (mode === "easy") {
        if (matnBlock) matnBlock.style.display = "block";
        if (sharhBlock) sharhBlock.style.display = "none";
        if (transBlock) transBlock.style.display = "block";
      } else if (mode === "matn") {
        if (matnBlock) matnBlock.style.display = "block";
        if (sharhBlock) sharhBlock.style.display = "none";
        if (transBlock) transBlock.style.display = "none";
      } else if (mode === "sharh") {
        if (matnBlock) matnBlock.style.display = "block";
        if (sharhBlock) sharhBlock.style.display = "block";
        if (transBlock) transBlock.style.display = "none";
      } else if (mode === "malayalam") {
        if (matnBlock) matnBlock.style.display = "none";
        if (sharhBlock) sharhBlock.style.display = "none";
        if (transBlock) transBlock.style.display = "block";
      } else if (mode === "all") {
        if (matnBlock) matnBlock.style.display = "block";
        if (sharhBlock) sharhBlock.style.display = "block";
        if (transBlock) transBlock.style.display = "block";
      }
    });
  }

  // View Mode Button Listeners
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyViewMode(btn.dataset.mode);
    });
  });

  // Arabic Audio Speech Synthesis
  function attachAudioListeners() {
    const audioBtns = document.querySelectorAll(".audio-btn");
    audioBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.text;
        if (!text) return;

        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "ar-SA";
          utterance.rate = 0.88;

          btn.classList.add("playing");
          btn.textContent = "⏹️ നിർത്തുക";

          utterance.onend = () => {
            btn.classList.remove("playing");
            btn.textContent = "🔊 കേൾക്കുക";
          };
          utterance.onerror = () => {
            btn.classList.remove("playing");
            btn.textContent = "🔊 കേൾക്കുക";
            showToast("ഓഡിയോ പ്ലേ ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു.");
          };

          window.speechSynthesis.speak(utterance);
        } else {
          showToast("നിങ്ങളുടെ ബ്രൗസറിൽ അറബിക് ഓഡിയോ ലഭ്യമല്ല.");
        }
      });
    });
  }

  // Font Size Resizing
  if (fontIncBtn) {
    fontIncBtn.addEventListener("click", () => {
      if (currentArabicSize < 2.3) {
        currentArabicSize += 0.15;
        document.querySelectorAll(".arabic-text").forEach(el => {
          el.style.fontSize = `${currentArabicSize}rem`;
        });
        showToast(`അറബി ഫോണ്ട് വലുതാക്കി: ${currentArabicSize.toFixed(2)}rem`);
      }
    });
  }

  if (fontDecBtn) {
    fontDecBtn.addEventListener("click", () => {
      if (currentArabicSize > 1.1) {
        currentArabicSize -= 0.15;
        document.querySelectorAll(".arabic-text").forEach(el => {
          el.style.fontSize = `${currentArabicSize}rem`;
        });
        showToast(`അറബി ഫോണ്ട് ചെറുതാക്കി: ${currentArabicSize.toFixed(2)}rem`);
      }
    });
  }

  // Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      document.body.dataset.theme = isDarkMode ? "dark" : "light";
      themeToggleBtn.textContent = isDarkMode ? "☀️ ലൈറ്റ്" : "🌙 ഡാർക്ക്";
      showToast(isDarkMode ? "ഡാർക്ക് മോഡ് സജീവമാക്കി" : "ലൈറ്റ് മോഡ് സജീവമാക്കി");
    });
  }

  // Glossary Rendering & Modal
  function renderGlossary(filter = "") {
    if (!glossaryListEl) return;
    glossaryListEl.innerHTML = "";

    const cleanFilter = filter.trim().toLowerCase();
    const items = AQEEDAH_GLOSSARY.filter(item => {
      if (!cleanFilter) return true;
      return item.termAr.toLowerCase().includes(cleanFilter) ||
             item.termMl.toLowerCase().includes(cleanFilter) ||
             item.definitionMl.toLowerCase().includes(cleanFilter) ||
             item.definitionAr.toLowerCase().includes(cleanFilter);
    });

    if (items.length === 0) {
      glossaryListEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
          പദങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "glossary-item-card";
      card.style.background = "var(--bg-surface-elevated)";
      card.style.border = "1px solid var(--border-subtle)";
      card.style.borderRadius = "var(--radius-md)";
      card.style.padding = "1rem 1.2rem";

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-family: var(--font-arabic); font-size: 1.4rem; font-weight: 700; color: #58182b;">
            ${item.termAr}
          </span>
          <span style="font-size: 0.75rem; background: var(--accent-gold-light); color: var(--accent-gold-dark); padding: 0.2rem 0.5rem; border-radius: 999px; font-weight: 600;">
            ${item.category}
          </span>
        </div>
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main);">
          ${item.termMl}
        </div>
        <div class="arabic-text" style="font-size: 1.15rem; color: #222; margin-bottom: 0.4rem; direction: rtl; text-align: right; line-height: 1.6;">
          «${item.definitionAr}»
        </div>
        <div style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
          ${item.definitionMl}
        </div>
      `;
      glossaryListEl.appendChild(card);
    });
  }

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

  // Live Search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        renderSidebar();
        renderCurrentChap();
        return;
      }

      // Filter matching sections across all chapters
      const matches = [];
      AQEEDAH_DATA.forEach(chap => {
        chap.sections.forEach(sec => {
          if (
            sec.matn.toLowerCase().includes(q) ||
            sec.sharh.toLowerCase().includes(q) ||
            sec.malayalam.toLowerCase().includes(q) ||
            sec.sectionTitleAr.toLowerCase().includes(q) ||
            sec.sectionTitleMl.toLowerCase().includes(q)
          ) {
            matches.push({ chap, sec });
          }
        });
      });

      if (matches.length === 0) {
        contentAreaEl.innerHTML = `
          <div style="text-align: center; padding: 4rem 2rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">ഫലങ്ങൾ ഒന്നും ലഭ്യമല്ല</h3>
            <p style="color: var(--text-muted);">"${q}" എന്ന പദം മത്‌നിലോ ശറഹിലോ വിശദീകരണത്തിലോ കണ്ടെത്താനായില്ല.</p>
          </div>
        `;
        return;
      }

      contentAreaEl.innerHTML = `
        <div style="background: var(--bg-surface); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; border-left: 5px solid #58182b;">
          <h3 style="color: #58182b; margin: 0 0 0.4rem;">തിരച്ചിൽ ഫലങ്ങൾ: "${q}"</h3>
          <p style="color: var(--text-muted); margin: 0; font-size: 0.95rem;">${matches.length} ഖണ്ഡികകളിൽ പദം കണ്ടെത്തി.</p>
        </div>
        <div class="sections-container">
          ${matches.map(m => `
            <article class="fasl-card" style="margin-bottom: 2rem;">
              <header class="fasl-card-header">
                <span class="fasl-badge">ബാബ് ${m.chap.order}: ${m.chap.titleMalayalam}</span>
                <h3 class="fasl-title-ar">${m.sec.sectionTitleAr}</h3>
                <h4 class="fasl-title-ml">${m.sec.sectionTitleMl}</h4>
              </header>
              <div class="fasl-card-body">
                <div class="text-block block-matn" style="display: block;">
                  <div class="block-tag"><span>مَتْنُ الْعَقَائِدِ</span></div>
                  <div class="arabic-text matn-text" style="font-size: 1.45rem;">${m.sec.matn}</div>
                </div>
                <div class="text-block block-sharh" style="display: block;">
                  <div class="block-tag"><span>الشَّرْحُ</span></div>
                  <div class="arabic-text sharh-text" style="font-size: 1.35rem;">${formatSharhText(m.sec.sharh)}</div>
                </div>
                <div class="text-block block-trans" style="display: block;">
                  <div class="block-tag"><span>വിശദീകരണം</span></div>
                  <div class="malayalam-text">${m.sec.malayalam}</div>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      `;
      attachAudioListeners();
    });
  }

  // Initial Load
  renderSidebar();
  renderCurrentChap();
});
