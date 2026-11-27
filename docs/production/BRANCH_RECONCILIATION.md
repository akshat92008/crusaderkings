# Sovereign 1450 — Branch Reconciliation Register

**Audit Scope:** All **103** git branch references (`git branch -a`) compared against `main` (`2bbf4d0`).  
**Rule:** Never blind-merge legacy branches into `main`. Every non-main branch is assigned one of the 5 Phase 1 classifications.

---

## 1. Summary

| Classification | Count | Handling Rule |
| :--- | :---: | :--- |
| **Already integrated** | **63** (ancestor/merged refs) + **35** superseded PR/feature branches | Safe to archive/prune after tag preservation |
| **Contains useful missing work** | **3** | Selectively port & re-verify specific surgical fixes only |
| **Obsolete / Replaced architecture** | **2** (`origin/stylized-vfx-engine`, `sovereign-1450-backup` ancestor) | Do NOT merge; archive reference only |
| **Conflicting implementation** | **0** active | Resolved during selective ports |
| **Experimental** | **0** unmerged active | Any future R&D uses short-lived task branches |

---

## 2. Detailed Non-Main Branch Classification

### A. Branches Containing Useful Missing Work (Selective Port Required)

1. **`origin/operation-ck2/multi-front-vassals`** (`8a4960e` + `ea043fd` lineage)
   - **Verified missing patches vs. `main`:**
     - `src/estate-conflicts.js`: adds `live(g,actor).realm!==r` guard inside `estateRetinue()` to **prevent private retinue resurrection after cross-realm title transfers** (`commit 8a4960e`).
     - `tests/estate-conflicts.test.mjs`: 13-line regression test verifying retinue non-resurrection after title transfer.
     - `tests/strategic-ai.test.mjs` (`b639dc2`): regression test verifying autonomous courts dispatch separate armies toward two reachable war fronts.
   - **Action:** **Selectively port** the `live(g, actor).realm !== r` guard and both regression tests in Phase 2 (`Shared Simulation Integrity`). Do NOT merge whole branch (ancestor diverges behind newer `main` work).

2. **`origin/operation-ck2/subholdings`** (`8f1f449`)
   - **Verified state vs. `main`:** `src/subholdings.js` and `src/feudal-obligations.js` core subholding mechanics are already in `main`; contains `docs/OPERATION_CK2_LEDGER.md` checkpoint notes and explicit 10-year dense-atlas endurance test threshold checks (`2a3184a`).
   - **Action:** **Selectively inspect & verify** test coverage for subholding annual save restoration during Phase 2.

3. **`origin/codex/runtime-art-and-audio`** (`5d8d988`)
   - **Verified state vs. `main`:** Early runtime art/audio hook (`scripts/inspect_art_sheets.py` and `docs/RUNTIME_ASSETS.md` already present in `main`); inspect any audio score fallback delta in `src/field-audio.js` against current `main` during Phase 15.
   - **Action:** **Selectively audit** `src/field-audio.js` optional battle-score hook before deleting remote branch.

---

### B. Obsolete / Incompatible Architecture (DO NOT MERGE)

| Branch | Tip Commit | Reason |
| :--- | :--- | :--- |
| **`origin/stylized-vfx-engine`** | `81a68e6` | Separate unrelated Next.js / TypeScript / Tailwind skeleton (`app/page.tsx`, `KaliyugaArena.tsx`, `ue5GraphicsEngine.ts`) with no common merge base with Sovereign 1450. **Never merge.** |
| **`origin/source`** | `597ed7c` | Root import branch for the 100 Kadamba / Chalukyan temple GLBs; those files (`source/*.glb`) are already tracked in `main`. **Archive.** |
| **`sovereign-1450-backup`** | `95cb616` | Ancestor checkpoint strictly behind `main` (`2bbf4d0`). **Keep only until tagged backup archived, do not merge.** |
| **`baseline-aac39b3`** | `aac39b3` | Early ancestor checkpoint already integrated into `main`. **Archive.** |

---

### C. Merged / Superseded Historical Development & Content Branches (Already Integrated)

All **33** remaining unmerged-tip remote feature/content/agent branches (`origin/codex/strategic-front-priorities`, `origin/codex/vassal-political-autonomy`, all `origin/content/*` branches, all `origin/feature/phase17-*`, `phase18`, `01`–`07`, and local/merged `swarm-chatgpt-depth-f16577bd`, `swarm-codex-warfare-c9450ae6`, `swarm-neon-presentation-c240c88e`) had their implementations integrated via `merge`/squash commits into `2bbf4d0` (for example, `src/strategic-ai.js` on `main` already includes `ownedRealms`, `PERSONALITY_PROFILES`, and `warSignature()` ahead of `c41d4f6`), while later diffs reflect branch-behind staleness rather than newer features.

- **Action:** Re-verify each domain in the Feature Verification Matrix (`FEATURE_VERIFICATION_MATRIX.md`) against live `main` code, then clean up stale `origin/*` refs once Phase 2 selective ports land.
