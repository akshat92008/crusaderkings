# Milestone 05 — Kingdom AI, Court, Trade and Campaign Content

## Delivered in the existing playable Crown of Nations: 1450 game

- **44 generated fictional royal dynasties** with a sovereign, heir, age, stewardship/martial/diplomatic ability, and succession. These are alternate-history characters, NOT the documented historical rulers of each faction in 1450.
- **Royal Court:** hold audiences to reduce unrest; promote stewards to increase economic output; improve marshal ability and army morale; commission chronicles for prestige; secure the succession for legitimacy.
- **Trade:** diplomatic merchant treaties add ongoing monthly income, based on the partners' developed markets. Alliances, gifts and insults remain available.
- **Royal marriages:** relation-dependent diplomatic action improves legitimacy and relations. This is a simplified dynastic tie; there are no inheritance claims or family trees yet.
- **23 interactive story events**, each with two consequential choices (including a zero-cost choice). Topics include famine, harvest, public festivities, guild disputes, envoys, frontier riders, scholars, royal progress, road patrols, plague relief, irrigation, industry, diplomacy and more.
- **Rival kingdom AI** invests in the economy, fields additional soldiers, establishes trade treaties and follows the existing border-conflict rules. Opponents may stage a warned assault on vulnerable player territory. The player has three full turns to reinforce the garrison, move an army or improve fortifications.
- **Difficulty:** Peaceful (no attacks against player), Normal, Hard (more willing to invade).
- **Legacy objectives:** six measurable campaign goals (land, prestige, gold, stability, trade partners, technology) with a score and final assessment in year 1500. Players can continue beyond that assessment.
- **Browser save compatibility:** old version-one saves gain new kingdom data when loaded without losing armies/province ownership. New saves serialize court and event decisions.

## AI architecture

This milestone implements **rule-based, deterministic strategic AI**, not a neural network, free-form agent, remote inference service or trained behavior model. It runs completely offline in the browser. The AI does not yet plan multilayer campaigns, devise long-term diplomatic strategy, execute advanced naval operations, or perform human-like tactical reasoning. Claiming that the game has comprehensive autonomous AI would be misleading.

## How to play

1. Download the current ZIP, extract and serve with `python3 -m http.server 8080`.
2. Choose a faction and AI difficulty, then begin your reign.
3. Open **ROYAL COURT** to manage the dynasty, appoint advisors and respond to events.
4. Open **DIPLOMACY** to send gifts, sign merchant treaties or arrange marriages; use **TRADE** to see connected economies.
5. Open **LEGACY** to view six victory objectives and the year-1500 assessment.
6. Advance the months and watch the Chronicle. Invasions generate three-month warnings and can be countered with troops and fortifications.
7. Existing Battle Showcase and real-time 3D combat continue to work.

## Verification

- Node simulation and deterministic AI tests include a 100-year playthrough, serializable saves, province ownership, invasion timing and 23 valid court event chains.
- Playwright/Chromium end-to-end testing launches a faction, uses court advisors, negotiates trade and dynastic marriage, chooses an event response, checks legacy objectives and saves. Existing 3D battle QA is retained.
- This is a development preview. It is **not** a complete grand-strategy game or historically precise 1450 simulation.

## Major unfinished systems

- Accurate worldwide 1450 county-level boundaries and independently sourced historical characters, cultures and dynamic factions.
- Full family trees, succession laws, vassals, religious politics, complex warfare, diplomacy, espionage and peace treaties.
- Naval fleets, maritime trade paths, colonization, land transport and logistical supply.
- Sieges with destructible gates and walls, province-level siege combat, intelligent tactical maneuvering, and polished 3D cavalry.
- Regional settlement and army diversity, licensed integration of uploaded assets, scalable rendering, tutorials and balance studies.
- Performance benchmarking on target hardware, large-scale QA and production-quality release polish.
