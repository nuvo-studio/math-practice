/* ── Shared lesson section nav (Intro → Práctica) ───────────────────────── */
(function () {
  'use strict';

  var PHASE_COUNT = 4;
  var LABEL_KEYS = ['', 'phase_intro', 'phase_concepts', 'phase_example', 'phase_practice'];

  var CSS = [
    '.lesson-page {',
    '  width: 100%; max-width: 600px; margin: 0 auto;',
    '  padding: 0 16px 48px; box-sizing: border-box; flex-shrink: 0;',
    '}',
    '.lesson-page #practice-screen { margin-top: 0; }',
    '.lesson-page .lesson-topnav {',
    '  width: calc(100% + 32px); margin-left: -16px; margin-right: -16px;',
    '  padding: 10px 16px;',
    '  display: flex; align-items: center;',
    '  border-bottom: 1px solid var(--border, #E8E8E4);',
    '  background: var(--card, #fff); flex-shrink: 0;',
    '}',
    '.lesson-topnav {',
    '  width: 100%;',
    '  padding: 10px max(16px, env(safe-area-inset-right)) 10px max(16px, env(safe-area-inset-left));',
    '  display: flex; align-items: center;',
    '  border-bottom: 1px solid var(--border, #E8E8E4);',
    '  background: var(--card, #fff); flex-shrink: 0;',
    '}',
    '.lesson-topnav .back-link {',
    '  font-size: 0.82rem; font-weight: 600;',
    '  color: var(--accent, #2D6A4F); text-decoration: none;',
    '  display: inline-flex; align-items: center; gap: 4px;',
    '}',
    '.lesson-page .lesson-phase-shell {',
    '  width: 100%; max-width: none; margin: 0 0 12px; padding: 8px 0 0;',
    '}',
    '.lesson-phase-shell {',
    '  width: 100%; max-width: 600px; margin: 0 auto 12px;',
    '  padding: 8px 16px 0; box-sizing: border-box; flex-shrink: 0; min-height: 40px;',
    '  position: sticky; top: 56px; z-index: 95;',
    '  background: var(--bg, #FAFAF8);',
    '}',
    '.lesson-phase-nav {',
    '  display: flex; flex-wrap: nowrap; gap: 6px; width: 100%;',
    '  margin-bottom: 0; overflow-x: auto; overflow-y: hidden;',
    '  -webkit-overflow-scrolling: touch;',
    '  scrollbar-width: none; padding-bottom: 4px;',
    '}',
    '.lesson-phase-nav::-webkit-scrollbar { display: none; }',
    '.lesson-phase-step {',
    '  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;',
    '  padding: 6px 10px 6px 6px; border: 1.5px solid var(--border, #E8E8E4);',
    '  border-radius: 10px; background: #fff; font-family: inherit;',
    '  cursor: pointer; text-decoration: none; color: inherit;',
    '  transition: border-color 0.15s, background 0.15s, color 0.15s;',
    '}',
    'a.lesson-phase-step:hover, button.lesson-phase-step:hover {',
    '  border-color: var(--accent, #2D6A4F); background: var(--accent-bg, #F0FAF3);',
    '}',
    '.lesson-phase-step.is-current {',
    '  border-color: var(--accent, #2D6A4F); background: var(--accent-bg, #F0FAF3);',
    '}',
    '.lesson-phase-step.is-done:not(.is-current) {',
    '  border-color: #D1FAE5; background: #F0FDF4;',
    '}',
    '.lesson-phase-num {',
    '  display: inline-flex; align-items: center; justify-content: center;',
    '  width: 22px; height: 22px; border-radius: 5px;',
    '  font-size: 0.72rem; font-weight: 800; line-height: 1;',
    '  background: var(--border, #E8E8E4); color: var(--text-secondary, #6B6B6B);',
    '}',
    '.lesson-phase-step.is-current .lesson-phase-num,',
    '.lesson-phase-step.is-done .lesson-phase-num {',
    '  background: var(--accent, #2D6A4F); color: #fff;',
    '}',
    '.lesson-phase-label {',
    '  font-size: 0.78rem; font-weight: 600; color: var(--text-secondary, #6B6B6B);',
    '  white-space: nowrap;',
    '}',
    '.lesson-phase-step.is-current .lesson-phase-label {',
    '  color: var(--accent-dark, var(--accent, #2D6A4F));',
    '}',
  ].join('\n');

  function injectStyles() {
    if (document.getElementById('lesson-phase-nav-css')) return;
    var s = document.createElement('style');
    s.id = 'lesson-phase-nav-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function label(key) {
    if (typeof Lang !== 'undefined' && Lang.t) {
      var t = Lang.t(key);
      if (t && t !== key) return t;
    }
    return key;
  }

  function buildHtml(current, opts) {
    var esc = opts.escHtml || function (s) {
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    var steps = [];
    var i;
    for (i = 1; i <= PHASE_COUNT; i++) {
      var isCurrent = i === current;
      var isDone = i < current;
      var cls = 'lesson-phase-step';
      if (isCurrent) cls += ' is-current';
      if (isDone) cls += ' is-done';
      var inner =
        '<span class="lesson-phase-num">' + i + '</span>' +
        '<span class="lesson-phase-label">' + esc(label(LABEL_KEYS[i])) + '</span>';
      var href = opts.href ? opts.href(i) : null;
      if (href && !isCurrent) {
        steps.push(
          '<a class="' + cls + '" href="' + href + '" data-lesson-phase="' + i + '">' + inner + '</a>'
        );
      } else {
        steps.push(
          '<button type="button" class="' + cls + '" data-lesson-phase="' + i + '"' +
          (isCurrent ? ' aria-current="step"' : '') + '>' + inner + '</button>'
        );
      }
    }
    return (
      '<nav class="lesson-phase-nav" aria-label="' +
      esc(label('lesson_phase_nav_aria')) +
      '">' +
      steps.join('') +
      '</nav>'
    );
  }

  function bind(root, onNavigate) {
    if (!root) return;
    root._lessonPhaseOnNavigate = onNavigate;
    if (root.dataset.phaseNavBound) return;
    root.dataset.phaseNavBound = '1';
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-lesson-phase]');
      if (!el || el.tagName === 'A') return;
      e.preventDefault();
      var n = Number(el.getAttribute('data-lesson-phase'));
      if (root._lessonPhaseOnNavigate) root._lessonPhaseOnNavigate(n);
    });
  }

  function scrollActivePhaseIntoView(root, current) {
    var nav = root.querySelector('.lesson-phase-nav');
    var cur = root.querySelector('.lesson-phase-step.is-current');
    if (!nav || !cur) return;
    requestAnimationFrame(function () {
      var navW = nav.clientWidth;
      var curL = cur.offsetLeft;
      var curW = cur.offsetWidth;
      if (current === 1) {
        nav.scrollLeft = 0;
      } else if (current === PHASE_COUNT) {
        nav.scrollLeft = Math.max(0, nav.scrollWidth - navW);
      } else if (curL + curW > nav.scrollLeft + navW) {
        nav.scrollLeft = curL + curW - navW;
      } else if (curL < nav.scrollLeft) {
        nav.scrollLeft = curL;
      }
    });
  }

  function render(root, opts) {
    if (!root) return;
    injectStyles();
    opts = opts || {};
    var current = Math.min(Math.max(opts.current || 1, 1), PHASE_COUNT);
    root.innerHTML = buildHtml(current, opts);
    bind(root, opts.onNavigate);
    scrollActivePhaseIntoView(root, current);
  }

  window.LessonPhaseNav = {
    PHASE_COUNT: PHASE_COUNT,
    PHASE_SLUGS: ['', 'cover', 'concepts', 'example', 'practice'],
    injectStyles: injectStyles,
    render: render,
    buildHtml: buildHtml,
  };
}());
