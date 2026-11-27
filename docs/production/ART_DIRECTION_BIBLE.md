# Sovereign 1450 — Art Direction Bible (*Sunlit Illuminated Chronicle*)

**Core Style:** **Sunlit Illuminated Chronicle** — warm parchment manuscripts, engraved royal brass, muted historical earth/mineral pigments, and readable grounded 3D historical armies under consistent directional sunlight.

---

## 1. Locked Colour & Surface Palette

| Swatch | Hex | Usage |
| :--- | :--- | :--- |
| **Meadow** | `#6E8450` | Temperate terrain grass, homeland pastures, positive field highlights |
| **Limestone** | `#A8A396` | Castles, fort walls, civic masonry, engraved borders |
| **Oak** | `#6F5139` | Timber palisades, rams, naval craft, architectural trim |
| **River** | `#4E748C` | Waterways, coasts, diplomatic treaties, maritime routes |
| **Royal Brass** | `#C49A45` | Crown framing, active selection markers, heraldic accents |
| **Slate Charcoal** | `#142629` | Primary panel backgrounds, dark framing, typography contrast |
| **Aged Parchment** | `#E8DCC2` / `#EFE6CE` | Chronicle cards, court manuscripts, event panels, tooltips |

---

## 2. Per-Layer Visual Rules

| Gameplay Layer | Rendering Tech | Visual Standard |
| :--- | :--- | :--- |
| **Campaign Map** | 2D Canvas + optional 3D Relief (`src/map.js`, `src/relief-map.js`) | Crisp parchment-cartography borders, clear realm labels, readable army banners & war indicators |
| **HUD & Screens** | HTML/CSS (`styles.css`, `assets/court-theme.css`) | 7 unified destinations (`Crown`, `Court`, `Diplomacy`, `Economy`, `Military`, `Capital`, `Chronicle`), zero clutter |
| **Character Portraits** | 2D Historical Painterly (`assets/game-art/portraits/` curated) | Consistent age/clothing/status framing; strip raw unedited `Gemini_Generated_Image_*.png` artifacts; cohesive painterly finish |
| **Event Illustrations** | Reusable Illustrated Archetypes (`assets/game-art/events/`) | ~15–20 curated historical painting scenes covering all 3,051 events by category (no 1-off low-grade generated images) |
| **Living Capital (`Hometown`)** | 2D 45-degree Isometric (`src/hometown-ui.js`, `src/hometown-scene.js`) | 5 distinct architectural silhouette tiers across 10 levels, synchronized lighting & ground paths |
| **3D Tactical Battles & Sieges** | Three.js WebGL2 (`src/three-battle-scene.js`) | Grounded stylized historical `0 A.D.` `mobile/` GLB soldiers/mounts + `CC0` medieval castles/trees; warm sunlit directional key + soft ambient fill; crisp heraldic banner/ring ground markers; minimal readable FX |

---

## 3. Anti-Jank & AI-Content Hygiene Rules
1. Never mix neon sci-fi bloom, cartoonish untextured boxes/spheres (remove legacy `createHorse()` cube mounts!), or glossy plastic materials with matte historical parchment.
2. Every unit family must align on `1.75m` normalized human height (`~3.1m` war elephant height), consistent ground-contact Y-offset (`0.0`), and shared directional lighting.
3. No raw uncurated AI output may ship in customer-facing slots; all portraits, UI art, and store capsules undergo manual visual inspection & provenance logging for truthful Steam disclosure.
