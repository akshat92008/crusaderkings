"""Verify language learning and cultural formation via the real campaign UI."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-screenshots'; OUT.mkdir(exist_ok=True)
CHROME=Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start()
URL='http://127.0.0.1:'+str(server.server_port)
try:
 with sync_playwright() as p:
  kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']}
  if CHROME.exists():kw['executable_path']=str(CHROME)
  browser=p.chromium.launch(**kw)
  page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(URL,wait_until='domcontentloaded',timeout=45000)
  page.locator('#start-faction option').first.wait_for(state='attached',timeout=45000)
  save=page.evaluate('''async ()=>{
   const {createGame,snapshot}=await import('/src/simulation.js');
   const world=await fetch('/data/world.json').then(r=>r.json());
   const g=createGame(world,'england'),realm='england';
   g.kingdom.difficulty='peaceful';g.factions[realm].treasury=4000;g.factions[realm].prestige=100;
   const ruler=g.politics.people[g.politics.realms[realm].ruler];ruler.age=35;
   const patron=Object.values(g.politics.people).find(x=>x.realm===realm&&x.alive&&x.age>=18&&x.id!==ruler.id&&x.skills.learning>=2);
   if(!patron)throw Error('No qualified cultural patron');g.living.realms[realm].culturePatron=patron.id;
   const p=Object.values(g.provinces).find(p=>p.owner===realm);
   Object.assign(g.civic.provinces[p.id],{culture:'French',acceptance:90,localTrust:90});
   g.factions[realm].relations.france=30;
   return snapshot(g);
  }''')
  page.locator('#save-file').set_input_files({'name':'culture.json','mimeType':'application/json','buffer':save.encode()})
  page.locator('#start-screen').wait_for(state='hidden')
  page.click('#open-management');page.locator('[data-workspace="people"]').click();page.locator('#tabs [data-tab="identity"]').click()
  page.locator('#culture-study-language').select_option('French')
  page.locator('[data-action="identity"][data-type="culture-study"]').click()
  button=page.locator('[data-action="identity"][data-type="culture-hybrid"][data-extra="French"]')
  field=button.get_attribute('data-input')
  page.locator('#'+field).fill('River Culture')
  button.click()
  page.screenshot(path=str(OUT/'culture-hybrid.png'))
  page.click('#close-management');page.click('#save-game')
  state=page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
  assert state['civic']['realms']['england']['culture']=='River Culture'
  assert state['identity']['cultureDefinitions']['River Culture']['parents']==['English','French']
  assert state['identity']['realms']['england']['culturalCourt']['study']['language']=='French'
  assert not errors,errors
  print('PASS: language study and hybrid culture persisted through browser actions')
  browser.close()
finally:
 server.server_close()
