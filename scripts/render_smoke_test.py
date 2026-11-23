"""Offline integration smoke test by inlining module source into a headless Chromium page.
Allows testing when browser navigation to localhost/file is restricted. Requires playwright.
"""
from playwright.sync_api import sync_playwright
import re,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
css=(ROOT/'styles.css').read_text().split('\n',1)[-1]
html=html.replace('<link rel="stylesheet" href="styles.css">',f'<style>{css}</style>')
html=html.replace('<script type="module" src="src/main.js"></script>','')
modules=[]
for name,key,returned in [('simulation','SIM','createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,startMarch,concludeBattle,negotiate,ownerName'),('map','MAP','CampaignMap'),('battle','BATTLE','BattleGame')]:
 source=(ROOT/'src'/f'{name}.js').read_text().replace('export ','')
 modules.append(f'globalThis.{key}=(()=>{{{source}\nreturn {{{returned}}};}})();')
main=(ROOT/'src/main.js').read_text()
main=re.sub(r'^import .*?;\s*$', '',main,flags=re.M)
main=re.sub(r'const world=await fetch\([^\n]+\n',f'const world={json.dumps(json.loads((ROOT/"data/world.json").read_text()),ensure_ascii=False)};\n',main)
modules.append('const {CampaignMap}=MAP;const {BattleGame}=BATTLE;const {createGame,restoreGame,snapshot,MONTHS,BUILDINGS,POLICY,empireStats,controlled,armiesAt,armySize,advanceMonth,setPolicy,build,recruit,startMarch,concludeBattle,negotiate,ownerName}=SIM;\n'+main)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'])
 page=browser.new_page(viewport={'width':1600,'height':900},device_scale_factor=1)
 errs=[];page.on('pageerror',lambda e: errs.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=15000)
 page.evaluate("""() => { const mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>{mem[k]=v;}}}); }""")
 page.add_script_tag(content='\n'.join(modules))
 page.wait_for_timeout(350)
 page.screenshot(path=str(ROOT/'docs/menu-preview.png'))
 print('main script errors:',errs[:3])
 print('new game button:',page.locator('#start-new').is_visible(),'select options:',page.locator('#start-faction option').count())
 page.click('#start-new');page.wait_for_timeout(300)
 page.screenshot(path=str(ROOT/'docs/world-preview.png'))
 print('faction:',page.locator('#faction-name').inner_text(),'treasury:',page.locator('#resource-gold').inner_text())
 page.click('#next-month');print('date:',page.locator('#date-display').inner_text())
 page.click('[data-tab="decrees"]');page.select_option('.policy-select[data-policy="tax"]','2')
 print('policy:',page.locator('#toast').inner_text())
 page.click('[data-tab="realm"]');page.locator('#province-panel [data-action="recruit"]').first.click()
 page.locator('#province-panel [data-action="build"]').first.click()
 page.click('#save-game');print('save button:',page.locator('#toast').inner_text(), 'save file exists:',page.evaluate("!!localStorage.getItem('crown-of-nations.save')"))
 # Render tactical battle with the first controllable army and adjacent rival.
 try:
  result=page.evaluate('''() => { const army=Object.values(game.armies).find(a=>a.owner===game.player);const prov=world.provinces.find(p=>p.id===army.province);const enemy=prov.neighbors.find(id=>game.provinces[id].owner!==game.player);if(!enemy)return 'no adjacent enemy'; const d=startMarch(game,world,prov.id,enemy);if(!d.ok)return d.msg;openBattle(d);return d.type; }''')
  print('battle launch:',result)
  page.wait_for_timeout(1000)
  if result=='battle':
   page.screenshot(path=str(ROOT/'docs/battle-preview.png'))
   print('battle webgl visible:',page.locator('#battle-screen').is_visible(), 'webgl2:',page.evaluate("!!document.createElement('canvas').getContext('webgl2')"),'fallback ctx:',page.evaluate("battle?.ctx?.constructor?.name"))
   before=page.evaluate('empireStats(game,game.player).provinces')
   page.evaluate('battle.finish(true,350)')
   page.click('#battle-return')
   after=page.evaluate('empireStats(game,game.player).provinces')
   print('battle integrated province count:',before,'to',after)
 except Exception as ex:print('battle failed:',ex)
 print('JS errors:',errs[:10])
 browser.close()
