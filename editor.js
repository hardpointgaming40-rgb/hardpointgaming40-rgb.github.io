/* ==========================================================================
   SITE EDITOR — generates a fresh content.js from form input.
   This page is for YOU only; it isn't linked from the public nav.
   It never talks to a server or GitHub — it just builds a text file
   in your browser that you download and commit yourself.
   ========================================================================== */

(function () {
  // Work on a deep copy so we never mutate the loaded window.SITE by reference.
  const draft = JSON.parse(JSON.stringify(window.SITE || {}));

  const root = document.getElementById('editor-root');

  /* ---------------- generic helpers ---------------- */

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach(c => node.appendChild(c));
    return node;
  }

  function field(labelText, inputEl) {
    const wrap = el('div', { class: 'ed-field' });
    wrap.appendChild(el('label', { text: labelText }));
    wrap.appendChild(inputEl);
    return wrap;
  }

  function textInput(value, onInput) {
    const input = el('input', { type: 'text', value: value || '' });
    input.addEventListener('input', () => onInput(input.value));
    return input;
  }

  function numberInput(value, onInput) {
    const input = el('input', { type: 'number', value: value != null ? value : 0 });
    input.addEventListener('input', () => onInput(Number(input.value)));
    return input;
  }

  function textArea(value, onInput, rows) {
    const ta = el('textarea', { rows: rows || 3 });
    ta.value = value || '';
    ta.addEventListener('input', () => onInput(ta.value));
    return ta;
  }

  // Textarea where each line = one array item (for bioParagraphs, easter egg lines, bullets)
  function linesArea(arr, onChange, rows) {
    const ta = el('textarea', { rows: rows || 4 });
    ta.value = (arr || []).join('\n');
    ta.addEventListener('input', () => {
      onChange(ta.value.split('\n').map(s => s.trim()).filter(Boolean));
    });
    return ta;
  }

  // Comma-separated text input for simple string arrays like tags
  function csvInput(arr, onChange) {
    const input = el('input', { type: 'text', value: (arr || []).join(', ') });
    input.addEventListener('input', () => {
      onChange(input.value.split(',').map(s => s.trim()).filter(Boolean));
    });
    return input;
  }

  /* ---------------- repeatable list editor ---------------- */
  // fields: [{ key, label, type: 'text'|'textarea'|'number' }]
  // renderExtra(itemObj, itemWrap): optional hook for nested content (e.g. project steps)
  function listEditor(container, arr, fields, blankItem, renderExtra) {
    const wrap = el('div', { class: 'ed-list' });

    function redraw() {
      wrap.innerHTML = '';
      arr.forEach((item, idx) => {
        const card = el('div', { class: 'ed-card' });
        const head = el('div', { class: 'ed-card-head' });
        head.appendChild(el('span', { class: 'ed-card-num', text: '#' + (idx + 1) }));
        const removeBtn = el('button', { type: 'button', class: 'ed-remove', text: 'Remove' });
        removeBtn.addEventListener('click', () => { arr.splice(idx, 1); redraw(); });
        head.appendChild(removeBtn);
        card.appendChild(head);

        fields.forEach(f => {
          let inputEl;
          if (f.type === 'textarea') {
            inputEl = textArea(item[f.key], v => { item[f.key] = v; }, f.rows);
          } else if (f.type === 'number') {
            inputEl = numberInput(item[f.key], v => { item[f.key] = v; });
          } else if (f.type === 'csv') {
            inputEl = csvInput(item[f.key], v => { item[f.key] = v; });
          } else if (f.type === 'lines') {
            inputEl = linesArea(item[f.key], v => { item[f.key] = v; }, f.rows);
          } else {
            inputEl = textInput(item[f.key], v => { item[f.key] = v; });
          }
          card.appendChild(field(f.label, inputEl));
        });

        if (renderExtra) renderExtra(item, card);

        wrap.appendChild(card);
      });

      const addBtn = el('button', { type: 'button', class: 'ed-add', text: '+ Add item' });
      addBtn.addEventListener('click', () => {
        arr.push(JSON.parse(JSON.stringify(blankItem)));
        redraw();
      });
      wrap.appendChild(addBtn);
    }

    redraw();
    container.appendChild(wrap);
  }

  /* ---------------- section builder ---------------- */
  function section(title) {
    const s = el('section', { class: 'ed-section' });
    s.appendChild(el('h2', { text: title }));
    root.appendChild(s);
    return s;
  }

  /* ================= IDENTITY ================= */
  const idSec = section('Identity');
  [
    ['name', 'Name'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['location', 'Location'],
    ['linkedinUrl', 'LinkedIn URL'],
    ['linkedinLabel', 'LinkedIn label (displayed text)'],
    ['githubUrl', 'GitHub URL'],
    ['githubLabel', 'GitHub label (displayed text)']
  ].forEach(([key, label]) => {
    idSec.appendChild(field(label, textInput(draft[key], v => { draft[key] = v; })));
  });

  /* ================= HOME ================= */
  draft.home = draft.home || {};
  const homeSec = section('Home page');
  homeSec.appendChild(field('Tagline', textInput(draft.home.tagline, v => { draft.home.tagline = v; })));
  homeSec.appendChild(field('Bio — one paragraph per line', linesArea(draft.home.bioParagraphs, v => { draft.home.bioParagraphs = v; }, 6)));

  homeSec.appendChild(el('h3', { text: 'Quick specs' }));
  draft.home.quickSpecs = draft.home.quickSpecs || [];
  listEditor(homeSec, draft.home.quickSpecs,
    [{ key: 'k', label: 'Label' }, { key: 'v', label: 'Value' }],
    { k: '', v: '' });

  homeSec.appendChild(el('h3', { text: 'Interests' }));
  draft.home.interests = draft.home.interests || [];
  listEditor(homeSec, draft.home.interests,
    [{ key: 'title', label: 'Title' }, { key: 'body', label: 'Description', type: 'textarea' }],
    { title: '', body: '' });

  /* ================= RESUME ================= */
  draft.resume = draft.resume || {};
  const resumeSec = section('Resume');

  draft.resume.education = draft.resume.education || {};
  resumeSec.appendChild(el('h3', { text: 'Education' }));
  resumeSec.appendChild(field('Degree', textInput(draft.resume.education.degree, v => { draft.resume.education.degree = v; })));
  resumeSec.appendChild(field('Dates', textInput(draft.resume.education.dates, v => { draft.resume.education.dates = v; })));
  resumeSec.appendChild(field('School', textInput(draft.resume.education.school, v => { draft.resume.education.school = v; })));
  resumeSec.appendChild(field('Description', textArea(draft.resume.education.body, v => { draft.resume.education.body = v; }, 3)));

  resumeSec.appendChild(el('h3', { text: 'Experience' }));
  draft.resume.experience = draft.resume.experience || [];
  listEditor(resumeSec, draft.resume.experience,
    [
      { key: 'title', label: 'Job title' },
      { key: 'dates', label: 'Dates' },
      { key: 'org', label: 'Organization' },
      { key: 'bullets', label: 'Bullet points — one per line', type: 'lines', rows: 4 }
    ],
    { title: '', dates: '', org: '', bullets: [] });

  resumeSec.appendChild(el('h3', { text: 'Skills (grouped)' }));
  draft.resume.skills = draft.resume.skills || [];
  listEditor(resumeSec, draft.resume.skills,
    [{ key: 'label', label: 'Category' }, { key: 'body', label: 'Details' }],
    { label: '', body: '' });

  resumeSec.appendChild(el('h3', { text: 'Activities' }));
  draft.resume.activities = draft.resume.activities || [];
  listEditor(resumeSec, draft.resume.activities,
    [{ key: 'k', label: 'Label' }, { key: 'v', label: 'Value' }],
    { k: '', v: '' });

  resumeSec.appendChild(el('h3', { text: 'Skill levels (0–100)' }));
  draft.resume.skillLevels = draft.resume.skillLevels || [];
  listEditor(resumeSec, draft.resume.skillLevels,
    [{ key: 'label', label: 'Skill' }, { key: 'value', label: 'Level (0-100)', type: 'number' }],
    { label: '', value: 50 });

  /* ================= PROJECTS ================= */
  draft.projects = draft.projects || [];
  const projSec = section('Projects');
  listEditor(projSec, draft.projects,
    [
      { key: 'id', label: 'ID (short, no spaces — used in the URL)' },
      { key: 'num', label: 'Sheet number (e.g. 03.1)' },
      { key: 'title', label: 'Title' },
      { key: 'cardDesc', label: 'Card summary (shown on Projects page)', type: 'textarea', rows: 2 },
      { key: 'status', label: 'Status (e.g. Shipped / In progress / Ongoing)' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'csv' },
      { key: 'stack', label: 'Stack (short label)' },
      { key: 'phasesCount', label: 'Phases / scope label' },
      { key: 'problem', label: 'The problem', type: 'textarea', rows: 4 },
      { key: 'outcome', label: 'The outcome', type: 'textarea', rows: 3 },
      { key: 'outcomeNote', label: 'Outcome note (optional follow-up)', type: 'textarea', rows: 2 },
      { key: 'notes', label: 'Notes (optional)', type: 'textarea', rows: 2 }
    ],
    { id: '', page: '', num: '', title: '', cardDesc: '', status: '', tags: [], stack: '', phasesCount: '', problem: '', steps: [], outcome: '', outcomeNote: '', notes: '' },
    (project, card) => {
      card.appendChild(el('h4', { text: 'What I did — steps' }));
      project.steps = project.steps || [];
      listEditor(card, project.steps,
        [
          { key: 'label', label: 'Step label (A, B, C…)' },
          { key: 'title', label: 'Step title' },
          { key: 'body', label: 'Step description', type: 'textarea', rows: 3 }
        ],
        { label: '', title: '', body: '' });
    });

  /* ================= WRITING ================= */
  draft.writing = draft.writing || [];
  const writeSec = section('Writing');
  listEditor(writeSec, draft.writing,
    [
      { key: 'label', label: 'Category label' },
      { key: 'title', label: 'Title' },
      { key: 'body', label: 'Body', type: 'textarea', rows: 5 }
    ],
    { label: '', title: '', body: '' });

  /* ================= EASTER EGG ================= */
  draft.easterEgg = draft.easterEgg || {};
  const eggSec = section('Hidden easter egg');
  eggSec.appendChild(field('Clicks to reveal', numberInput(draft.easterEgg.clicksToReveal, v => { draft.easterEgg.clicksToReveal = v; })));
  eggSec.appendChild(field('Title', textInput(draft.easterEgg.title, v => { draft.easterEgg.title = v; })));
  eggSec.appendChild(field('Lines — one per line', linesArea(draft.easterEgg.lines, v => { draft.easterEgg.lines = v; }, 4)));

  /* ================= GENERATE ================= */

  // Pretty-printer that mimics the original content.js formatting:
  // unquoted object keys, double-quoted strings, multi-line arrays/objects.
  function serialize(value, indent) {
    const pad = '  '.repeat(indent);
    const padIn = '  '.repeat(indent + 1);

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const items = value.map(v => padIn + serialize(v, indent + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    if (value !== null && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return '{}';
      const entries = keys.map(k => padIn + k + ': ' + serialize(value[k], indent + 1));
      return '{\n' + entries.join(',\n') + '\n' + pad + '}';
    }
    if (typeof value === 'string') return JSON.stringify(value);
    return String(value);
  }

  function generateFile() {
    const header = `/* ==========================================================================
   EDIT THIS FILE TO UPDATE YOUR WEBSITE
   ==========================================================================
   Every page reads its text from the SITE object below. Change a value here,
   save the file, refresh the page (or re-upload to GitHub) — that's it.
   You do NOT need to touch any .html file to update content.

   This file was generated by edit.html.
   ========================================================================== */

window.SITE = `;

    return header + serialize(draft, 0) + ';\n';
  }

  const genBtn = document.getElementById('generate-btn');
  const output = document.getElementById('output-area');
  const downloadBtn = document.getElementById('download-btn');
  let latestFile = '';

  genBtn.addEventListener('click', () => {
    latestFile = generateFile();
    output.value = latestFile;
    output.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([latestFile], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

})();
