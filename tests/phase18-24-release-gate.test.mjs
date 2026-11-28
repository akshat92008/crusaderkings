import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SUPPORTED_LOCALES, BASE_STRINGS, t } from '../src/i18n.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

test('Phase 20: i18n localization supports English + priority locales without missing keys', () => {
  assert.deepEqual([...SUPPORTED_LOCALES], ['en', 'zh-CN', 'de', 'es', 'pt-BR']);
  for (const locale of SUPPORTED_LOCALES) {
    for (const key of Object.keys(BASE_STRINGS)) {
      const val = t(key, locale);
      assert.ok(typeof val === 'string' && val.length > 0, `Missing translation fallback for ${locale}:${key}`);
    }
  }
  assert.equal(t('start.begin', 'zh-CN'), '开启统治');
  assert.equal(t('start.begin', 'es'), 'COMENZAR REINADO');
});

test('Phase 18-24: offline desktop distribution bundle includes 0 A.D. assets, attribution licenses, and excludes raw packs', () => {
  const www = path.join(ROOT, 'dist', 'desktop-app', 'www');
  assert.ok(fs.existsSync(path.join(www, 'index.html')), 'Missing desktop www/index.html');
  assert.ok(fs.existsSync(path.join(www, 'assets/battle/0ad/manifest.json')), 'Missing desktop 0ad manifest.json');
  assert.ok(fs.existsSync(path.join(www, 'assets/battle/0ad/LICENSES.md')), 'Missing 0 A.D. CC BY-SA 3.0 attribution');
  assert.ok(fs.existsSync(path.join(www, 'docs/production/ASSET_LICENSE_REGISTER.md')), 'Missing license register in desktop build');
  assert.equal(fs.existsSync(path.join(www, 'assets/packs')), false, 'Raw packs bloat must NOT be bundled');
  assert.equal(fs.existsSync(path.join(www, 'assets/portraits')), false, 'Raw portrait bloat must NOT be bundled');
});
