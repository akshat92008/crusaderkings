"""V2.0 Browser Acceptance: UI/UX Redesign, Deferred Siege Isolation & Multi-Region 3D Battle Check."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-screenshots'
OUT.mkdir(exist_ok=True)
CHROME = Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')

ThreadingHTTPServer.request_queue_size = 128
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
server.daemon_threads = True
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
errors = []

V2_REALMS = [
    ('vijayanagara', 'south_india'),
    ('france', 'western_europe'),
    ('ottomans', 'ottoman'),
    ('ming', 'china'),
    ('ashikaga', 'japan'),
    ('ethiopia', 'africa')
]

try:
    with sync_playwright() as p:
        flags = [
            '--no-sandbox', '--disable-dev-shm-usage',
            '--enable-unsafe-swiftshader', '--enable-webgl',
            '--use-gl=angle', '--use-angle=swiftshader'
        ]
        kw = {'headless': True, 'args': flags}
        if CHROME.exists():
            kw['executable_path'] = str(CHROME)
        browser = p.chromium.launch(**kw)
        page = browser.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)

        # 1. V2.0 Main Menu, HUD & UI Redesign
        page.goto(base, wait_until='domcontentloaded', timeout=45000)
        page.locator('#start-faction option').first.wait_for(state='attached', timeout=45000)
        page.click('#start-new')
        page.wait_for_timeout(450)

        assert page.locator('#quick-nav').is_visible()
        assert page.locator('#quick-nav > button').count() in (6, 7)
        assert page.locator('#resource-food').is_visible()
        assert page.locator('#hud-steward-advice').is_visible()
        assert page.locator('#battle-siege-showcase').is_hidden()
        page.screenshot(path=str(OUT / 'v2-hud-map.png'))

        # Unified Campaign Settings dialog: Graphics & Audio & Density & Locale controls
        page.click('#open-settings')
        assert page.locator('#campaign-settings').is_visible()
        page.select_option('#campaign-settings [data-setting="graphics"]', 'high')
        page.select_option('#campaign-settings [data-setting="density"]', 'expert')
        page.click('#campaign-settings form[method="dialog"] button')
        assert page.locator('#campaign-settings').is_hidden()

        # Steward Economy Forecast, Tech Tree, Council Advisers, Hometown Comparison & 2-Ruler Diplomacy
        page.click('#hud-steward-advice')
        page.locator('[data-economy-page="management"]').click()
        assert page.locator('#v2-economy-forecast').is_visible()
        page.screenshot(path=str(OUT / 'v2-crown-forecast.png'))
        page.locator('[data-economy-page="research"]').click()
        assert page.locator('.royal-tech-tree').is_visible()
        page.locator('#quick-nav [data-priority-tab="court"]').click()
        page.locator('#tabs [data-tab="council"]').click()
        assert page.locator('.adviser-rec').count() >= 5
        page.locator('#quick-nav [data-priority-tab="diplomacy"]').click()
        assert page.locator('.v2-diplo-duet').is_visible()
        page.click('#capital-nav')
        assert page.locator('.ht-cost-row').is_visible()
        page.locator('[data-ht="close"]').click()
        assert page.locator('#management-panel').is_hidden()

        # 2. Expanded V2.0 Regional 3D Battles (Western Europe, Ottoman, Africa, China, Japan, South India)
        for realm_id, expected_family in V2_REALMS:
            page.goto(base, wait_until='domcontentloaded', timeout=45000)
            page.locator('#start-faction option').first.wait_for(state='attached', timeout=45000)
            page.select_option('#start-faction', realm_id)
            page.click('#start-new')
            page.wait_for_timeout(350)
            page.evaluate("document.querySelector('.map-options').open=true")
            page.click('#battle-showcase')
            page.locator('#battle-screen').wait_for(state='visible', timeout=25000)
            assert page.locator('#battle-strength').get_attribute('data-renderer') == 'three'
            assert page.locator('#battle-presets button').count() == 5
            assert page.locator('#battle-comparison').is_visible()
            page.wait_for_function("globalThis.__activeBattle?.ctx?.modelsReady === true", timeout=25000)

            page.locator('#battle-presets [data-preset="cavalry_assault"]').click()
            page.click('#battle-start')
            page.wait_for_timeout(900)
            stats = page.evaluate("""() => {
              const b = globalThis.__activeBattle;
              let mountFallbacks = 0;
              for (const units of b.ctx.groups.values()) {
                for (const u of units) if (u.mount) mountFallbacks++;
              }
              return {
                templates: Object.keys(b.ctx.templates || {}).length,
                regFams: Object.keys(b.ctx.regionalTemplates || {}),
                envProps: b.ctx.envGroup ? b.ctx.envGroup.children.length : 0,
                mountFallbacks,
                groups: b.groups.length
              };
            }""")
            assert stats['mountFallbacks'] == 0, f'{realm_id}: unexpected procedural horse fallback {stats}'
            assert expected_family in stats['regFams'], f'{realm_id}: missing {expected_family} in {stats}'
            page.screenshot(path=str(OUT / f'v2-3d-battle-{expected_family}-{realm_id}.png'))
            page.click('#battle-retreat')
            page.locator('#battle-return').wait_for(state='visible', timeout=10000)
            page.click('#battle-return')

        assert not errors, f'Browser errors during V2.0 verification: {errors[:5]}'
        print(f'V2.0 BROWSER UI & MULTI-REGION 3D PASS ({len(V2_REALMS)} families, zero procedural horse fallbacks).')
        browser.close()
finally:
    server.shutdown()
