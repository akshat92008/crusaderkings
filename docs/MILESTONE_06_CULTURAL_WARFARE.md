# Crown of Nations — Milestone 06: Kingdom Military Identity and Playable Enemy Sieges

## Actual changes

### 15 distinct military traditions
- Longbow Companies, Chivalric Host, Pike Companies, Firearms and Pavises, Steppe Host, Household Infantry, Elephant Host, Retainer Warbands, Archery Companies, Riverland Infantry, Highland Warriors, Woodland Warbands, Maritime Militia, Warrior Orders and Provincial Levies.
- Each has an associated identity, specialist unit *designation*, actual infantry/archer/cavalry recruitment mixture, preferred formations, and attack/defense/range/speed modifiers.
- Starting armies across 44 factions are no longer the same four-infantry/one-archer/one-cavalry mix.
- Recruitment gives an 18% discount to each doctrine's most-used troop category.
- All units remain abstracted into infantry, archer and cavalry classes for strategic rules. Specialist names currently change the doctrine and balance profile; they do **not** imply that unique character GLBs or distinct war elephant meshes have been made.

### Ten tactical formations that affect combat
- Shield Wall, Pike Square, Cavalry Wedge, Skirmish Screen, Volley Line, Longbow Line, Encirclement, Elephant Push, Flanking Column, Ambush Formation.
- The formations change actual speed, damage, defense, projectile range, and counter-matchup calculations. The simulated enemy can switch to a legal counterformation.
- The 3D renderer now positions the animated KayKit soldiers in visible rows, squares, wedges, flanking columns and arcs rather than identical grids.
- The attacker can choose the formation of the selected regiment. The campaign retains the previous 3D soldier models, original architecture and 2D fallback.

### Defensible rival-initiated invasions
- Neighboring AI kingdoms evaluate actual border targets, available field armies, relative power, treasury, and alliance restrictions.
- Enemy armies must mobilize, spend treasury, march through their own connected provinces to a border and give a warning before attack.
- Peaceful difficulty disables AI invasion planning. Normal and Hard have different risk tolerances.
- When the enemy arrives, the player is presented with a **playable defense battle**. The player controls the garrison and any stationed field army. Enemy units attack, and player decisions determine the outcome.
- Defensive battle results transfer province ownership only after the battle, apply losses to surviving real armies, adjust prestige and fort levels, and may make surviving defenders retreat. An Auto Resolve option remains available.
- A headless simulation advancing beyond a ready defensive siege can resolve it automatically to avoid a permanent frozen campaign.

### Battle deployment
- Assaults and defensive battles begin in a preparation state.
- Choose a regiment, select its available formation, choose a left/center/right deployment lane, then click **Start Assault**.
- Formation selection modifies actual combat statistics and squad shapes; this is a small initial step toward deployment-driven strategy, not yet complete Clash of Clans-style base destruction.

## Verification
- Deterministic campaign tests and browser integration tests validate troop mixes, damage and counters, invasion staging, warning period, successful and failed defenses, conquest results and save-state integrity.
- GitHub Actions compiles the self-hosted Three.js battle bundle and checks the packaged playable ZIP.
- Test screenshots and logs are attached as workflow artifacts.
- Actual target-browser/GPU frame rates and macOS quality checks are still outstanding.

## Source/license and historical caveats
- Existing infantry/archer characters from creator KayKit's official CC0 pack are retained.
- The cultural doctrine archetypes are original game designs inspired by broad historical roles. They are **not** verified reconstructions of every 1450 kingdom's exact army. In particular, an Elephant Push doctrine currently modifies cavalry-class statistics; it does not produce a finished elephant model.
- Existing 299 political provinces remain geographically synthetic and do not meet full CK3 accuracy.

## Remaining work
- True Clash-like destructible buildings, walls, pathfinding through breaches, towers and trap logic, deployment of heroes and siege equipment, settlement upgrades and battle stars.
- Complete strategic claims, war objectives, occupation, negotiated peace, vassal contracts, succession inheritance and autonomous campaign planning.
- Distinct animated units and horses for each broad cultural and geographic group, research-backed identities and meaningful regional art diversity.
- Worldwide historical 1450 county and holding data, rivers and roads, naval warfare, trade logistics, tutorial, balancing, optimization and human testing.

**This milestone is an incremental working improvement to the existing game—not a CK3/Clash feature-complete clone.**
