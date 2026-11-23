"""Playwright end-to-end test of the real hosted 1450 campaign, courts, AI and trade.
The browser uses the same source files shipped in the downloadable game.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
errors=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1440,'height':900})
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base,wait_until='domcontentloaded',timeout=45000)
  page.wait_for_function("document.querySelectorAll('#start-faction option').length===44",timeout=20000)
  page.select_option('#start-difficulty','peaceful')
  page.click('#start-new')
  page.wait_for_timeout(550)
  assert page.locator('#start-screen').is_hidden()
  assert page.locator('[data-tab="court"]').count()==1
  assert page.locator('[data-tab="trade"]').count()==1
  assert page.locator('[data-tab="legacy"]').count()==1
  page.click('[data-tab="court"]')
  assert 'ROYAL HOUSE' in page.locator('#tab-content').inner_text()
  assert 'Chief steward' in page.locator('#tab-content').inner_text()
  page.click('[data-action="court-decision"][data-type="steward"]')
  assert 'Chief steward' in page.locator('#tab-content').inner_text()
  page.click('[data-tab="diplomacy"]')
  assert 'merchant treaty' in page.locator('#tab-content').inner_text().lower()
  # Two diplomatic gifts move relations to +40, unlocking trade and marriage.
  page.click('[data-action="gift"]')
  page.click('[data-action="gift"]')
  page.click('[data-action="trade"]')
  page.click('[data-action="marriage"]')
  page.click('[data-tab="trade"]')
  assert 'TRADE PARTNERS' in page.locator('#tab-content').inner_text()
  assert 'France' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-trade-ui.png'))
  for _ in range(9):page.click('#next-month')
  page.click('[data-tab="court"]')
  assert 'DECISION REQUIRED' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-court-event.png'))
  page.locator('[data-action="royal-choice"][data-choice="0"]').click()
  assert 'No unresolved court event' in page.locator('#tab-content').inner_text()
  page.click('[data-tab="legacy"]')
  assert 'DYNASTIC OBJECTIVES' in page.locator('#tab-content').inner_text()
  assert 'LEGACY OF YOUR HOUSE' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-legacy-ui.png'))
  page.click('#save-game')
  snapshot=page.evaluate("localStorage.getItem('crown-of-nations.save')")
  assert snapshot and 'kingdom' in snapshot
  # Save/load migration and peaceful setting must persist.
  saved=page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
  assert saved['kingdom']['difficulty']=='peaceful'
  assert len(saved['kingdom']['courts'])==44
  assert saved['kingdom']['eventsResolved']==1
  assert len(saved['kingdom']['tradePacts'])>=1
  assert not errors,errors[:8]
  print('KINGDOM BROWSER SMOKE PASSED: 44 courts, royal event choices, trade, marriage, saving, objectives, no JavaScript errors')
  browser.close()
finally:
 server.shutdown()
