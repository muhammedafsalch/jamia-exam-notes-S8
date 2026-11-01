/**
 * Handasa & Hisab Interactive Controller (Geometry & Math Portal)
 * Jamia Nooriya Coordination (JJC) Curriculum
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentChapId = HANDASA_DATA[0].id;
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
    HANDASA_DATA.forEach((chap) => {
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
                § ${s.sectionTitleAr.slice(0, 28)}...
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
    const chap = HANDASA_DATA.find((c) => c.id === currentChapId);
    if (!chap) return;

    let keyPointsHtml = "";
    if (chap.keyPoints && chap.keyPoints.length > 0) {
      keyPointsHtml = `
        <div class="keypoints-card">
          <div class="keypoints-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ഈ അധ്യായത്തിലെ പ്രധാന ജ്യാമിതീയ-ഗണിത തത്വങ്ങൾ:
          </div>
          <ul class="keypoints-list">
            ${chap.keyPoints.map(kp => `<li>${kp}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    let predictionsHtml = "";
    if (chap.examPredictions && chap.examPredictions.length > 0) {
      predictionsHtml = `
        <div class="exam-prediction-card">
          <div class="exam-prediction-title">
            <span>🎯 മുൻവർഷ പരീക്ഷാ ചോദ്യ മാതൃകകളും ഉത്തരങ്ങളും (2025, 2024, 2023 Solved Questions):</span>
          </div>
          <div class="predictions-list">
            ${chap.examPredictions.map((p, idx) => `
              <div class="prediction-item">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; flex-wrap:wrap; gap:0.4rem;">
                  <span style="font-size:0.78rem; font-weight:700; color:var(--accent-gold-dark); background:var(--accent-gold-light); padding:0.15rem 0.6rem; border-radius:999px; border:1px solid var(--accent-gold-border);">
                    ${p.pattern}
                  </span>
                  <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">ചോദ്യം ${idx + 1}</span>
                </div>
                <div style="font-family:var(--font-arabic); font-size:1.25rem; font-weight:700; color:#0f2d33; direction:rtl; text-align:right; margin-bottom:0.35rem; line-height:1.6;">
                  ${p.questionAr}
                </div>
                <div style="font-family:var(--font-malayalam); font-size:0.92rem; color:var(--text-main); margin-bottom:0.6rem; font-weight:600;">
                  ❓ ${p.questionMl}
                </div>
                <div style="background:#f4fafb; border-radius:6px; padding:0.8rem 1rem; border-left:3px solid #18444d;">
                  <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:#18444d; margin-bottom:0.3rem;">
                    പാഠപുസ്തകത്തിൽ നിന്നുള്ള ആധികാരിക ഉത്തരം:
                  </div>
                  <div style="font-family:var(--font-arabic); font-size:1.18rem; color:#122a2e; direction:rtl; text-align:right; line-height:1.8; margin-bottom:0.4rem;">
                    ${p.answerAr}
                  </div>
                  <div style="font-family:var(--font-malayalam); font-size:0.9rem; color:var(--text-main); line-height:1.6;">
                    <strong>വിശദീകരണം:</strong> ${p.answerMl}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    let sectionsHtml = "";
    if (chap.sections && chap.sections.length > 0) {
      sectionsHtml = chap.sections.map((sec) => `
        <article class="fasl-card" id="sec_${sec.subId}" data-sec-id="${sec.subId}">
          <header class="fasl-card-header">
            <div class="fasl-header-top">
              <span class="fasl-number-badge">വിഭാഗം: ${sec.sectionTitleAr.slice(0, 30)}</span>
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
            <h3 class="fasl-title-ar">${sec.sectionTitleAr}</h3>
            <div class="fasl-title-ml">${sec.sectionTitleMl}</div>
          </header>

          <div class="fasl-card-body">
            <!-- 1. Matn Section (Always visible) -->
            <div class="text-block matn-block">
              <div class="text-block-tag matn-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                മത്‌ൻ (متن الكتاب)
              </div>
              <p class="arabic-text matn-text" style="font-size: ${currentArabicSize}rem;">
                ${sec.matn}
              </p>
            </div>

            <!-- 2. Sharh Section (Expandable/Collapsible) -->
            <div class="text-block sharh-block ${currentViewMode === 'easy' ? 'sharh-collapsed' : ''}">
              <div class="text-block-tag sharh-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                ശറഹും വിശദീകരണവും (الشرح والبيان)
              </div>
              <p class="arabic-text sharh-text" style="font-size: ${currentArabicSize * 0.9}rem;">
                ${formatSharhText(sec.sharh)}
              </p>
            </div>

            <!-- Sharh Toggle Button for Easy Mode -->
            <div class="sharh-toggle-row">
              <button class="btn btn-sm btn-outline toggle-sharh-btn" data-target="sec_${sec.subId}">
                <span class="btn-icon-text">📖 ശറഹ് ഇബാറത്ത് കാണുക / മറക്കുക</span>
              </button>
            </div>

            <!-- 3. Simplified Malayalam Translation -->
            <div class="text-block malayalam-block">
              <div class="text-block-tag malayalam-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                ലളിതമായ വിശദീകരണം (മലയാളത്തിൽ)
              </div>
              <p class="malayalam-text">
                ${sec.malayalam}
              </p>
            </div>

            <!-- 4. Exam Notes -->
            ${sec.fiqhNotes ? `
              <div class="fiqh-notes-box" style="background:#f4fafb; border-left:4px solid #18444d; padding:0.9rem 1.2rem; border-radius:6px; margin-top:1rem; font-size:0.92rem; color:#0f2d33;">
                <strong>💡 പരീക്ഷാ ഓർമ്മക്കുറിപ്പ്:</strong> ${sec.fiqhNotes}
              </div>
            ` : ""}

          </div>
        </article>
      `).join("");
    }

    contentAreaEl.innerHTML = `
      <section class="chapter-hero" style="background: linear-gradient(135deg, #0f2d33 0%, #18444d 50%, #205c68 100%);">
        <div class="chapter-hero-badge">
          <span>ഹന്ദസ &amp; ഹിസാബ് • പാഠഭാഗം ${chap.order}</span>
        </div>
        <h2 class="chapter-hero-title-ar">${chap.titleArabic}</h2>
        <div class="chapter-hero-title-ml">${chap.titleMalayalam}</div>
        <p class="chapter-hero-summary">${chap.summary}</p>
      </section>

      <!-- Chapter Sub-Tabs -->
      <div class="chapter-tabs-bar">
        <button class="chapter-sub-tab active" data-subtab="notes">
          📌 കിതാബ് നോട്‌സും പരീക്ഷാ മാതൃകകളും
        </button>
        <button class="chapter-sub-tab" data-subtab="texts">
          📜 മത്‌നും ശറഹും (${chap.sections ? chap.sections.length : 0})
        </button>
      </div>

      <!-- Tab Content 1: Key Notes & Predictions (Active by Default) -->
      <div id="subtab-notes-pane" class="chapter-subtab-pane active">
        ${keyPointsHtml}
        ${predictionsHtml}
      </div>

      <!-- Tab Content 2: Texts List -->
      <div id="subtab-texts-pane" class="chapter-subtab-pane">
        ${sectionsHtml}
      </div>
    `;

    attachDynamicListeners();
  }

  // Attach Listeners
  function attachDynamicListeners() {
    // Sub-Tabs switching
    document.querySelectorAll(".chapter-sub-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".chapter-sub-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".chapter-subtab-pane").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const paneId = `subtab-${tab.dataset.subtab}-pane`;
        const pane = document.getElementById(paneId);
        if (pane) pane.classList.add("active");
      });
    });

    // Audio Playback
    document.querySelectorAll(".play-audio-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.dataset.text);
        playArabicText(text);
      });
    });

    // Copy Text
    document.querySelectorAll(".copy-text-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.dataset.text);
        navigator.clipboard.writeText(text).then(() => {
          showToast("മത്‌ൻ കോപ്പി ചെയ്തു! 📋");
        }).catch(() => {
          showToast("കോപ്പി ചെയ്യാൻ സാധിച്ചില്ല.");
        });
      });
    });

    // Toggle individual Sharh block
    document.querySelectorAll(".toggle-sharh-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const card = document.getElementById(targetId);
        if (card) {
          const sharhBlock = card.querySelector(".sharh-block");
          if (sharhBlock) {
            sharhBlock.classList.toggle("sharh-collapsed");
            const isCollapsed = sharhBlock.classList.contains("sharh-collapsed");
            btn.querySelector(".btn-icon-text").textContent = isCollapsed
              ? "📖 ശറഹ് ഇബാറത്ത് കാണുക"
              : "✕ ശറഹ് മറക്കുക";
          }
        }
      });
    });
  }

  // SpeechSynthesis
  function playArabicText(text) {
    if (!window.speechSynthesis) {
      showToast("ബ്രൗസറിൽ ഓഡിയോ ലഭ്യമല്ല.");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      showToast("ഓഡിയോ നിർത്തി ⏹️");
      return;
    }
    const cleanText = text.replace(/[\u064B-\u065F]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;

    utterance.onstart = () => showToast("അറബിക് ഉച്ചാരണം കേൾക്കുന്നു... 🔊");
    utterance.onend = () => showToast("പൂർത്തിയായി ✅");
    utterance.onerror = () => showToast("ഓഡിയോ പ്ലേ ചെയ്യുന്നതിൽ തടസ്സമുണ്ടായി.");

    window.speechSynthesis.speak(utterance);
  }

  // View Mode Switcher
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentViewMode = btn.dataset.mode;

      contentAreaEl.className = `content-area view-${currentViewMode}`;

      if (currentViewMode === "sharh" || currentViewMode === "all") {
        document.querySelectorAll(".sharh-block").forEach(sb => sb.classList.remove("sharh-collapsed"));
      } else if (currentViewMode === "easy") {
        document.querySelectorAll(".sharh-block").forEach(sb => sb.classList.add("sharh-collapsed"));
      }

      showToast(`വായനാ രീതി മാറ്റി: ${btn.textContent.trim()}`);
    });
  });

  // Font Size Adjustments
  if (fontIncBtn) {
    fontIncBtn.addEventListener("click", () => {
      if (currentArabicSize < 2.4) {
        currentArabicSize += 0.15;
        document.querySelectorAll(".arabic-text.matn-text").forEach(el => el.style.fontSize = `${currentArabicSize}rem`);
        document.querySelectorAll(".arabic-text.sharh-text").forEach(el => el.style.fontSize = `${currentArabicSize * 0.9}rem`);
      }
    });
  }
  if (fontDecBtn) {
    fontDecBtn.addEventListener("click", () => {
      if (currentArabicSize > 1.1) {
        currentArabicSize -= 0.15;
        document.querySelectorAll(".arabic-text.matn-text").forEach(el => el.style.fontSize = `${currentArabicSize}rem`);
        document.querySelectorAll(".arabic-text.sharh-text").forEach(el => el.style.fontSize = `${currentArabicSize * 0.9}rem`);
      }
    });
  }

  // Dark/Light Theme Toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("dark-mode", isDarkMode);
      themeToggleBtn.textContent = isDarkMode ? "☀️ ലൈറ്റ്" : "🌙 ഡാർക്ക്";
      showToast(isDarkMode ? "ഡാർക്ക് മോഡ് സജീവമാക്കി" : "ലൈറ്റ് മോഡ് സജീവമാക്കി");
    });
  }

  // Render Glossary Modal
  function renderGlossary() {
    if (!glossaryListEl || typeof HANDASA_GLOSSARY === "undefined") return;
    glossaryListEl.innerHTML = HANDASA_GLOSSARY.map(g => `
      <div class="glossary-card" style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.1rem; border-top:3px solid #18444d;">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.4rem;">
          <span style="font-family:var(--font-arabic); font-size:1.35rem; font-weight:700; color:#0f2d33; direction:rtl;">${g.termAr}</span>
          <span style="font-size:0.85rem; font-weight:700; color:var(--accent-gold-dark);">${g.termMl}</span>
        </div>
        <p style="font-size:0.88rem; color:var(--text-main); line-height:1.6; margin:0;">
          ${g.definition}
        </p>
      </div>
    `).join("");
  }

  // Glossary Modal Open/Close
  if (glossaryBtn && glossaryModal) {
    glossaryBtn.addEventListener("click", () => {
      renderGlossary();
      glossaryModal.classList.add("open");
    });
  }
  if (modalCloseBtn && glossaryModal) {
    modalCloseBtn.addEventListener("click", () => {
      glossaryModal.classList.remove("open");
    });
  }
  if (glossaryModal) {
    glossaryModal.addEventListener("click", (e) => {
      if (e.target === glossaryModal) {
        glossaryModal.classList.remove("open");
      }
    });
  }

  // Search Functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        renderCurrentChap();
        return;
      }
      let matchedHtml = "";
      HANDASA_DATA.forEach(chap => {
        chap.sections.forEach(sec => {
          if (
            sec.sectionTitleAr.toLowerCase().includes(q) ||
            sec.sectionTitleMl.toLowerCase().includes(q) ||
            sec.matn.toLowerCase().includes(q) ||
            sec.malayalam.toLowerCase().includes(q)
          ) {
            matchedHtml += `
              <div class="fasl-card" style="margin-bottom:1.5rem;">
                <div class="fasl-card-header">
                  <span class="fasl-number-badge">${chap.titleMalayalam}</span>
                  <h3 class="fasl-title-ar">${sec.sectionTitleAr}</h3>
                  <div class="fasl-title-ml">${sec.sectionTitleMl}</div>
                </div>
                <div class="fasl-card-body">
                  <div class="text-block matn-block">
                    <p class="arabic-text matn-text" style="font-size:${currentArabicSize}rem;">${sec.matn}</p>
                  </div>
                  <div class="text-block malayalam-block">
                    <p class="malayalam-text">${sec.malayalam}</p>
                  </div>
                </div>
              </div>
            `;
          }
        });
      });

      if (!matchedHtml) {
        contentAreaEl.innerHTML = `
          <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <h3>ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</h3>
            <p>'${q}' എന്നതിന് അനുയോജ്യമായ ജ്യാമിതീയ അല്ലെങ്കിൽ ഗണിത സൂത്രവാക്യങ്ങൾ ലഭ്യമായില്ല.</p>
          </div>
        `;
      } else {
        contentAreaEl.innerHTML = `
          <div style="padding:1rem; background:var(--bg-surface-elevated); border-radius:8px; margin-bottom:1.5rem; border-left:4px solid var(--accent-gold);">
            <strong>'${q}'</strong> എന്നതിനായുള്ള തിരച്ചിൽ ഫലങ്ങൾ:
          </div>
          ${matchedHtml}
        `;
      }
    });
  }

  // Initialize
  renderSidebar();
  renderCurrentChap();
});
