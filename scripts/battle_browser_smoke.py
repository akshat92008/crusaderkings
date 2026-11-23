"""Run the actual served game in Chromium and exercise KayKit 3D battle assets.

The test records whether SwiftShader/WebGL2 is available; software fallback is still
tested but is not counted as a GPU rendering verification.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import threading,traceback,sys
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
errors=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=[
   '--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--disable-gpu-sandbox',
   '--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'
  ])
  page=browser.new_page(viewport={'width':1600,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base,wait_until='domcontentloaded',timeout=45000)
  page.wait_for_function("document.querySelectorAll('#start-faction option').length===44",timeout=25000)
  page.click('#start-new')
  page.wait_for_timeout(400)
  info=page.evaluate("""async () => {
   const [{BattleGame},{createGame}]=await Promise.all([import('/src/battle.js'),import('/src/simulation.js')]);
   const world=await (await fetch('/data/world.json')).json();
   const game=createGame(world,'ottomans');
   const attacker=Object.values(game.armies).find(a=>a.owner==='ottomans');
   if(!attacker)throw Error('Ottoman starting army missing');
   const enemy=world.factions.find(f=>f.id!=='ottomans').id;
   document.querySelector('#battle-screen').hidden=false;
   const descriptor={attacker:attacker.id,enemy,to:attacker.province,defenseTroops:85,defenseGarrison:65};
   const battle=new BattleGame(document.getElementById('battle-canvas'),descriptor,game,()=>{},()=>{});
   window.__battleSmoke=battle;
   return {formations:battle.groups.length,renderer:battle.ctx.constructor.name,three:!!battle.ctx.isThreeBattle,webgl:!!document.createElement('canvas').getContext('webgl2')};
  }""")
  assert info['formations']==12,info
  # Prove actual asset URLs and binary GLB data are in the runnable build.
  glbs=page.evaluate("""async () => {
   return await Promise.all(['Knight','Rogue_Hooded'].map(async n=>{
     const r=await fetch('/assets/battle/characters/'+n+'.glb');
     const a=await r.arrayBuffer(),v=new DataView(a);
     return {name:n,status:r.status,length:a.byteLength,valid:r.ok&&v.getUint32(0,true)===0x46546c67};
   }));
  }""")
  assert all(x['valid'] and x['length']>1000000 for x in glbs),glbs
  if info['three']:
   page.wait_for_function("window.__battleSmoke.ctx.modelsReady",timeout=35000)
   page.wait_for_function("window.__battleSmoke.ctx.groups.size>=8",timeout=25000)
   stats=page.evaluate("""() => ({
     loaded:__battleSmoke.ctx.modelsReady,
     squads:__battleSmoke.ctx.groups.size,
     animated:[...__battleSmoke.ctx.groups.values()].flat().filter(x=>!!x.mixer&&!!x.current).length,
     clipCounts:Object.fromEntries(Object.entries(__battleSmoke.ctx.templates).map(([k,v])=>[k,v.animations.length]))
   })""")
   assert stats['loaded'] and stats['animated']>=30,stats
   screenshot='battle-real-kaykit-3d.png'
  else:
   stats={'note':'Canvas fallback; GLB files valid, GPU animation could not be tested'}
   screenshot='battle-fallback-only.png'
  page.wait_for_timeout(1100)
  page.screenshot(path=str(ROOT/'docs'/screenshot))
  assert not errors,errors[:10]
  # Battle simulation still produces nonzero movement and can end without crashing.
  before=page.evaluate("""() => {const g=__battleSmoke.groups[0];return [g.x,g.z];}""")
  page.wait_for_timeout(700)
  after=page.evaluate("""() => {const g=__battleSmoke.groups[0];return [g.x,g.z];}""")
  assert before!=after or page.evaluate("window.__battleSmoke.done"),'Battle units not moving'
  page.evaluate("window.__battleSmoke.stop()")
  print('BATTLE BROWSER SMOKE PASSED: renderer=',info,'models=',glbs,'animation=',stats,'screenshot=',screenshot)
  browser.close()
except Exception:
 detail='BATTLE VISUAL TEST FAILED\n'+traceback.format_exc()
 (ROOT/'docs/battle-browser-error.txt').write_text(detail)
 print(detail,file=sys.stderr)
 raise
finally:
 server.shutdown()
