import {portraitImage} from '../game-art.js';
import {getRealmCoA, renderCoASvg} from './coat-of-arms.js';

export function buildFiveGenerationTree(people = {}, focusId) {
  const focus = people?.[focusId];
  if (!focus) {
    return { grandparents: [], parents: [], generation: [], children: [], grandchildren: [] };
  }
  const parents = [...new Set((focus.parents || []).filter(id => people[id]))];
  const grandparents = [...new Set(parents.flatMap(pid => people[pid]?.parents || []).filter(id => people[id]))];
  const auntsUncles = [...new Set(grandparents.flatMap(gid => people[gid]?.children || []).filter(id => people[id] && !parents.includes(id)))].slice(0, 6);
  const spouses = [...new Set([focus.spouse, ...(focus.spouses || [])].filter(id => id && people[id]))];
  const siblings = [...new Set(parents.flatMap(pid => people[pid]?.children || []).filter(id => id && id !== focus.id && people[id]))];
  const children = [...new Set((focus.children || []).filter(id => people[id]))];
  const grandchildren = [...new Set(children.flatMap(cid => people[cid]?.children || []).filter(id => people[id]))];
  return {
    grandparents,
    parents: [...parents, ...auntsUncles],
    generation: [focus.id, ...spouses, ...siblings],
    children,
    grandchildren
  };
}

const individual = (person, role, esc, { isRuler, isHeir, isFocus } = {}) => `<article class="lineage-person${person.alive ? '' : ' is-deceased'}${isRuler ? ' is-ruler' : ''}${isFocus ? ' is-focus' : ''}" data-person-id="${esc(person.id)}">
  ${portraitImage(person)}
  <button type="button" data-character="${esc(person.id)}">${isRuler ? '♛ ' : isHeir ? '★ ' : ''}${esc(person.name)}</button>
  <small>${esc(role)} · ${person.age}y · ${person.alive ? 'Living' : '✝ Deceased'}</small>
  <small>${esc(person.house || '')}</small>
  <button type="button" data-lineage-focus="${esc(person.id)}">Trace 5-gen</button>
</article>`;

const contexts = new WeakMap();
const views = new WeakMap();
let counter = 0;
const scheduled = new Map();

export function renderLineage(game, ruler, heir, esc) {
  // Keep live records outside HTML. The host releases its reference on replacement.
  const key = ++counter;
  const context = {game, ruler, heir, esc};
  scheduled.set(key, context);
  queueMicrotask(() => scheduled.delete(key));
  return `<royal-lineage data-key="${key}"></royal-lineage>`;
}

function drawTreeConnectors(host) {
  const rowsEl = host.querySelector('.lineage-rows');
  const svg = host.querySelector('.lineage-tree-lines');
  if (!rowsEl || !svg) return;
  const rect = rowsEl.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  svg.setAttribute('viewBox', `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`);
  const people = contexts.get(host)?.game?.politics?.people || {};
  const cards = new Map();
  for (const el of rowsEl.querySelectorAll('.lineage-person[data-person-id]')) {
    const r = el.getBoundingClientRect();
    cards.set(el.dataset.personId, {
      cx: r.left - rect.left + r.width / 2,
      top: r.top - rect.top,
      bottom: r.bottom - rect.top
    });
  }
  const paths = [];
  for (const [id, box] of cards) {
    const p = people[id];
    if (!p?.parents?.length) continue;
    for (const pid of p.parents) {
      const pbox = cards.get(pid);
      if (!pbox || pbox.bottom >= box.top) continue;
      const midY = (pbox.bottom + box.top) / 2;
      paths.push(`<path d="M${pbox.cx.toFixed(1)},${pbox.bottom.toFixed(1)} C${pbox.cx.toFixed(1)},${midY.toFixed(1)} ${box.cx.toFixed(1)},${midY.toFixed(1)} ${box.cx.toFixed(1)},${box.top.toFixed(1)}"/>`);
    }
  }
  svg.innerHTML = paths.join('');
}

