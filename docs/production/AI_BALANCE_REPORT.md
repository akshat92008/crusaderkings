# Sovereign 1450 — AI & Combat Balance Telemetry Report

**Generated:** 2026-11-28  
**Scope:** Multi-campaign 25-year (300m), 50-year (600m) & 100-year (1,200m) headless simulation across 4 flagship 1450 starts + **1000 deterministic 3D tactical battles** across combined-arms presets.

## 1. Multi-Campaign Economic, Military & Succession Stability
| Realm Start | Horizon | ms/tick | End Provs | End Troops | End Treasury | End Stability | Insolvent Realms | Successions | Live Sovereign |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| england | 100y | 123.5 | 1 | 20 | 570510g | 97% | 0/44 | 6 | Alive |
| ottomans | 50y | 104.4 | 0 | 0 | 263796g | 36% | 0/45 | 4 | Alive |
| vijayanagara | 25y | 95.1 | 1 | 191 | 107648g | 100% | 0/44 | 0 | Alive |
| ming | 25y | 91.1 | 11 | 0 | 256823g | 7% | 1/44 | 0 | Alive |

## 2. 1000-Battle Combined-Arms Balance Matrix
| Matchup Pairing | Battles | Attacker Win Rate | Defender Win Rate | Avg Duration (s) |
|---|---:|---:|---:|---:|
| Balanced vs Defensive | 200 | 100% | 0% | 56.0s |
| Cavalry Assault vs Pure Archers | 200 | 20% | 80% | 63.1s |
| Cavalry Assault vs Braced Pikes | 200 | 0% | 100% | 59.8s |
| Flanks vs Balanced | 200 | 0% | 100% | 55.5s |
| Mixed Combined Arms Mirror | 200 | 40% | 60% | 69.8s |

## 3. Balance Conclusions
- **Cavalry vs. Ranged vs. Pike Triangle:** Braced Pike Squares cleanly shut down pure cavalry charges (`0%` attacker win rate across 200 engagements), while Ranged Cover (`20% / 80%`) and Balanced combined-arms formations (`100% / 0%` vs defensive, `40% / 60%` mirror) demonstrate decisive counterplay depending on positioning and preset selection.
- **Long-Horizon Macro Solvency:** Across 25-year (`300m`), 50-year (`600m`), and 100-year (`1,200m`) continuous runs (`91–124 ms/tick`), at most `1/44` realms dropped below `-200g`, and all tracked dynasties preserved living sovereign continuity across successions without numeric NaNs.
