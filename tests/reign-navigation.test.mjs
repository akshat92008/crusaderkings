import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/court-theme.css', import.meta.url), 'utf8');
const dock = html.match(/<nav id="quick-nav"[\s\S]*?<\/nav>/)?.[0];

test('campaign dock exposes six destinations below the map', () => {
  assert.ok(dock);
  assert.ok(html.indexOf('id="quick-nav"') > html.indexOf('id="world-map"'));
  for (const tab of ['realm','court','diplomacy','economy','military']) {
    assert.ok(dock.includes('data-priority-tab="' + tab + '"'), tab);
    assert.ok(html.includes('data-tab="' + tab + '"'), tab);
  }
  for (const utility of ['search','chronicle']) assert.ok(dock.includes('data-priority-tab="' + utility + '"'));
  assert.ok(dock.includes('id="open-hometown"'));
  assert.ok(main.includes("closest('[data-priority-tab]')"));
  assert.ok(main.includes("el('open-hometown').addEventListener"));
});

test('legacy management tabs and unique DOM hooks are preserved', () => {
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const tab of ['realm','search','decrees','diplomacy','court','characters','dynasty','council','vassals','political','society','heritage','economy','military','naval','strategy','stories','titles','identity','trade','legacy','chronicle']) {
    assert.ok(html.includes('data-tab="' + tab + '"'), tab);
  }
  for (const id of ['army-outliner','outliner-list','outliner-count','mobile-battle-shortcut','open-management','open-province','open-hometown','world-map']) assert.ok(ids.includes(id), id);
});

test('campaign dock has responsive sizing and keyboard focus styling', () => {
  assert.match(css, /\.reign-nav>button:focus-visible/);
  assert.match(css, /\.reign-nav #outliner-list/);
  assert.match(css, /@media\(max-width:420px\)\{[\s\S]*?\.reign-nav/);
});
