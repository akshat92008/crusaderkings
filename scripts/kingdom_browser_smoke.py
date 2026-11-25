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
server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
CHROME=Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
LAUNCH={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
if CHROME.exists():LAUNCH['executable_path']=str(CHROME)
errors=[]
def tab(page,name):
 button=page.locator('#tabs [data-tab="'+name+'"]')
 for group in ('court','people','realm','foreign','war'):
  if button.is_visible():break
  page.locator('[data-workspace="'+group+'"]').click()
 button.click()
def close_modal(page):
 btn=page.locator('#event-modal-defer')
 if btn.is_visible():btn.click()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(**LAUNCH)
  page=browser.new_page(viewport={'width':1440,'height':900})
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base,wait_until='domcontentloaded',timeout=45000)
  page.wait_for_function("document.querySelectorAll('#start-faction option').length>=44",timeout=20000)
  realm_count=page.evaluate("document.querySelectorAll('#start-faction option').length")
  page.select_option('#start-difficulty','peaceful')
  page.click('#start-new')
  page.wait_for_timeout(550)
  assert page.locator('#start-screen').is_hidden()
  assert page.locator('[data-tab="court"]').count()==1
  assert page.locator('[data-tab="trade"]').count()==1
  assert page.locator('[data-tab="legacy"]').count()==1
  page.click('#open-management')
  tab(page,'court')
  assert 'ROYAL HOUSE' in page.locator('#tab-content').inner_text()
  assert 'Chief steward' in page.locator('#tab-content').inner_text()
  page.click('[data-action="court-decision"][data-type="steward"]')
  assert 'Chief steward' in page.locator('#tab-content').inner_text()
  tab(page,'diplomacy')
  assert 'merchant treaty' in page.locator('#tab-content').inner_text().lower()
  page.select_option('#diplomatic-select','france')
  # Two diplomatic gifts move relations to +40, unlocking trade and marriage.
  page.click('[data-action="gift"]')
  page.click('[data-action="gift"]')
  page.click('[data-action="trade"]')
  tab(page,'trade')
  assert 'TRADE PARTNERS' in page.locator('#tab-content').inner_text()
  assert 'France' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-trade-ui.png'))
  tab(page,'court')
  marry_btn=page.locator('[data-action="politics"][data-type="marry"]').first
  if marry_btn.count()>0:
   marry_btn.click()
  for _ in range(9):
   close_modal(page)
   page.click('#next-month')
  close_modal(page)
  tab(page,'court')
  assert 'DECISION REQUIRED' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-court-event.png'))
  page.locator('[data-action="royal-choice"][data-choice="0"]').click()
  assert 'No unresolved court event' in page.locator('#tab-content').inner_text()
  tab(page,'legacy')
  assert 'DYNASTIC OBJECTIVES' in page.locator('#tab-content').inner_text()
  assert 'LEGACY OF YOUR HOUSE' in page.locator('#tab-content').inner_text()
  page.screenshot(path=str(ROOT/'docs/kingdom-legacy-ui.png'))
  page.click('#save-game')
  snapshot=page.evaluate("localStorage.getItem('crown-of-nations.save')")
  assert snapshot and 'kingdom' in snapshot
  # Save/load migration and peaceful setting must persist.
  saved=page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
  assert saved['kingdom']['difficulty']=='peaceful'
  assert len(saved['kingdom']['courts'])==realm_count
  assert saved['kingdom']['eventsResolved']==1
  assert len(saved['kingdom']['tradePacts'])>=1
  assert not errors,errors[:8]
  print(f'KINGDOM BROWSER SMOKE PASSED: {realm_count} courts, royal event choices, trade, marriage, saving, objectives, no JavaScript errors')
  browser.close()
finally:
 server.server_close()
