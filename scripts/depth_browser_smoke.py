"""Exercise actual player controls for ambitions, regional situations and contextual decisions."""
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-screenshots';OUT.mkdir(exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
URL='http://127.0.0.1:'+str(server.server_port)
def state(page):
 return page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save'))")
def tab(page,name):
 button=page.locator('#tabs [data-tab="'+name+'"]')
 for group in ('court','people','realm','foreign','war'):
  if button.is_visible():break
  page.locator('[data-workspace="'+group+'"]').click()
 button.click()
def reveal(button):
 button.evaluate("(el)=>{for(let p=el.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}")
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'])
  page=browser.new_page(viewport={'width':1440,'height':900})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(URL,wait_until='domcontentloaded',timeout=45000)
  page.locator('#start-faction option').first.wait_for(state='attached',timeout=45000)
  save=page.evaluate("""async()=>{
   const {createGame,snapshot}=await import('/src/simulation.js');
   const {tickHeritage}=await import('/src/heritage-systems.js');
   const world=await fetch('/data/world.json').then(r=>r.json());
   const g=createGame(world,'france');g.kingdom.difficulty='peaceful';g.factions.france.treasury=10000;
   for(const x of Object.values(g.provinces))if(x.owner==='france')x.unrest=70;
   g.turn=3;tickHeritage(g,world);
   const head=g.politics.realms.france.ruler;
   const destination=Object.values(g.provinces).find(x=>x.owner==='france').id;
   g.heritage.realms.france.activityRecords.unshift({id:'qa-feast',kind:'feast',host:head,destination,participants:[],quality:80,turn:g.turn,cost:120});
   g.royalCourt.realms.france.reputation=40;
   return snapshot(g);
  }""")
  page.locator('#save-file').set_input_files({'name':'depth.json','mimeType':'application/json','buffer':save.encode()})
  page.locator('#start-screen').wait_for(state='hidden')
  page.click('#open-management');tab(page,'stories')
  goal=page.locator('[data-action="story"][data-type="ambition"][data-id="reduce_unrest"]')
  reveal(goal);goal.click()
  assert state(page)['chronicles']['realms']['france']['ambition']['id']=='reduce_unrest'
  assert page.get_by_text('Progress:',exact=False).count()>0
  page.screenshot(path=str(OUT/'depth-ambition.png'))
  tab(page,'heritage')
  before=state(page)
  page.locator('[data-action="heritage"][data-type="initiative"][data-id="french_recovery"][data-extra="special"]').click()
  after=state(page)
  assert before['factions']['france']['treasury']-after['factions']['france']['treasury']==150
  assert any(x['unrest']<before['provinces'][k]['unrest'] for k,x in after['provinces'].items() if x['owner']=='france')
  page.screenshot(path=str(OUT/'depth-situation.png'))
  tab(page,'stories')
  decision=page.locator('[data-action="expanded"][data-type="decision"][data-id="decision_feast_guest_accounts"]')
  reveal(decision);decision.click()
  assert state(page)['royalCourt']['realms']['france']['reputation']==48
  page.screenshot(path=str(OUT/'depth-context-decision.png'))
  tab(page,'heritage')
  page.locator('#heritage-destination').select_option(index=0)
  page.locator('[data-action="heritage"][data-type="activity-plan"][data-id="feast"]').click()
  page.locator('[data-type="activity-budget"][data-id="lavish"]').click()
  page.locator('[data-type="activity-escort"][data-id="guard"]').click()
  page.locator('#activity-invite').select_option(index=0)
  page.locator('[data-type="activity-invite"]').click()
  assert len(state(page)['heritage']['realms']['france']['plans']['invited'])==1
  page.screenshot(path=str(OUT/'depth-activity-plan.png'))
  page.locator('[data-type="activity-confirm"]').click()
  assert state(page)['heritage']['activities']['france']['phase']=='preparing'
  assert not errors,errors
  print('PASS: live ambition, situation response, context decision, activity planning and persisted results')
  browser.close()
finally:
 server.shutdown()
