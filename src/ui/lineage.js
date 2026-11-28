import {portraitImage} from '../game-art.js';

const individual = (person, role, esc) => `<article class="lineage-person">
  ${portraitImage(person)}
  <button type="button" data-character="${esc(person.id)}">${esc(person.name)}</button>
  <small>${esc(role)} · ${person.age}y · ${person.alive ? 'Living' : 'Deceased'}</small>
  <small>${esc(person.house || '')}</small>
  <button type="button" data-lineage-focus="${esc(person.id)}">Trace family</button>
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
    }
    draw() {
      const {game, ruler, heir, esc} = contexts.get(this);
      const people = game.politics.people;
      const focus = people[this.state.person] || ruler;
      const parents = focus.parents || [];
      const children = focus.children || [];
      const spouses = new Set([focus.spouse, ...(focus.spouses || [])]);
      const siblings = parents.flatMap(id => people[id]?.children || []).filter(id => id !== focus.id);
      const row = (label, ids, role) => {
        const members = [...new Set(ids)].map(id => people[id]).filter(Boolean);
        if (!members.length) return '';
        return `<section><h4>${label}</h4><div class="lineage-generation">${members.map(person => {
          const title = person.id === ruler.id ? 'Sovereign' : person.id === heir?.id ? 'Heir' : role(person);
          return individual(person, title, esc);
        }).join('')}</div></section>`;
      };
      this.innerHTML = `<header class="lineage-controls"><strong>${esc(focus.house || focus.name)}</strong>
        <button type="button" data-zoom="-0.25" aria-label="Zoom out">−</button><output aria-live="polite"></output>
        <button type="button" data-zoom="0.25" aria-label="Zoom in">+</button>
        <button type="button" data-lineage-focus="${esc(ruler.id)}">Sovereign</button></header>
        <div class="lineage-view" role="region" tabindex="0" aria-label="Family tree of ${esc(focus.name)}"><div class="lineage-rows">
        ${row('Parents', parents, () => 'Parent')}
        ${row('Household', [focus.id, ...spouses], person => person === focus ? 'Selected' : 'Consort')}
        ${row('Children', children, () => 'Child')}
        ${row('Siblings', siblings, () => 'Sibling')}</div></div>`;
      this.applyZoom();
      const viewport = this.querySelector('.lineage-view');
      viewport.scrollLeft = this.state.x;
      viewport.scrollTop = this.state.y;
      viewport.onscroll = () => { this.state.x = viewport.scrollLeft; this.state.y = viewport.scrollTop; };
    }
  }
  customElements.define('royal-lineage', RoyalLineage);
}
