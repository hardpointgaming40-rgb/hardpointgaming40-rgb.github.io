/* ==========================================================================
   INTERACTIVE TOUCHES — you shouldn't need to edit this file.
   Content for the easter egg and skill chart lives in content.js.
   ========================================================================== */

(function () {

  /* ---------- 1. Drafting crosshair cursor (desktop only) ---------- */
  function initCrosshair() {
    if (!window.matchMedia('(pointer: fine)').matches) return; // skip touch devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const h = document.createElement('div');
    h.className = 'crosshair-line h';
    const v = document.createElement('div');
    v.className = 'crosshair-line v';
    const dot = document.createElement('div');
    dot.className = 'crosshair-dot';
    document.body.append(h, v, dot);

    let raf = null;
    document.addEventListener('mousemove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        h.style.top = e.clientY + 'px';
        v.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        raf = null;
      });
    });
  }

  /* ---------- 2. Hidden easter egg ---------- */
  function initEasterEgg() {
    const hotspot = document.querySelector('.tb-eyebrow');
    if (!hotspot || !window.SITE || !window.SITE.easterEgg) return;

    const egg = window.SITE.easterEgg;
    let clicks = 0;
    let resetTimer = null;

    hotspot.addEventListener('click', () => {
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clicks = 0; }, 1500);
      if (clicks >= (egg.clicksToReveal || 5)) {
        clicks = 0;
        showEasterEgg(egg);
      }
    });
  }

  function showEasterEgg(egg) {
    if (document.querySelector('.easter-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'easter-backdrop';

    const panel = document.createElement('div');
    panel.className = 'easter-panel';
    panel.innerHTML = `
      <div class="easter-strip"></div>
      <button class="easter-close" aria-label="Close">&times;</button>
      <div class="tb-eyebrow">${egg.title || 'SHEET 00'}</div>
      <h3></h3>
    `;
    (egg.lines || []).forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      panel.appendChild(p);
    });
    panel.querySelector('h3').remove(); // title already shown as eyebrow

    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);

    function close() { backdrop.remove(); }
    panel.querySelector('.easter-close').addEventListener('click', close);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  /* ---------- 3. Resume skill chart ---------- */
  function initSkillChart() {
    const container = document.getElementById('skill-chart');
    if (!container || !window.SITE) return;
    const levels = (window.SITE.resume && window.SITE.resume.skillLevels) || [];
    if (!levels.length) return;

    levels.forEach(item => {
      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML = `
        <div class="skill-label"><span></span><span class="skill-value"></span></div>
        <div class="skill-track"><div class="skill-fill"></div></div>
      `;
      row.querySelector('.skill-label span').textContent = item.label;
      row.querySelector('.skill-value').textContent = item.value + '%';
      container.appendChild(row);
    });

    // animate bars in once painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.querySelectorAll('.skill-fill').forEach((fill, i) => {
          fill.style.width = levels[i].value + '%';
        });
      });
    });
  }

  /* ---------- 4. Crawling spider (hidden corner click) ---------- */
  function initSpiderCrawl() {
    // invisible hotspot in the top-left corner — not visually hinted on purpose
    const hotspot = document.createElement('div');
    hotspot.style.cssText = 'position:fixed;top:4px;left:4px;width:36px;height:36px;z-index:6;';
    document.body.appendChild(hotspot);

    let clicks = 0;
    let resetTimer = null;
    hotspot.addEventListener('click', () => {
      clicks++;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clicks = 0; }, 1500);
      if (clicks >= 5) {
        clicks = 0;
        spawnSpider();
      }
    });
  }

  function spawnSpider() {
    if (document.querySelector('.crawling-spider')) return; // one at a time
    const spider = document.createElement('div');
    spider.className = 'crawling-spider';
    spider.textContent = '\u{1F577}\uFE0F'; // spider emoji
    spider.style.top = (18 + Math.random() * 55) + '%';
    document.body.appendChild(spider);
    spider.addEventListener('animationend', () => spider.remove());
  }

  /* ---------- 5. Sticky "webbed" project cards ---------- */
  function initStickyCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Delegated listeners: project cards on projects.html are added to the DOM
    // *after* this script's DOMContentLoaded handler runs, so we listen on
    // document.body with capture instead of binding to each card directly.
    let timer = null;
    let activeCard = null;

    document.body.addEventListener('mouseover', e => {
      const card = e.target.closest('.proj-card');
      if (!card || card === activeCard) return;
      activeCard = card;
      clearTimeout(timer);
      timer = setTimeout(() => {
        card.classList.add('web-stuck');
        setTimeout(() => card.classList.remove('web-stuck'), 1700);
      }, 3000);
    });

    document.body.addEventListener('mouseout', e => {
      const card = e.target.closest('.proj-card');
      if (!card) return;
      const toCard = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.proj-card');
      if (toCard === card) return; // still inside the same card
      clearTimeout(timer);
      activeCard = null;
    });
  }

  /* ---------- 6. Spider-sense pulse on fast cursor movement ---------- */
  function initSpiderSense() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const overlay = document.createElement('div');
    overlay.className = 'spider-sense-overlay';
    document.body.appendChild(overlay);

    let lastX = null, lastY = null, lastT = null, cooldown = false;
    document.addEventListener('mousemove', e => {
      const now = performance.now();
      if (lastX !== null) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY, dt = Math.max(now - lastT, 1);
        const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px per ms
        if (speed > 2.2 && !cooldown) {
          overlay.classList.remove('pulse');
          void overlay.offsetWidth; // restart animation
          overlay.classList.add('pulse');
          cooldown = true;
          setTimeout(() => { cooldown = false; }, 1200);
        }
      }
      lastX = e.clientX; lastY = e.clientY; lastT = now;
    });
  }

  function boot() {
    initCrosshair();
    initEasterEgg();
    initSkillChart();
    initSpiderCrawl();
    initStickyCards();
    initSpiderSense();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
