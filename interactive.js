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

  /* ---------- 7. Rooftop skyline silhouette (lights blink) ---------- */
  function initRooftopSkyline() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'rooftop-skyline');
    svg.setAttribute('viewBox', '0 0 1200 64');
    svg.setAttribute('preserveAspectRatio', 'none');

    const buildings = `
      <rect x="0" y="30" width="60" height="34" fill="#050505"/>
      <rect x="70" y="14" width="40" height="50" fill="#050505"/>
      <rect x="120" y="36" width="70" height="28" fill="#050505"/>
      <rect x="200" y="8" width="34" height="56" fill="#050505"/>
      <rect x="245" y="26" width="55" height="38" fill="#050505"/>
      <rect x="310" y="40" width="90" height="24" fill="#050505"/>
      <rect x="410" y="18" width="36" height="46" fill="#050505"/>
      <rect x="455" y="30" width="60" height="34" fill="#050505"/>
      <rect x="525" y="4" width="30" height="60" fill="#050505"/>
      <rect x="565" y="34" width="80" height="30" fill="#050505"/>
      <rect x="655" y="16" width="42" height="48" fill="#050505"/>
      <rect x="705" y="38" width="60" height="26" fill="#050505"/>
      <rect x="775" y="22" width="34" height="42" fill="#050505"/>
      <rect x="820" y="6" width="30" height="58" fill="#050505"/>
      <rect x="860" y="32" width="70" height="32" fill="#050505"/>
      <rect x="940" y="14" width="40" height="50" fill="#050505"/>
      <rect x="990" y="36" width="90" height="28" fill="#050505"/>
      <rect x="1090" y="20" width="36" height="44" fill="#050505"/>
      <rect x="1135" y="40" width="65" height="24" fill="#050505"/>
    `;

    // window lights: [x, y, colorVar, delay(s), duration(s)]
    const lights = [
      [14, 40, 'var(--accent)', 0,    2.2],
      [30, 48, 'var(--ink)',    .6,   2.8],
      [80, 24, 'var(--accent)', 1.1,  2.0],
      [95, 40, 'var(--ink)',    .3,   3.1],
      [135, 46, 'var(--ink)',   1.6,  2.4],
      [230, 18, 'var(--accent)', .8,  2.6],
      [255, 36, 'var(--ink)',   0,    2.1],
      [325, 48, 'var(--accent)', 1.3, 2.9],
      [420, 28, 'var(--ink)',   .5,   2.3],
      [470, 40, 'var(--accent)', 1.8, 2.0],
      [535, 16, 'var(--ink)',   .2,   2.7],
      [580, 44, 'var(--accent)', 1.0, 2.5],
      [665, 26, 'var(--ink)',   .9,   3.0],
      [720, 48, 'var(--accent)', .4,  2.2],
      [830, 18, 'var(--ink)',   1.4,  2.6],
      [875, 42, 'var(--accent)', 0,   2.4],
      [955, 26, 'var(--ink)',   .7,   2.0],
      [1010, 46, 'var(--accent)', 1.5, 2.8],
      [1105, 30, 'var(--ink)',  .3,   2.3],
      [1150, 48, 'var(--accent)', 1.1, 2.6]
    ];

    const lightRects = lights.map(([x, y, color, delay, dur]) =>
      `<rect x="${x}" y="${y}" width="4" height="4" fill="${color}" class="sky-light"
        style="animation-delay:${delay}s; animation-duration:${dur}s;"/>`
    ).join('');

    svg.innerHTML = buildings + lightRects;
    document.body.appendChild(svg);
  }

  /* ---------- 8. Faint corner web decoration ---------- */
  function initCornerWeb() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'corner-web');
    svg.setAttribute('viewBox', '0 0 150 150');
    let paths = '';
    // radiating spokes
    for (let a = 0; a < 90; a += 15) {
      const rad = (a * Math.PI) / 180;
      const x = 150 * Math.cos(rad), y = 150 * Math.sin(rad);
      paths += `<line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#8B96A5" stroke-width="1"/>`;
    }
    // concentric arcs
    [30, 60, 95, 135].forEach(r => {
      paths += `<path d="M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}" fill="none" stroke="#8B96A5" stroke-width="1"/>`;
    });
    svg.innerHTML = paths;
    document.body.appendChild(svg);
  }

  /* ---------- 9. Web-shooter click effect ---------- */
  function initWebShooterClicks() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const thwipWords = ['THWIP!', 'THWIP-THWIP!', 'FWIP!'];
    document.addEventListener('click', e => {
      const ring = document.createElement('div');
      ring.className = 'web-shot-ring';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
      document.body.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());

      if (Math.random() < 0.12) {
        const text = document.createElement('div');
        text.className = 'thwip-text';
        text.textContent = thwipWords[Math.floor(Math.random() * thwipWords.length)];
        text.style.left = e.clientX + 'px';
        text.style.top = e.clientY + 'px';
        document.body.appendChild(text);
        text.addEventListener('animationend', () => text.remove());
      }
    });
  }

  /* ---------- 10. Dangling spider — appears when you scroll to the bottom ---------- */
  function initDanglingSpider() {
    let shown = false;
    window.addEventListener('scroll', () => {
      if (shown) return;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
      if (!nearBottom) return;
      shown = true;

      const wrap = document.createElement('div');
      wrap.className = 'dangling-spider-wrap';
      const threadLen = 60 + Math.random() * 80;
      wrap.style.left = (15 + Math.random() * 70) + 'vw';
      wrap.innerHTML = `
        <div class="dangling-spider-thread" style="height:${threadLen}px;"></div>
        <div class="dangling-spider-body">\u{1F577}\uFE0F</div>
      `;
      document.body.appendChild(wrap);

      wrap.addEventListener('click', () => {
        wrap.classList.add('retracting');
        setTimeout(() => wrap.remove(), 550);
      });
    });
  }

  /* ---------- 11. Hidden keyword easter egg — type "web" anywhere on the page ---------- */
  function initWebKeywordEgg() {
    const target = 'web';
    let progress = '';
    document.addEventListener('keydown', e => {
      if (e.key.length !== 1) return;
      progress = (progress + e.key.toLowerCase()).slice(-target.length);
      if (progress === target) {
        progress = '';
        showMessagePanel('SPIDER-SENSE: TINGLING', [
          "You went looking for the web, and the web noticed.",
          "A wise old mentor once said something about power and responsibility \u2014 mostly he meant: back up your work and don't skip the boring parts of a project.",
          "Now go build something that swings."
        ]);
      }
    });
  }

  /* ---------- shared message panel (used by the eyebrow egg and the keyword egg) ---------- */
  function showMessagePanel(title, lines) {
    if (document.querySelector('.easter-backdrop')) return;
    showEasterEgg({ title, lines });
  }


  function boot() {
    initCrosshair();
    initEasterEgg();
    initSkillChart();
    initSpiderCrawl();
    initStickyCards();
    initSpiderSense();
    initRooftopSkyline();
    initCornerWeb();
    initWebShooterClicks();
    initDanglingSpider();
    initWebKeywordEgg();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