if (typeof customElements !== 'undefined' && !customElements.get('royal-lineage')) {
  class RoyalLineage extends HTMLElement {
    connectedCallback() {
      const context = contexts.get(this) || scheduled.get(Number(this.dataset.key));
      if (!context) return;
      contexts.set(this, context);
      const {game, ruler} = context;
      if (!views.has(game)) views.set(game, new Map());
      const byRealm = views.get(game);
      if (!byRealm.has(game.player)) byRealm.set(game.player, {person: ruler.id, zoom: 1, x: 0, y: 0});
      this.state = byRealm.get(game.player);
      this.onclick = event => {
        const control = event.target.closest('button');
        if (!control) return;
        if (control.dataset.lineageFocus) {
          this.state.person = control.dataset.lineageFocus;
          this.state.x = this.state.y = 0;
          this.draw();
          this.querySelector('.lineage-view')?.focus();
        } else if (control.dataset.zoom) {
          this.state.zoom = Math.max(0.75, Math.min(1.5, this.state.zoom + Number(control.dataset.zoom)));
          this.applyZoom();
        }
      };
      this.draw();
    }
    applyZoom() {
      this.querySelector('.lineage-rows').style.zoom = String(this.state.zoom);
      this.querySelector('output').textContent = Math.round(this.state.zoom * 100) + '%';
      for (const button of this.querySelectorAll('[data-zoom]')) {
        button.disabled = Number(button.dataset.zoom) < 0 ? this.state.zoom <= 0.75 : this.state.zoom >= 1.5;
      }
      requestAnimationFrame(() => drawTreeConnectors(this));
    }
    draw() {
      const {game, ruler, heir, esc} = contexts.get(this);
      const people = game.politics.people;
      const focus = people[this.state.person] || ruler;
      const tree = buildFiveGenerationTree(people, focus.id);
      const spouses = new Set([focus.spouse, ...(focus.spouses || [])]);
      const directParents = new Set(focus.parents || []);
      const coaSvg = renderCoASvg(getRealmCoA(game, game.player), { size: 32, esc });
      const row = (genTag, label, ids, role) => {
        const members = [...new Set(ids)].map(id => people[id]).filter(Boolean);
        if (!members.length) return '';
        return `<section class="lineage-tier"><div class="lineage-tier-head"><small class="lineage-gen-pill">${esc(genTag)}</small><h4>${esc(label)}</h4></div><div class="lineage-generation">${members.map(person => {
          const title = person.id === ruler.id ? 'Sovereign' : person.id === heir?.id ? 'Designated Heir' : role(person);
          return individual(person, title, esc, {
            isRuler: person.id === ruler.id,
            isHeir: person.id === heir?.id,
            isFocus: person.id === focus.id
          });
        }).join('')}</div></section>`;
      };
      this.innerHTML = `<header class="lineage-controls"><span class="lineage-crest">${coaSvg}</span><strong>${esc(focus.house || focus.name)} · 5-Generation Pedigree</strong>
        <button type="button" data-zoom="-0.25" aria-label="Zoom out">−</button><output aria-live="polite"></output>
        <button type="button" data-zoom="0.25" aria-label="Zoom in">+</button>
        <button type="button" data-lineage-focus="${esc(ruler.id)}">Center Sovereign</button></header>
        <div class="lineage-view" role="region" tabindex="0" aria-label="Five-generation family tree of ${esc(focus.name)}"><div class="lineage-rows" style="position:relative">
        <svg class="lineage-tree-lines" aria-hidden="true"></svg>
        ${row('Gen +2', 'Grandparents', tree.grandparents, () => 'Grandparent')}
        ${row('Gen +1', 'Parents & Senior Kin', tree.parents, person => directParents.has(person.id) ? 'Parent' : 'Senior Kin')}
        ${row('Gen 0', 'Sovereign, Consorts & Siblings', tree.generation, person => person === focus ? 'Focus' : spouses.has(person.id) ? 'Consort' : 'Sibling')}
        ${row('Gen -1', 'Children', tree.children, () => 'Child')}
        ${row('Gen -2', 'Grandchildren', tree.grandchildren, () => 'Grandchild')}</div></div>`;
      this.applyZoom();
      const viewport = this.querySelector('.lineage-view');
      viewport.scrollLeft = this.state.x;
      viewport.scrollTop = this.state.y;
      viewport.onscroll = () => { this.state.x = viewport.scrollLeft; this.state.y = viewport.scrollTop; };
      requestAnimationFrame(() => drawTreeConnectors(this));
    }
  }
  customElements.define('royal-lineage', RoyalLineage);
}
