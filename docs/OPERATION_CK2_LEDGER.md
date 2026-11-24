# Operation CK2 — checkpoint ledger

This ledger distinguishes implementation candidates from verified integration. It is not a claim of Crusader Kings II feature parity.

## Verified checkpoints

| Checkpoint | Commit | Evidence |
|---|---|---|
| Initial repository baseline | aac39b37b3dc03902efc5eedd64feaa60ec3b6c0 | Baseline for the integration sprint |
| Character dilemma validity, war plan invalidation, numerical combat tests | 6668bb6838150ff47a88e9a38f42185aeaa35b64 | 583/583 tests; three successful CI workflows; integrated on main |
| Estate evidence, appointment eligibility and research diffusion | a4ed1ad71f20814073e4bbdf482d4658e1d510e0 | 587/587 tests; six successful CI workflows; integrated on main |
| Multi-front strategy and vassal political autonomy | 8a4960eb556e5cc0096e8b6232d16c710797226a | PR #91; CI pending at ledger authoring |
| Castle, city and temple seats | 2a3184ae7634c7c6240e15a2ea30620911191e25 | Implementation candidate; dedicated tests and ten-year endurance gate added; CI pending |

CI evidence: [first checkpoint](https://github.com/akshat92008/crusaderkings/actions/runs/45461610259), [second checkpoint](https://github.com/akshat92008/crusaderkings/actions/runs/45462671641).

## Reconciliation

Original branch inventory: 94 branches including main. Of the other 93, 55 are ancestors, 37 diverged, and one VFX branch has no common ancestor. This is a commit-relationship inventory, not a guarantee that every divergent change has been semantically reconciled. Recent Codex strategic-front and vassal-autonomy changes were selectively reconciled in PR #91, preserving newer systems. Older divergent branches need per-change review; do not bulk merge them. No branches were deleted. The audio branch needs asset provenance/licensing review.

## Scope still open

The existing game and newly integrated features provide meaningful campaign mechanics, but independent baron play, a complete five-tier feudal hierarchy, wider dynastic/political simulations, historically validated content depth and long-duration balancing require further work. Do not mark the entire 18-phase plan complete from green tests alone. The new ten-year CI gate is distinct from the longer 100-year endurance target. A physical-device performance audit and commercial release acceptance remain outstanding.

## Integration rule

Use exact tested commits; do not force-update main or deploy an unverified candidate as a final release. Preserve earlier tests and save compatibility. No siege/base-building/multiplayer expansion.
