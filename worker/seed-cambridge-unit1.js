#!/usr/bin/env node
// seed-cambridge-unit1.js — Enrich Cambridge Unit 1 Level 1 lesson content in remote KV.
// Run from worker/: node seed-cambridge-unit1.js

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const NAMESPACE_ID = 'bd9a4b14857d4df993a2c065d0804b41';
const LESSON_KEY = 'lesson:cambridge:1:level1';

function runWrangler(args) {
  return spawnSync('npx', ['wrangler', ...args], {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

function kvGet(key) {
  const result = runWrangler([
    'kv', 'key', 'get',
    '--remote',
    '--namespace-id=' + NAMESPACE_ID,
    key,
  ]);
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'KV get failed');
  }
  return result.stdout.trim();
}

function kvPut(key, value) {
  const tmpFile = path.join(os.tmpdir(), 'nuvo-cambridge-unit1-' + Date.now() + '.json');
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

function enrichLesson(existing) {
  return {
    ...existing,
    subtitle: 'Like terms share the same variable part. You can combine their coefficients, but terms with different variables must stay separate.',
    conceptVoice: [
      'A term has two important parts: a coefficient and a variable part.',
      'Like terms have matching variable parts, such as x with x or y with y.',
      'To simplify, group matching variable parts, combine the coefficients, and keep the variable part unchanged.',
      'Different variable parts do not combine.'
    ].join(' '),
    formulas: [
      'ax + bx = (a + b)x',
      'ay - by = (a - b)y',
      'ax + by cannot combine when x and y are different variables',
      'Coefficient changes; variable part stays the same'
    ],
    conceptVisual: `
      <div class="algebra-tile-board">
        <div class="tile-stage">
          <div class="tile-stage-title">Start with tiles for each term</div>
          <div class="tile-row">
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--y">y</span>
            <span class="algebra-tile algebra-tile--y">y</span>
            <span class="algebra-tile algebra-tile--y">y</span>
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--x">x</span>
            <span class="algebra-tile algebra-tile--y algebra-tile--negative">-y</span>
          </div>
        </div>
        <div class="tile-arrow">Sort by shape and colour ↓</div>
        <div class="visual-group-grid">
          <div class="tile-stage">
            <div class="tile-stage-title">x tiles combine</div>
            <div class="tile-row">
              <span class="algebra-tile algebra-tile--x">x</span>
              <span class="algebra-tile algebra-tile--x">x</span>
              <span class="algebra-tile algebra-tile--x">x</span>
              <span class="algebra-tile algebra-tile--x">x</span>
              <span class="algebra-tile algebra-tile--x">x</span>
              <span class="algebra-tile algebra-tile--x">x</span>
            </div>
          </div>
          <div class="tile-stage">
            <div class="tile-stage-title">one y cancels with -y</div>
            <div class="tile-row">
              <span class="algebra-tile algebra-tile--y">y</span>
              <span class="algebra-tile algebra-tile--y">y</span>
              <span class="tile-cancel-pair">
                <span class="algebra-tile algebra-tile--y">y</span>
                <span class="algebra-tile algebra-tile--y algebra-tile--negative">-y</span>
              </span>
            </div>
          </div>
        </div>
        <div class="tile-equation">Six x-tiles and two y-tiles remain: 6x + 2y</div>
      </div>
    `,
    example: {
      ...(existing.example || {}),
      narration_intro: 'We have four terms. First, we identify which terms have the same variable part. Then we combine only the coefficients in each group.',
      formulas: [
        '4x + 2x = (4 + 2)x = 6x',
        '3y - y = (3 - 1)y = 2y',
        '6x + 2y is simplified because x and y are different variable parts'
      ],
      steps: [
        {
          equation: '4x + 3y + 2x − y',
          annotation: 'Spot the like terms first',
          narration: 'Look for terms with the same variable part. The x terms are 4x and 2x. The y terms are 3y and negative y.',
          visual: `
            <div class="algebra-tile-board">
              <div class="tile-stage">
                <div class="tile-stage-title">Expression as physical tiles</div>
                <div class="tile-row">
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--y">y</span>
                  <span class="algebra-tile algebra-tile--y">y</span>
                  <span class="algebra-tile algebra-tile--y">y</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--y algebra-tile--negative">-y</span>
                </div>
              </div>
              <div class="visual-note">Each tile represents one variable piece. Tall blue tiles are x. Wide green tiles are y. Red means a negative y.</div>
            </div>
          `,
        },
        {
          equation: '(4x + 2x) + (3y − y)',
          annotation: 'Grouped by variable',
          narration: 'Group like terms together: x terms in one group and y terms in another. Grouping makes the combining step easier to see.',
          visual: `
            <div class="algebra-tile-board">
              <div class="visual-group-grid">
                <div class="tile-stage">
                  <div class="tile-stage-title">x bucket</div>
                  <div class="tile-row">
                    <span class="algebra-tile algebra-tile--x">x</span>
                    <span class="algebra-tile algebra-tile--x">x</span>
                    <span class="algebra-tile algebra-tile--x">x</span>
                    <span class="algebra-tile algebra-tile--x">x</span>
                    <span class="algebra-tile algebra-tile--x">x</span>
                    <span class="algebra-tile algebra-tile--x">x</span>
                  </div>
                </div>
                <div class="tile-stage">
                  <div class="tile-stage-title">y bucket</div>
                  <div class="tile-row">
                    <span class="algebra-tile algebra-tile--y">y</span>
                    <span class="algebra-tile algebra-tile--y">y</span>
                    <span class="algebra-tile algebra-tile--y">y</span>
                    <span class="algebra-tile algebra-tile--y algebra-tile--negative">-y</span>
                  </div>
                </div>
              </div>
              <div class="visual-note">Like terms are not just similar text. They are the same kind of object, so they can be counted together.</div>
            </div>
          `,
        },
        {
          equation: '6x + (3y − y)',
          annotation: 'x terms combined: 4 + 2 = 6',
          narration: 'Combine the x coefficients: 4 plus 2 equals 6. Keep the x, so 4x plus 2x becomes 6x.',
          visual: `
            <div class="algebra-tile-board">
              <div class="tile-stage">
                <div class="tile-stage-title">count the x tiles</div>
                <div class="tile-row">
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="operator-badge">+</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="algebra-tile algebra-tile--x">x</span>
                  <span class="operator-badge">=</span>
                  <span class="term-card term-card--x">6x</span>
                </div>
              </div>
              <div class="visual-note">The coefficient is the number of x tiles. Four x tiles plus two x tiles makes six x tiles.</div>
            </div>
          `,
        },
        {
          equation: '6x + 2y',
          annotation: 'Done — fully simplified',
          narration: 'Now combine the y coefficients: 3 minus 1 equals 2. The final expression is 6x plus 2y.',
          visual: `
            <div class="algebra-tile-board">
              <div class="visual-group-grid">
                <div class="tile-stage">
                  <div class="tile-stage-title">x result</div>
                  <div class="tile-row">
                    <span class="term-card term-card--x">6x</span>
                  </div>
                </div>
                <div class="tile-stage">
                  <div class="tile-stage-title">y result after cancellation</div>
                  <div class="tile-row">
                    <span class="algebra-tile algebra-tile--y">y</span>
                    <span class="algebra-tile algebra-tile--y">y</span>
                    <span class="tile-cancel-pair">
                      <span class="algebra-tile algebra-tile--y">y</span>
                      <span class="algebra-tile algebra-tile--y algebra-tile--negative">-y</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="tile-equation">Remaining tiles: 6x + 2y</div>
              <div class="visual-note">A positive y tile and a negative y tile cancel out, leaving two y tiles.</div>
            </div>
          `,
        },
      ],
    },
  };
}

function main() {
  console.log('Reading ' + LESSON_KEY + ' from remote KV...');
  const raw = kvGet(LESSON_KEY);
  const lesson = JSON.parse(raw);
  const enriched = enrichLesson(lesson);

  console.log('Writing enriched lesson to remote KV...');
  kvPut(LESSON_KEY, JSON.stringify(enriched));
  console.log('Done. Enriched:', LESSON_KEY);
}

main();
