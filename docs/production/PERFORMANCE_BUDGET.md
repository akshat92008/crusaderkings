# Sovereign 1450 — Performance & Memory Budget

**Reference Benchmark Hardware:** Apple M3 MacBook Air (8 GB unified RAM) + minimum Windows 8 GB integrated-GPU laptop.

---

## 1. Runtime Frame & Latency Budgets

| Metric | Low-Spec Minimum Target (8 GB iGPU) | Recommended Target (Desktop / M3) |
| :--- | :---: | :---: |
| **Campaign Map FPS** | Stable 30 FPS | 60 FPS |
| **Living Capital (2D Hometown) FPS** | Stable 30 FPS | 60 FPS |
| **3D Battle FPS** | Stable 30 FPS | 60 FPS |
| **Cold Application Startup** | `< 8s` | `< 5s` |
| **Campaign ↔ 3D Battle Transition** | `< 8s` | `< 4s` |
| **Active Process RAM (with Electron)** | `< 2.0 GB` (target `<= 1.6 GB`) | `< 1.5 GB` |
| **Save / Load Round-Trip** | `< 5s` | `< 3s` |
| **Long-Session Soak Stability** | 10+ continuous hours, zero OOM / leaks | Same |

---

## 2. 3D Visual Regiment Sampling Budget

Battle simulation computes exact soldier headcount (`troopCount`), while Three.js renders sampled instanced/rigged representatives by hardware preset (`Low` / `Medium` / `High`):

| Regiment / Battle Total Troops | Visual Soldiers Rendered (Medium Preset) | Notes |
| :---: | :---: | :--- |
| `<= 500` total | `80 – 120` models | Crisp small-to-medium skirmishes |
| `~2,000` total | `150 – 250` models | Standard early/mid-game battle |
| `~5,000` total | `300 – 500` models | Major royal army clash |
| `10,000+` total | `500 – 800` models (capped per preset) | Gameplay math unaffected by graphics preset |

---

## 3. Strict Cleanup & Package Size Discipline

1. **Zero Scene Leak Rule (Release Blocker):** Exiting `#battle-screen` MUST dispose all `AnimationMixer` instances, `BufferGeometry`, `Material`, `Texture` (`gl.deleteTexture`), `WebGLRenderTarget`, and DOM/pointer listeners, and verify heap memory stabilizes across **20 consecutive battles**.
2. **DPR & Shadow Clamping:** Cap pixel ratio (`min(devicePixelRatio, 1.5)` on Medium/High, `1.0` on Low); limit shadow casters to key sunlight + terrain/castles only.
3. **Strip Repo Bloat from Distribution Builds:** Keep `assets/packs/` (`1.3 GB`), `assets/documents/` (`294 MB`), `assets/cliopatria/` (`296 MB`), raw `assets/medieval_village/` (`168 MB`), `assets/portraits/` uncompressed originals (`451 MB`), and unused `source/*.glb` out of `dist/desktop-app/` so installer footprint stays lean (`< 500 MB` target).
