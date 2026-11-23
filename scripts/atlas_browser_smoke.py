"""Screenshot and interaction test for the actual hosted Crown of Nations game.

Writes four real browser captures to docs/. No stubbed game or placeholder map.
Requires Playwright's Chromium: python -m pip install playwright; python -m playwright install chromium
"""
from __future__ import annotations
import functools
import http.server
import os
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0),
    functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_address[1]}'
errors = []
import sys
import traceback
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=[
            '--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader',
            '--use-gl=angle', '--use-angle=swiftshader'
        ])
        page = browser.new_page(viewport={'width': 1600, 'height': 1000},device_scale_factor=1)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(url,wait_until='domcontentloaded',timeout=45000)
        page.wait_for_function("document.querySelectorAll('#start-faction option').length > 40",timeout=20000)
        assert page.locator('#start-faction option').count() == 44, 'Expected all 44 starting factions'
        page.click('#start-new')
        page.wait_for_timeout(1600)
        assert page.locator('#start-screen').is_hidden()
        assert page.locator('#faction-name').inner_text()
        assert page.locator('#world-map').is_visible()
        assert page.locator('#map-modes').is_visible()
        page.screenshot(path=str(ROOT/'docs/atlas-kingdoms.png'))
        # Big parchment world view comparable to the supplied reference screenshot.
        page.click('#old-world')
        page.wait_for_timeout(500)
        page.screenshot(path=str(ROOT/'docs/atlas-old-world.png'))
        page.click('[data-mapmode="historical"]')
        page.wait_for_timeout(500)
        assert '1450' in page.locator('#mapmode').inner_text()
        page.screenshot(path=str(ROOT/'docs/atlas-history.png'))
        page.click('[data-mapmode="political"]')
        page.click('#atlas-expand')
        page.wait_for_timeout(650)
        assert 'atlas-expanded' in page.locator('body').get_attribute('class')
        page.screenshot(path=str(ROOT/'docs/atlas-expanded.png'))
        # Confirm the drawing surface is populated, not an empty canvas.
        result = page.evaluate("""() => {
          let c=document.querySelector('#world-map');let p=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
          let seen=new Set();for(let i=0;i<p.length;i+=3332){seen.add(p[i]+','+p[i+1]+','+p[i+2]+','+p[i+3]);}
          return {colors:seen.size,w:c.width,h:c.height};
        }""")
        assert result['colors'] >= 25, f'Map appears blank/monochrome: {result}'
        # Zoom and pan, ensure all controls survive.
        page.locator('#world-map').hover()
        page.mouse.wheel(0,-380)
        page.wait_for_timeout(300)
        page.click('#atlas-expand')
        page.click('#next-month')
        assert '1450' in page.locator('#date-display').inner_text()
        page.click('#save-game')
        assert 'saved' in page.locator('#toast').inner_text().lower()
        assert not errors, f'Browser JS errors: {errors[:8]}'
        print('ATLAS VISUAL SMOKE PASSED. Rendered unique colors:',result['colors'])
        print('Screenshots: atlas-kingdoms.png, atlas-old-world.png, atlas-history.png, atlas-expanded.png')
        browser.close()
except Exception as e:
    detail = 'ATLAS VISUAL TEST FAILED\n' + traceback.format_exc()
    (ROOT/'docs/atlas-browser-error.txt').write_text(detail)
    print(detail, file=sys.stderr)
    raise
finally:
    server.shutdown()
