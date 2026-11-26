"""Exercise religion actions in the actual browser campaign and check persisted results."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-screenshots'; OUT.mkdir(exist_ok=True)
CHROME=Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
ThreadingHTTPServer.request_queue_size=128
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start()
URL='http://127.0.0.1:'+str(server.server_port)
def load(page):
 page.goto(URL,wait_until='domcontentloaded',timeout=45000)
 page.locator('#start-faction option').first.wait_for(state='attached',timeout=45000)
 save=page.evaluate('''async ()=>{
  const {createGame,snapshot}=await import('/src/simulation.js');
  const world=await fetch('/data/world.json').then(r=>r.json());
  const g=createGame(world,'england');g.kingdom.difficulty='peaceful';g.factions.england.treasury=4000;g.factions.england.prestige=100;
  const setup=r=>{
   const faith=g.civic.realms[r].faith;
   const people=Object.values(g.politics.people).filter(p=>p.realm===r&&p.alive&&p.age>=18&&p.id!==g.politics.realms[r].ruler&&p.civic);
   const advisor=people.find(p=>p.skills.learning>=2);if(!advisor)throw Error('No advisor candidate');
   advisor.civic.faith=faith;g.living.realms[r].faithAdvisor=advisor.id;
   g.identity.realms[r].faithAuthority=85;
   return {faith,advisor,people};
  };
  const a=setup('england');setup('france');g.factions.england.relations.france=30;g.factions.france.relations.england=30;
  const p=Object.values(g.provinces).find(p=>p.owner==='england');g.civic.provinces[p.id].faith=a.faith;g.identity.institutions[p.id].faith=a.faith;g.identity.institutions[p.id].level=2;
  for(const h of Object.values(g.politics.holdings))if(h.realm==='england')h.loyalty=95;
  const guest=a.people.find(p=>p.id!==a.advisor.id);if(!guest)throw Error('No conversion candidate');guest.civic.faith='Eastern Christianity';
  return snapshot(g);
 }''')
 page.locator('#save-file').set_input_files({'name':'faith.json','mimeType':'application/json','buffer':save.encode()})
 page.locator('#start-screen').wait_for(state='hidden')
def save_state(page):
 page.click('#close-management')
 page.click('#save-game')
 return page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
try:
 with sync_playwright() as p:
  kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']}
  if CHROME.exists():kw['executable_path']=str(CHROME)
  browser=p.chromium.launch(**kw)
  page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  load(page)
  page.click('#open-management')
  page.locator('[data-workspace="people"]').click()
  page.locator('#tabs [data-tab="identity"]').click()
  page.locator('#faith-site').select_option(index=0)
  site=page.locator('#faith-site').input_value()
  page.locator('[data-action="identity"][data-type="faith-site"]').click()
  page.locator('#tab-content summary').filter(has_text='Institutional authority').click()
  page.locator('[data-action="identity"][data-id="governance:stewardship"]').click()
  page.locator('#faith-exchange-target').select_option('france')
  page.locator('[data-action="identity"][data-type="faith-exchange"]').click()
  page.locator('#faith-person').select_option(index=0)
  person=page.locator('#faith-person').input_value()
  page.locator('[data-action="identity"][data-type="faith-conversion"]').click()
  page.screenshot(path=str(OUT/'faith-charter.png'))
  state=save_state(page)
  faith=state['civic']['realms']['england']['faith']
  assert state['identity']['institutions'][site]['sanctuary']['faith']==faith
  assert state['identity']['realms']['england']['faithCharter']['council']['value']=='stewardship'
  assert state['identity']['realms']['england']['faithExchange']['realm']=='france'
  assert state['politics']['people'][person]['civic']['faith']==faith
  assert not errors,errors
  print('PASS: sanctuary, religious council, international exchange and voluntary conversion persisted')
  browser.close()
finally:
 server.server_close()
