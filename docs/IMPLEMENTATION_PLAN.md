# Implementable project roadmap after prototype

Each milestone must be individually testable before advancing.

## Stage A — data correctness and source traceability (highest priority)

**Deliverables:** actual 1450 polygon/culture/government data instead of synthetic cells; dedicated province IDs; named cities, capitals, adjacency by polygons; maritime straits; source citations per polity. Maintain a source ledger for uncertain boundaries.

**Acceptance:** a researcher can trace every border/political claim to evidence. Tests check no duplicate provinces, zero-area holes, land/sea consistency, faction-at-least-one-province, and consistent adjacency. Never use present-day sovereign borders as 1450 historical truth.

## Stage B — warfare foundations

**Deliverables:** campaign armies move through multiple provinces with travel time and supply; occupation/siege phases; alliances bring armies into wars; battlefield has unit composition and formation orders; losses use actual army troop counts.

**Acceptance:** enter battle from real map, command groups, auto-retreat, resolve correctly; 100 repeated battle simulations produce no negative troop counts, teleportation or corrupt ownership. Pause, restart and reload battle snapshot deterministically.

## Stage C — political depth

**Deliverables:** ruler character records, courts, succession and heirs, loyalty/faction influence, provincial autonomy, laws with faction consequences, rebellions and vassal management.

**Acceptance:** at least 10 tested policy/crisis scenarios with visible outcomes. A regency or royal succession causes political changes and does not destroy save files.

## Stage D — economy and world systems

**Deliverables:** production goods, local markets, multi-step trade routes, road investment, famine, price elasticity, shipping ports and sea traversal. Culture-specific buildings and institutions.

**Acceptance:** trade routes produce auditable economic flows; no economy allows infinite funds through a building loop; bankrupt and food-shortage scenarios recover through player intervention.

## Stage E — real-time battle quality

**Deliverables:** integrate individually verified CC0 Kenney/Quaternius assets, glTF animations, battle SFX and terrain PBR materials; instance groups rather than per-soldier AI; selection highlights and formations, siege variants.

**Acceptance:** 30+ fps at target soldier counts on an agreed mid-range desktop; WebGL2 GPU-tested on Chrome/Edge/Firefox/Safari as possible; coherent art and input latency. Add accessibility and graphics quality settings.

## Stage F — diplomacy, intelligence and historical events

**Deliverables:** casus belli, peace treaties, claims, truces, dynastic unions, marriage, espionage, credible AI grand strategy, 1450 event chains localized to each region.

**Acceptance:** AI can hold, defend and break alliances intelligently; exploit detection/retaliation has consequences; diplomatic war outcomes remain consistent with unit and map states.

## Stage G — shipping and distribution

**Deliverables:** production bundler, caching, crash reporting with consent, player settings, tutorial, pause on background, keyboard remapping, tested save migration, clean release pipeline and hosted playable browser build.

**Acceptance:** fresh users play a complete 20-minute loop with no instructions from the developer. 3+ desktop browsers verified. Input works across standard resolutions. No unverified third-party assets in release.
