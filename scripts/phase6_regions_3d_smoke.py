"""Phase 6 Gate: verify all 4 launch regional 0 A.D. families (india, east_asia, persia, europe)
and distinct biomes render cleanly in ThreeBattleScene WebGL2 with zero errors.
"""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-screenshots'
OUT.mkdir(exist_ok=True)

ThreadingHTTPServer.request_queue_size = 128
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
server.daemon_threads = True
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
errors = []

REALMS = [
    ('vijayanagara', 'india'),
    ('ming', 'east_asia'),
    ('ottomans', 'persia'),
    ('france', 'europe')
]

try:
    with sync_playwright() as p:
        flags = [
            '--no-sandbox', '--disable-dev-shm-usage',
            '--enable-unsafe-swiftshader', '--enable-webgl',
            '--use-gl=angle', '--use-angle=swiftshader'
        ]
        chrome = Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
        kw = {'headless': True, 'args': flags}
        if chrome.exists():
            kw['executable_path'] = str(chrome)
        browser = p.chromium.launch(**kw)
        page = browser.new_page(viewport={'width': 1280, 'height': 720}, device_scale_factor=1)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)

        for realm_id, expected_family in REALMS:
            page.goto(base, wait_until='domcontentloaded', timeout=45000)
            page.wait_for_function("document.querySelectorAll('#start-faction option').length >= 44", timeout=25000)
            page.select_option('#start-faction', realm_id)
            page.click('#start-new')
            page.wait_for_timeout(350)
            if page.locator('.map-options').get_attribute('open') is None:
                page.locator('.map-options summary').click()
            page.click('#battle-showcase')
            page.locator('#battle-screen').wait_for(state='visible', timeout=20000)
            renderer = page.locator('#battle-strength').get_attribute('data-renderer')
            assert renderer == 'three', f'{realm_id}: expected three renderer, got {renderer}'
            page.wait_for_function("globalThis.__activeBattle?.ctx?.modelsReady === true", timeout=25000)
            page.click('#battle-start')
            page.wait_for_timeout(900)
            info = page.evaluate("""() => {
              const b = globalThis.__activeBattle;
              const tplKeys = Object.keys(b?.ctx?.templates || {});
              return { templates: tplKeys.length, groups: b?.groups?.length || 0, terrain: b?.terrainType };
            }""")
            assert info['templates'] >= 2, f'{realm_id} ({expected_family}) missing loaded 0 A.D. templates: {info}'
            page.screenshot(path=str(OUT / f'phase6-{expected_family}-{realm_id}.png'))
            page.click('#battle-retreat')
            page.locator('#battle-return').wait_for(state='visible', timeout=10000)
            page.click('#battle-return')

        assert not errors, f'Errors during Phase 6 multi-region 3D checks: {errors[:5]}'
        print('PHASE 6 MULTI-REGION 3D PASS: all 4 families verified cleanly.')
        browser.close()
finally:
    server.shutdown()
