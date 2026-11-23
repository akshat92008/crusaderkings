# Crown of Nations — long-term game blueprint

## Genre and scenario

- **Scenario:** open-ended 1450 CE historical sandbox with global scope, alternative history from simulation tick one.
- **Camera/modes:** pan/zoom political world map for administration; transition to a controllable real-time 3D battlefield on army confrontation.
- **Player role:** choose any historical polity, rule its resources/policies/diplomacy/military, build stability and expand through war or statecraft.
- **Victory:** sandbox (prestige, territorial/wealth milestones, personal goals, not a forced end). Later add scorecard by year 1700 or 1820.
- **Non-goal:** supernatural powers or gameplay ripped from an existing commercial strategy title. The design combines genres, uses original systems/code/assets.

## Prototype gameplay loop (implemented)

1. Pick one of 44 factions on the opening screen.
2. Choose a province and inspect its ownership, development, unrest, troops, fortifications and adjacency.
3. Expand the treasury by maintaining tolerable taxes, farming, markets and controlled military upkeep.
4. Enact or change three royal decrees; watch revenue, stability and local unrest respond each month.
5. Recruit infantry, archers or cavalry using province funds and choose the province's march order.
6. Move to an adjacent owned province or engage a rival. Tactical battle pauses the campaign.
7. On the battlefield, control regiments with clicks/1–6 and right-click orders. Fight an AI opponent with positional movement, simple target selection, ranged damage and morale/rout mechanics.
8. Return from a win/loss to apply army casualties and conquered province ownership, or to fall back.
9. Conduct diplomacy through gifts/insults/alliances, and review yearly chronicles as other polities conduct their own conflicts.

## Concrete economy rules — prototype

Each province has integer population, development, unrest and buildings (farm, market, barracks, fort).

- Monthly taxation: `round(sum[(population × (1 + 0.14 × development) + 28 × marketLevel) × 0.35 × taxMultiplier × (1 - unrest / 170)])`. Tax multipliers: 0.65 / 1.0 / 1.5 for low / normal / high.
- Monthly army cost: `round(0.08 × totalSoldiers)`. Troops initially act as a combined army within a province.
- Food balance: `round(sum[0.085 × population + 8 × farmLevel] - 0.025 × totalSoldiers)`.
- Stability moves toward or away from 52% mean unrest, and has extra penalties if treasury or food go negative.
- Unrest increases when taxes are high or mass levies active; pluralism and farm development reduce unrest. At high unrest, a province can revolt.
- Buildings have three upgrade levels and cost `baseCost × nextLevel`. Barracks lower the recruitment price; forts increase defenders in the battle.
- Enacting a law costs 80 gold. Other economic figures are temporary balancing assumptions, not historical claims.

## Combat rules — prototype and extension path

**Currently:** 6 selectable attacker formations vs 6 defenders, split into infantry, archers and cavalry; 3D units represented by instanced cuboids. Distances drive attack range, movement speed, attack cooldown, morale, fatigue proxy, damage and rout. Terrain includes flat field tiles, rocks, trees and a simple defensive wall. A win transfers the target province and applies casualties to its campaign army.

**Target battlefield systems:**

- Strong tactical preparation phase; redeployment and formation presets (line, column, shield wall, wedge).
- Per-regiment cohesion, experience, ammunition, stamina, morale and general ability.
- Armored infantry vs missile troops, archery range and line-of-sight, cavalry charges with momentum and braced counters.
- Height, cover, mud, rain, morale shock, command radius and supply wagons.
- Castles, bridges, deployment zones, siege towers, ladders, boiling oil, wall breach states and retreat routes.
- 200–2,000 visual soldiers per battle on desktop by instanced meshes and simulation at regiment/squad level, with a lower default on low-end machines. This is a future *target*, not a proven performance result.

## Campaign deep systems — expansion specification

