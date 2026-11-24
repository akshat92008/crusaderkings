"""Exercise newly added government actions through the real campaign UI."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-screenshots'; OUT.mkdir(exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL='http://127.0.0.1:'+str(server.server_port)
def load(page, realm):
 page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 page.locator('#start-faction option').first.wait_for(state='attached',timeout=45000)
 save=page.evaluate('''async realm=>{
  const {createGame,snapshot}=await import('/src/simulation.js');
  const world=await fetch('/data/world.json').then(r=>r.json());
  const g=createGame(world,realm);g.kingdom.difficulty='peaceful';g.factions[realm].treasury=3000;
  if(realm==='england')for(const h of Object.values(g.politics.holdings))if(h.realm===realm)h.loyalty=100;
  if(realm==='horde')g.institutions.realms[realm].herds=25;
  return snapshot(g);
 }''',realm)
 page.locator('#save-file').set_input_files({'name':realm+'.json','mimeType':'application/json','buffer':save.encode()})
 page.locator('#start-screen').wait_for(state='hidden')
def government(page, summary):
 page.click('#open-management')
 page.locator('[data-workspace="people"]').click()
 page.locator('#tabs [data-tab="society"]').click()
 page.locator('#tab-content summary').get_by_text(summary,exact=True).click()
def save_state(page):
 page.click('#close-management')
 page.click('#save-game')
 return page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'])
  for realm,summary in [('england','Estate assembly'),('ming','Provincial administration'),('horde','Clan assembly and herds')]:
   page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   load(page,realm);government(page,summary)
   if realm=='england':
    page.locator('[data-id="motion:propose"]').click()
    # The game rerenders the management panel following actions.
    lobby=page.locator('[data-id="motion:lobby"]')
    if not lobby.is_visible():page.locator('#tab-content summary').get_by_text(summary,exact=True).click()
    assert lobby.is_visible()
    page.locator('#institution-lobby-person').select_option(index=0)
    lobby.click()
    if not page.locator('#institution-lobby-person').is_visible():page.locator('#tab-content summary').get_by_text(summary,exact=True).click()
    page.screenshot(path=str(OUT/'government-estate-debate.png'))
    s=save_state(page);motion=s['institutions']['realms'][realm]['deliberation']['motion']
    assert motion['ends']==3 and motion['enact'] and len(motion['lobbied'])==1,motion
   elif realm=='ming':
    page.locator('#imperial-exam-person').select_option(index=0)
    page.locator('[data-id="civil:exam"]').click()
    if not page.get_by_text('Imperial civil service',exact=True).is_visible():page.locator('#tab-content summary').get_by_text(summary,exact=True).click()
    page.screenshot(path=str(OUT/'government-imperial-examination.png'))
    s=save_state(page);assert len(s['institutions']['realms'][realm]['civilService']['exams'])==1
   else:
    page.locator('[data-id="steppe:pasture"]').click()
    if not page.get_by_text('Clan pasture reserves',exact=True).is_visible():page.locator('#tab-content summary').get_by_text(summary,exact=True).click()
    page.screenshot(path=str(OUT/'government-steppe-pasture.png'))
    s=save_state(page);assert s['institutions']['realms'][realm]['pastureUntil']==12
   assert not errors,errors
   print(realm,'PASS: government actions and persisted campaign state')
   page.close()
  browser.close()
finally:
 server.shutdown()
