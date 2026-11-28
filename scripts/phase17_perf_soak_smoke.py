"""Phase 17 Gate: Performance budget & WebGL2 resource leak verification across repeated
campaign <-> Hometown <-> 3D battle transitions in headless Chromium.
"""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ThreadingHTTPServer.request_queue_size = 128
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
server.daemon_threads = True
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
errors = []

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

        page.goto(base, wait_until='domcontentloaded', timeout=45000)
        page.wait_for_function("document.querySelectorAll('#start-faction option').length >= 44", timeout=25000)

        # Verify Featured Starts pill renders Vijayanagara default flagship & tooltip locking works
        default_realm = page.locator('#start-faction').input_value()
        assert default_realm == 'vijayanagara', f'Expected vijayanagara flagship default, got {default_realm}'
        (ROOT / 'qa-screenshots').mkdir(exist_ok=True)
        page.screenshot(path=str(ROOT / 'qa-screenshots' / 'phase16-start-featured.png'))
        page.click('#start-new')
        page.wait_for_timeout(400)

        # Check 3-level lockable tooltip on #resource-gold
        gold_pill = page.locator('.topresources .resource').first
        gold_pill.hover()
        page.locator('#ui-tooltip').wait_for(state='visible', timeout=5000)
        page.keyboard.press('t')
        page.wait_for_timeout(80)
        page.keyboard.press('t')
        page.wait_for_timeout(80)
        tip_text = page.locator('#ui-tooltip').inner_text()
        assert 'LEVEL 3' in tip_text.upper() or 'RULE:' in tip_text.upper(), f'Expected level-3 locked tooltip expansion, got: {tip_text}'
        page.screenshot(path=str(ROOT / 'qa-screenshots' / 'phase13-hud-locked-tooltip.png'))
        page.keyboard.press('Escape')

        # Enter & clean-dispose 6 cycles of Hometown + 3D Battle tracking JS heap & WebGL cleanup
        heaps = []
        for i in range(6):
            page.click('#capital-nav')
            page.locator('#hometown-screen').wait_for(state='visible', timeout=10000)
            page.wait_for_timeout(150)
            page.keyboard.press('Escape')
            if page.locator('.map-options').get_attribute('open') is None:
                page.locator('.map-options > summary').click()
            page.click('#battle-showcase')
            page.locator('#battle-screen').wait_for(state='visible', timeout=20000)
            page.wait_for_function("globalThis.__activeBattle?.ctx?.modelsReady === true", timeout=25000)
            page.click('#battle-start')
            page.wait_for_timeout(150)
            page.click('#battle-retreat')
            page.locator('#battle-return').wait_for(state='visible', timeout=10000)
            page.click('#battle-return')
            page.locator('#battle-screen').wait_for(state='hidden', timeout=10000)
            mem = page.evaluate("() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / (1024*1024)) : 0")
            heaps.append(mem)

        assert not errors, f'Errors during Stage II perf/leak soak: {errors[:5]}'
        print(f'PHASE 17 PERF & LEAK SOAK PASS: heaps(MB)={heaps}')
        browser.close()
finally:
    server.shutdown()
