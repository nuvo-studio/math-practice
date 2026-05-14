#!/usr/bin/env node
// seed-cambridge-unit4.js — Seed Cambridge Unit 4 Level 1 lesson with balance-scale visuals.
// Run from worker/: node seed-cambridge-unit4.js

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const NAMESPACE_ID = 'bd9a4b14857d4df993a2c065d0804b41';
const LESSON_KEY   = 'lesson:cambridge:4:level1';

function runWrangler(args) {
  return spawnSync('npx', ['wrangler', ...args], {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

function kvPut(key, value) {
  const tmpFile = path.join(os.tmpdir(), 'nuvo-cambridge-unit4-' + Date.now() + '.json');
  fs.writeFileSync(tmpFile, value, 'utf8');
  try {
    const result = runWrangler([
      'kv', 'key', 'put',
      '--remote',
      '--namespace-id=' + NAMESPACE_ID,
      key,
      '--path=' + tmpFile,
    ]);
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || 'KV put failed');
    }
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

// ── Balance-scale builder ────────────────────────────────────────────────────
// state: 'balanced' | 'tilt-left' | 'tilt-right'
function balanceScale({ left, right, status, statusKind = 'balanced', operation, tilt = 'balanced' }) {
  const tiltClass = tilt === 'tilt-left' ? ' tilt-left' : tilt === 'tilt-right' ? ' tilt-right' : '';
  const opHtml = operation
    ? `<div class="balance-operation"><span class="op-label">Apply to both sides</span><span>${operation}</span></div>`
    : '';
  const statusHtml = status
    ? `<div class="balance-status ${statusKind}">${status}</div>`
    : '';
  return `
    <div class="balance-board">
      ${opHtml}
      <div class="balance-sides">
        <div class="balance-side">
          <div class="balance-side-label">Left side</div>
          <div class="balance-pan${left ? '' : ' empty'}">${left || '—'}</div>
        </div>
        <div class="balance-side">
          <div class="balance-side-label">Right side</div>
          <div class="balance-pan${right ? '' : ' empty'}">${right || '—'}</div>
        </div>
      </div>
      <div class="balance-bar-wrap">
        <div class="balance-bar${tiltClass}"></div>
      </div>
      <div class="balance-pivot"></div>
      <div class="balance-base"></div>
      ${statusHtml}
    </div>
  `;
}

// ── Lesson content ───────────────────────────────────────────────────────────
const lesson = {
  curriculum: 'cambridge',
  unit: '4',
  level: '1',
  title: 'Two-step equations',
  subtitle: 'Undo operations in reverse order, keeping both sides balanced.',
  badge: 'Cambridge Stage 8 · Unit 4 · Level 1',
  rules: [
    'An equation is a balance — both sides are equal',
    'Whatever you do to one side, you must do to the other',
    'Undo operations in reverse order: undo addition/subtraction first, then multiplication/division',
    'Goal: get the variable alone on one side',
  ],
  formulas: [
    'ax + b = c  →  ax = c - b  →  x = (c - b) / a',
    'If you subtract from one side, subtract from the other',
    'If you divide one side, divide the other',
  ],
  conceptVoice: [
    'A two-step equation has a variable buried under two operations.',
    'Think of the equation as a balance scale: both sides weigh the same.',
    'To find the variable, undo each operation, but apply the same change to both sides so the scale stays balanced.',
    'Always undo addition or subtraction first, then undo multiplication or division.',
  ].join(' '),
  conceptVisual: `<style>
.bsc-wrap{display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;padding:.5rem 0}
.bsc-svg-col{flex:0 0 auto}
.bsc-svg{width:100%;max-width:260px;overflow:visible}
.bsc-ctrl-col{flex:1 1 200px;display:flex;flex-direction:column;gap:.9rem}
.bsc-beam{fill:var(--blue);transition:fill .45s ease}
.bsc-beam.bsc-ok{fill:var(--teal)}
.bsc-fulcrum,.bsc-stand-base{fill:var(--text-secondary)}
.bsc-stand{stroke:var(--text-secondary);stroke-width:3;fill:none}
.bsc-string{stroke:var(--text-secondary);stroke-width:1.5;fill:none}
.bsc-pan{fill:var(--blue-light);stroke:var(--blue);stroke-width:1.5;transition:fill .45s ease,stroke .45s ease}
.bsc-pan.bsc-ok{fill:var(--teal-light);stroke:var(--teal)}
.bsc-pan-text{font-family:var(--mono);font-size:13px;font-weight:700;fill:var(--text);text-anchor:middle;dominant-baseline:middle}
.bsc-eq{display:flex;align-items:baseline;gap:.5rem;font-family:var(--mono);font-size:1.5rem;font-weight:700;color:var(--text)}
.bsc-eq-sign{color:var(--text-secondary)}
.bsc-eq-side{background:var(--blue-light);border:1.5px solid var(--blue);border-radius:8px;padding:.2em .5em;transition:background .45s ease,border-color .45s ease}
.bsc-eq-side.bsc-ok{background:var(--teal-light);border-color:var(--teal)}
.bsc-explain{font-size:.95rem;color:var(--text-secondary);margin:0;line-height:1.5}
.bsc-explain.bsc-ok{color:var(--teal);font-weight:600}
.bsc-btn-step{display:inline-flex;align-items:center;gap:.4rem;background:var(--accent-bg);border:1.5px solid var(--accent-light);border-radius:999px;padding:.5rem 1.1rem;font-family:var(--mono);font-size:.9rem;font-weight:700;color:var(--accent);cursor:pointer;animation:bsc-pulse 2.4s ease-in-out infinite}
.bsc-btn-step:hover{background:var(--accent-light)}
.bsc-btn-reset{display:none;align-items:center;gap:.4rem;background:transparent;border:1.5px solid var(--border);border-radius:999px;padding:.4rem 1rem;font-size:.85rem;font-weight:600;color:var(--text-secondary);cursor:pointer}
.bsc-btn-reset:hover{background:var(--bg)}
@keyframes bsc-pulse{0%,100%{opacity:1}50%{opacity:.65}}
@media(prefers-reduced-motion:reduce){.bsc-btn-step{animation:none}.bsc-beam,.bsc-pan,.bsc-eq-side{transition:none}}
</style>
<div class="bsc-wrap">
  <div class="bsc-svg-col">
    <svg class="bsc-svg" viewBox="0 0 260 160" aria-hidden="true">
      <rect id="bsc-beam" class="bsc-beam" x="20" y="48" width="220" height="10" rx="5"/>
      <line class="bsc-string" x1="25" y1="58" x2="25" y2="93"/>
      <line class="bsc-string" x1="235" y1="58" x2="235" y2="93"/>
      <rect id="bsc-pan-l" class="bsc-pan" x="3" y="93" width="44" height="30" rx="7"/>
      <rect id="bsc-pan-r" class="bsc-pan" x="213" y="93" width="44" height="30" rx="7"/>
      <text id="bsc-text-l" class="bsc-pan-text" x="25" y="109">3x</text>
      <text id="bsc-text-r" class="bsc-pan-text" x="235" y="109">12</text>
      <polygon class="bsc-fulcrum" points="130,58 116,80 144,80"/>
      <line class="bsc-stand" x1="130" y1="80" x2="130" y2="142"/>
      <rect class="bsc-stand-base" x="90" y="142" width="80" height="10" rx="5"/>
    </svg>
  </div>
  <div class="bsc-ctrl-col">
    <div class="bsc-eq">
      <span id="bsc-eq-l" class="bsc-eq-side">3x</span>
      <span class="bsc-eq-sign">=</span>
      <span id="bsc-eq-r" class="bsc-eq-side">12</span>
    </div>
    <p id="bsc-explain" class="bsc-explain">La balanza está equilibrada: ambos lados son iguales.</p>
    <button id="bsc-btn-step" class="bsc-btn-step" onclick="(function(){['bsc-text-l','bsc-text-r'].forEach(function(id,i){document.getElementById(id).textContent=i?'4':'x'});['bsc-eq-l','bsc-eq-r'].forEach(function(id,i){var el=document.getElementById(id);el.textContent=i?'4':'x';el.classList.add('bsc-ok')});['bsc-beam','bsc-pan-l','bsc-pan-r'].forEach(function(id){document.getElementById(id).classList.add('bsc-ok')});var ex=document.getElementById('bsc-explain');ex.textContent='¡Exacto! Dividir entre 3 en ambos lados despeja x. La balanza sigue equilibrada: x = 4 \u2713';ex.classList.add('bsc-ok');document.getElementById('bsc-btn-step').style.display='none';document.getElementById('bsc-btn-reset').style.display='inline-flex'})()">÷ 3 en ambos lados →</button>
    <button id="bsc-btn-reset" class="bsc-btn-reset" onclick="(function(){['bsc-text-l','bsc-text-r'].forEach(function(id,i){document.getElementById(id).textContent=i?'12':'3x'});['bsc-eq-l','bsc-eq-r'].forEach(function(id,i){var el=document.getElementById(id);el.textContent=i?'12':'3x';el.classList.remove('bsc-ok')});['bsc-beam','bsc-pan-l','bsc-pan-r'].forEach(function(id){document.getElementById(id).classList.remove('bsc-ok')});var ex=document.getElementById('bsc-explain');ex.textContent='La balanza está equilibrada: ambos lados son iguales.';ex.classList.remove('bsc-ok');document.getElementById('bsc-btn-reset').style.display='none';document.getElementById('bsc-btn-step').style.display=''})()">↺ Reiniciar</button>
  </div>
</div>`,
  example: {
    start: '3x + 5 = 14',
    annotation: 'Solve for x',
    narration_intro: 'We want to find the value of x. The equation 3x + 5 = 14 has two operations — multiplication and addition. We undo them in reverse order.',
    formulas: [
      'Step 1: subtract 5 from both sides → 3x = 9',
      'Step 2: divide both sides by 3 → x = 3',
      'Check: 3(3) + 5 = 9 + 5 = 14 ✓',
    ],
    steps: [
      {
        equation: '3x + 5 = 14',
        annotation: 'Starting equation',
        narration: 'Start with the equation. The left side is 3x plus 5. The right side is 14. The two sides are equal.',
        visual: balanceScale({
          left: '3x + 5',
          right: '14',
          status: 'Balanced — both sides are equal',
          statusKind: 'balanced',
        }),
      },
      {
        equation: '3x + 5 − 5 = 14 − 5',
        annotation: 'Undo the +5: subtract 5 from both sides',
        narration: 'To peel away the +5, subtract 5 from both sides. The same change happens on both sides, so the scale stays balanced.',
        visual: balanceScale({
          left: '3x + 5 − 5',
          right: '14 − 5',
          operation: '− 5',
          status: 'Same change on both sides keeps it balanced',
          statusKind: 'balanced',
        }),
      },
      {
        equation: '3x = 9',
        annotation: 'Simplify: 5 − 5 cancels on the left, 14 − 5 = 9 on the right',
        narration: 'On the left, plus 5 minus 5 cancels. On the right, 14 minus 5 is 9. Now the equation is simpler.',
        visual: balanceScale({
          left: '3x',
          right: '9',
          status: 'Still balanced — equation is simpler',
          statusKind: 'balanced',
        }),
      },
      {
        equation: '3x ÷ 3 = 9 ÷ 3',
        annotation: 'Undo the ×3: divide both sides by 3',
        narration: 'Now undo the multiplication. Divide both sides by 3. Doing the same thing to both sides keeps the scale balanced.',
        visual: balanceScale({
          left: '3x ÷ 3',
          right: '9 ÷ 3',
          operation: '÷ 3',
          status: 'Same change on both sides keeps it balanced',
          statusKind: 'balanced',
        }),
      },
      {
        equation: 'x = 3',
        annotation: 'Solved — and check: 3(3) + 5 = 14 ✓',
        narration: 'The answer is x equals 3. Check by substituting back: three times three is nine, plus five is fourteen. The scale balances.',
        visual: balanceScale({
          left: 'x',
          right: '3',
          status: 'x is alone — solved!',
          statusKind: 'balanced',
        }),
      },
    ],
  },
};

function main() {
  console.log('Writing ' + LESSON_KEY + ' to remote KV...');
  kvPut(LESSON_KEY, JSON.stringify(lesson));
  console.log('Done. Seeded:', LESSON_KEY);
}

main();
