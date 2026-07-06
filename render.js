/* ==========================================================================
   RENDER ENGINE — you shouldn't need to edit this file.
   It reads window.SITE (from content.js) and fills in whatever elements
   on the current page ask for data via data-bind / data-list attributes.
   ========================================================================== */

(function () {
  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  }

  function fillScalarNodes(root, ctx) {
    root.querySelectorAll('[data-bind]').forEach(el => {
      const path = el.getAttribute('data-bind');
      const val = getPath(ctx, path);
      if (val !== undefined) el.textContent = val;
    });
    root.querySelectorAll('[data-bind-href]').forEach(el => {
      const path = el.getAttribute('data-bind-href');
      const val = getPath(ctx, path);
      if (val !== undefined) el.setAttribute('href', val);
    });
    root.querySelectorAll('[data-hide-if-empty]').forEach(el => {
      const path = el.getAttribute('data-hide-if-empty');
      const val = getPath(ctx, path);
      if (!val || val === '') el.style.display = 'none';
    });
  }

  function renderLists(root) {
    root.querySelectorAll(':scope > [data-list], [data-list]').forEach(container => {
      // avoid double-processing nested containers that were already expanded
      if (container.dataset.rendered) return;
      const path = container.getAttribute('data-list');
      const arr = getPath(window.SITE, path);
      const tpl = container.querySelector(':scope > template');
      if (!arr || !tpl) return;
      arr.forEach(item => {
        const clone = tpl.content.cloneNode(true);
        const wrapper = document.createElement('div');
        wrapper.style.display = 'contents';
        wrapper.appendChild(clone);
        fillScalarNodes(wrapper, item);
        wrapper.querySelectorAll('[data-list-inner]').forEach(inner => {
          const key = inner.getAttribute('data-list-inner');
          const innerTpl = inner.querySelector('template');
          const innerArr = item[key];
          if (innerArr && innerTpl) {
            innerArr.forEach(txt => {
              const ic = innerTpl.content.cloneNode(true);
              ic.querySelectorAll('[data-bind]').forEach(iel => { iel.textContent = txt; });
              inner.appendChild(ic);
            });
          }
        });
        wrapper.querySelectorAll('[data-tags]').forEach(tagWrap => {
          const key = tagWrap.getAttribute('data-tags');
          const tags = item[key];
          if (Array.isArray(tags)) {
            tags.forEach(t => {
              const span = document.createElement('span');
              span.className = 'tag';
              span.textContent = t;
              tagWrap.appendChild(span);
            });
          }
        });
        container.appendChild(wrapper);
      });
      container.dataset.rendered = 'true';
    });
  }

  function render() {
    if (!window.SITE) return;
    fillScalarNodes(document, window.SITE);
    renderLists(document);
    // second pass in case list templates introduced new top-level data-bind (identity fields etc.)
    fillScalarNodes(document, window.SITE);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
