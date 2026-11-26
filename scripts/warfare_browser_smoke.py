"""Real browser acceptance for differentiated armies and enemy-initiated defense.

Runs against the same index.html and JS shipped in the playtest ZIP.
"""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading, traceback,sys
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
ThreadingHTTPServer.request_queue_size=128
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
CHROME=Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
LAUNCH={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--enable-webgl','--disable-gpu-sandbox','--use-gl=angle','--use-angle=swiftshader']}
if CHROME.exists():LAUNCH['executable_path']=str(CHROME)
errors=[]
def close_modal(page):
 btn=page.locator('#event-modal-defer')
 if btn.is_visible():btn.click()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(**LAUNCH)
  page=browser.new_page(viewport={'width':1600,'height':960},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base,wait_until='domcontentloaded',timeout=45000)
  page.select_option('#start-faction','england')
  info=page.locator('#start-faction-info').inner_text()
  assert 'Longbow Companies' in info,info
  page.select_option('#start-difficulty','hard')
  page.click('#start-new')
  page.wait_for_timeout(550)
  page.evaluate("document.querySelector('.map-options').open=true")
  page.click('#battle-showcase')
  assert page.locator('#battle-screen').is_visible()
  assert page.locator('#battle-start').is_visible()
  assert page.locator('#battle-presets').is_visible()
  assert page.locator('#battle-formation option').count()>=3
  form_val=page.locator('#battle-formation option').nth(1).get_attribute('value')
  page.select_option('#battle-formation',form_val)
  assert page.locator('#battle-units .unitcard.active').count()>=1
  page.locator('#battle-presets [data-preset="flanks"]').click()
  page.click('#battle-start')
  assert page.locator('#battle-start').is_hidden()
  page.wait_for_timeout(1200)
  page.screenshot(path=str(ROOT/'docs/warfare-cultural-formations.png'))
  page.click('#battle-retreat')
  page.click('#battle-return')
  assert page.locator('#battle-screen').is_hidden()
  # Hard-difficulty enemy rulers should actually initiate attacks.
  warned=False;defended=False
  for month in range(48):
   if page.locator('#battle-screen').is_visible():
    defended=True;break
   close_modal(page)
   page.click('#next-month')
   if not page.locator('#invasion-alert').is_hidden():
    warned=True
   if page.locator('#battle-screen').is_visible():
    defended=True;break
  assert warned,'No rival kingdom staged an attack despite 48 months on hard'
  assert defended,'No incoming AI army reached a playable defensive battle'
  assert 'DEFEND' in page.locator('#battle-title').inner_text()
  assert page.locator('#battle-start').is_visible()
  print('INCOMING DEFENSE VERIFIED:',page.locator('#battle-title').inner_text())
  page.click('#battle-start')
  page.wait_for_timeout(450)
  page.click('#battle-retreat')
  assert 'THE DEFENDERS WERE DEFEATED' in page.locator('#battle-result').inner_text()
  page.click('#battle-return')
  assert page.locator('#battle-screen').is_hidden()
  page.click('#save-game')
  saved=page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
  assert saved['kingdom']['difficulty']=='hard'
  assert len(saved['kingdom']['threats'])==0
  assert not errors,errors[:10]
  print('WARFARE BROWSER SMOKE PASSED: distinct army doctrine, player formations, deployed assault, autonomous enemy march, playable defensive battle, retreat outcome and saved state.')
  browser.close()
except Exception:
 error='WARFARE BROWSER SMOKE FAILURE\n'+traceback.format_exc()
 (ROOT/'docs/warfare-browser-error.txt').write_text(error)
 print(error,file=sys.stderr)
 raise
finally:
 server.server_close()
