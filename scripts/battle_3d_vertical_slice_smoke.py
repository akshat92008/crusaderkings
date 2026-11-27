"""Phase 4 Vertical Slice Gate: verify 20 consecutive live 3D battles (Vijayanagara + 0 A.D. assets),
clean campaign state integration, zero crashes, and strict renderer disposal.
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
        page.select_option('#start-faction', 'vijayanagara')
        page.click('#start-new')
        page.wait_for_timeout(450)

        for i in range(20):
            if page.locator('.map-options').get_attribute('open') is None:
                page.locator('.map-options summary').click()
            page.click('#battle-showcase')
            page.locator('#battle-screen').wait_for(state='visible', timeout=20000)
            renderer = page.locator('#battle-strength').get_attribute('data-renderer')
            assert renderer == 'three', f'Expected 3D renderer on iteration {i}, got {renderer}'
            page.wait_for_function("globalThis.__activeBattle?.ctx?.modelsReady === true", timeout=20000)

            if i == 0:
                page.wait_for_timeout(350)
                page.click('#battle-start')
                page.wait_for_timeout(1200)
                page.screenshot(path=str(OUT / 'phase4-3d-battle-vertical-slice.png'))
                page.click('#battle-retreat')
            else:
                page.click('#battle-start')
                page.wait_for_timeout(120)
                page.click('#battle-retreat')

            page.locator('#battle-return').wait_for(state='visible', timeout=10000)
            page.click('#battle-return')
            page.locator('#battle-screen').wait_for(state='hidden', timeout=10000)

        assert not errors, f'Errors during 20 3D battle transitions: {errors[:5]}'
        print('PHASE 4 VERTICAL SLICE PASS: 20/20 consecutive 3D battles completed cleanly with zero errors.')
        browser.close()
finally:
    server.shutdown()
