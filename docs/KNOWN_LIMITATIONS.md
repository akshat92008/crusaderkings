# Current known limitations

The current main branch (`Sovereign: 1450`) contains the expanded 1450 global atlas (`980+` playable districts, `115+` historical 1450 polities across 6 continents, plus preserved `v1`-`v4` save compatibility); five on-demand management workspaces plus the **Mod Studio**, **Global Crossroads Eras (1450–1600)**, **Monarch Reign Chapters & Epithets**, **The Crown Dispatch**, IndexedDB + PWA durable storage (`sovereign1450-db`), asymmetric 14-DLC government & religious mechanics, strategic/character AI, and playable open-field tactical battles.

- Territory and district labels are historical-reference-aligned approximations (`Natural Earth` & `Cliopatria` 1450 sources). Initial populations/economies are balanced for strategy gameplay. No claim of exhaustive historical fidelity.
- Tactical forces use sampled animated soldiers and Banner Lines presentation without siege destructible walls by design. Battle code remains separated from campaign systems.
- AI is deterministic rule-based (`hashStr`). Extended multi-century playtesting and community balance feedback continue.
- Single-player static PWA and mobile WebView build (`capacitor.config.json`). IndexedDB stores multi-megabyte campaign saves & custom JSON mods across reloads; exporting portable `.json` backups is still recommended before clearing browser site data.
- Desktop Chromium campaign, mobile Chromium (`390px`/`320px`), and Playwright WebKit headless smoke checks run in CI; physical iOS Safari & Android Capacitor device QA remain manual pre-store steps. See [release acceptance](RELEASE_ACCEPTANCE.md) and [commercial licensing](COMMERCIAL_LICENSING.md).