| Domain | Intended full model | Current status |
|---|---|---|
| Laws and government | Government forms, administrative cost, faction estates, laws with social reactions | Three policy switches |
| Trade | Trade goods, production routes, merchants, supply vs demand, tariffs, port markets | Income from buildings |
| Diplomacy | Alliances, guarantees, royal marriages, vassalage, humiliation, tribute, peace negotiation | Gifts, insults, alliances |
| Characters | Ruler traits, royal households, succession, minister influence, education, health and crises | Faction-level governance only |
| Military campaign | March orders, supply, attrition, fog of war, warscore, occupation, sieges, peace settlements | Neighbor attacks and tactical transfer |
| Battlefield | Tactical formations, command latency, terrain, historical armies, siege engines, weather | WebGL2/Canvas regiment battle |
| Navy | Ship classes, coastal movement, blockades, maritime trade, colonization | Not implemented |
| Culture/religion | Region-specific institutions with respectful local research, language, tolerance, autonomy | Tolerance modifies unrest globally |
| Technology | Regional institutions, diffusion, military and civil advances | Placeholder tech fields |
| AI | Strategic goals, faction personalities, beliefs, risk tolerance, threat-response and negotiations | Investment and opportunistic war |

## Engineering — current implementation

```text
Static web server
  index.html + styles.css
          |
    src/main.js (controller)
       /          \
src/map.js       src/battle.js
Canvas2D          WebGL2 + fallback
       \          /
     src/simulation.js
           |
   data/world.json (immutable geometry)
           |
   Browser localStorage (save state)
```

- The sim is an ESM module with state represented by serializable plain objects. No direct DOM use in the simulation; functions take current `game` state as input.
- Each calendar tick iterates faction-level economies and province-level unrest, updates agriculture/markets, and runs limited AI military decisions. The visual layer re-renders after commands.
- `data/world.json` is a fixed-size binary-free JSON containing `factions[]` (IDs/names/locations/colors) and `provinces[]` (IDs, owners, lat/lon centroids, geometry, navigation neighbors, terrain, demographic test values).
- Canvas campaign map renders each synthetic province with owner color and supports pointer-based province selection.
- Battlefield renderer uses WebGL2 instancing with dynamic transforms/colors and a custom projection. Canvas fallback uses projected 3D cuboids when WebGL2 is missing.
- Browser save uses a version number and refuses incompatible map sizes. A production title would need robust save migrations.

## Architecture for future production

- Adopt TypeScript and a stable build tool once the zero-dependency prototype is validated. Add strict data schemas (Zod or JSON Schema), unit tests, integration tests, and automated performance regression checks.
- Move monthly turn simulation to a Web Worker with message-based snapshots, replay deterministic seeds for AI debugging, and support simulation cancellation.
- Introduce separate content packages: historical start-date/faction data, geography and province boundaries, economy/technology definitions, art/audio and localization.
- Upgrade battlefield into a standalone terrain renderer with skeletal animation, glTF asset loading, physics-light navigation, unit-instance batching, level-of-detail and profiling metrics.
- Preserve stable IDs for province/ruler/unit types and schema-based save migration.
- Keep content pipelines license-aware: exactly identified version, creator, license, copyright and attribution in manifest.

## Historical fidelity

The current world polygon source is public-domain Natural Earth. It is used only to generate continental geography. The prototype factions have historic names, but boundaries are drawn as **synthetic Voronoi sector cells** and assigned to nearby faction anchors. This does **not** recreate 1450 borders. Reconstructing the 1450 political atlas means choosing precise sources and independent verification for disputed dates, dynamic frontiers, regional polities, sovereignty and non-state societies, particularly Indigenous America, Australia and Oceania.

## Prototype acceptance criteria (current)

- [x] Single-page browser app launches without npm dependencies.
- [x] Player can choose from 44 factions and see a global map.
- [x] Change law, build a structure, recruit an army, advance time and save.
- [x] Select an adjacent hostile province and launch a controllable tactical battle.
- [x] Defeat/victory results in casualties and campaign state updates.
- [x] AI changes the political map through autonomous frontier conflicts.
- [x] Simulation unit tests and browser smoke test complete without JS exceptions in tested path.
- [ ] Real-world exact 1450 borders and province definitions.
- [ ] True Total War-scale visual/AI quality and production art.
- [ ] Fully realized dynasty simulation, naval combat, sieges, trade, peace treaties and historical events.
