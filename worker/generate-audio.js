#!/usr/bin/env node
// generate-audio.js — ElevenLabs MP3 voice lines for PAA walkthroughs
//
// From project root (math-practice/):
//   node worker/generate-audio.js algebra-n1
//   node worker/generate-audio.js arit-n1
//
// If your shell is already in worker/:
//   node generate-audio.js algebra-n1
//   node generate-audio.js arit-n1
//
// Never deployed — local tooling only.

'use strict';

const fs   = require('fs');
const path = require('path');

const { SETS } = require('./audio-lines');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

const setName = process.argv[2] || 'algebra-n1';
const lines   = SETS[setName];

if (!lines) {
  console.error(`Unknown set "${setName}". Available: ${Object.keys(SETS).join(', ')}`);
  process.exit(1);
}

if (!API_KEY || !VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'frontend', 'audio');

async function generateLine(line) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const res  = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key':   API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text:           line.text,
      model_id:       'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`ElevenLabs error ${res.status} for ${line.file}: ${msg}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const dest   = path.join(OUTPUT_DIR, line.file);
  fs.writeFileSync(dest, buffer);
  console.log(`  ✓ ${line.file} (${buffer.length} bytes)`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created ${OUTPUT_DIR}`);
  }

  console.log(`\nSet: ${setName} — generating ${lines.length} files → frontend/audio/\n`);

  for (const line of lines) {
    await generateLine(line);
  }

  console.log('\nDone.');
  console.log('If walkthrough voice changed, bump WALKTHROUGH_AUDIO_REV in frontend/lesson.html and deploy.\n');
}

main().catch(err => { console.error(err.message); process.exit(1); });
