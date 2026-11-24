"""Desktop campaign acceptance and Chromium touch and battlefield acceptance."""
from os import environ
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-screenshots';OUT.mkdir(exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  engine=environ.get('CROWN_BROWSER','chromium')
  assert engine in ('chromium','firefox','webkit'), 'Unsupported CROWN_BROWSER'
  chromium=engine=='chromium'
  flags=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']
  browser=getattr(p,engine).launch(headless=True,**({'args':flags} if chromium else {}))
  viewports=[('desktop',1440,900,False)]
  if chromium:viewports.extend([('mobile',390,844,True),('small-phone',320,640,True)])
  for name,width,height,touch in viewports:
   options={'has_touch':True,'is_mobile':True} if touch else {}
   page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1,**options)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('http://127.0.0.1:'+str(server.server_port),wait_until='domcontentloaded',timeout=45000)
   page.locator('#start-faction option').first.wait_for(state='attached',timeout=45000)
   page.fill('#realm-search','no-such-kingdom');assert page.locator('#start-new').is_disabled()
   page.fill('#realm-search','england');assert page.locator('#start-faction option').count()==1
   page.fill('#realm-search','');page.select_option('#start-faction','england');page.select_option('#start-difficulty','peaceful');page.click('#start-new')
   assert page.locator('#management-panel').is_hidden()
   assert page.locator('#province-drawer').is_hidden()
   assert page.locator('#map-modes').is_hidden()
   assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
   box=page.locator('#world-map').bounding_box();assert box['height']>=height*.45,box
   page.screenshot(path=str(OUT/(name+'-map.png')))
   assert page.locator('#hud-ruler').is_visible()
   assert page.locator('#game-speed').is_visible()
   page.select_option('#game-speed','750')
   page.select_option('#game-speed','1500')
   if name=='desktop':
    assert page.locator('#resource-prestige').is_visible()
    assert page.locator('#resource-legitimacy').is_visible()
   page.locator('#quick-nav [data-priority-tab="search"]').click()
   page.fill('#campaign-query','military');assert page.locator('.finder-row').count()>0
   page.fill('#campaign-query','no-such-result-xyz');assert page.locator('.finder-row').count()==0
   page.fill('#campaign-query','council');page.locator('.finder-row[data-priority-tab="council"]').click();assert page.locator('[id^="council-candidate-"]').count()>0
   page.locator('[data-workspace="realm"]').click();assert page.locator('.campaign-hub').is_visible()
   assert page.locator('.first-steps').count()==1
   assert page.locator('.historical-context').count()==1
   page.click('#nav-back');assert page.locator('[id^="council-candidate-"]').count()>0
   page.click('#nav-forward');assert page.locator('.campaign-hub').is_visible()
   page.click('#close-management')
   page.locator('#quick-nav [data-priority-tab="characters"]').click()
   page.fill('#people-query','no-matching-person-xyz');assert page.locator('.directory-list .person-row').count()==0
   page.fill('#people-query','');assert page.locator('.directory-list .person-row').count()>0
   page.locator('#tabs [data-tab="dynasty"]').click();assert page.locator('.family-generation').count()==4
   if name=='desktop':
    children=page.locator('.family-generation').filter(has=page.get_by_text('Children',exact=True))
    children.locator('[data-character]').first.click()
    rights=page.get_by_text('Crown succession rights',exact=True)
    rights.click()
    assert page.locator('#tab-content [data-type="disinherit"]').is_visible()
    page.locator('[data-character-back]').click()
   page.locator('#tabs [data-tab="council"]').click();assert page.locator('[id^="council-candidate-"]').count()>0
   page.locator('#tabs [data-tab="vassals"]').click();assert page.locator('#vassal-sort').is_visible()
   page.locator('[data-workspace="realm"]').click();page.click('#close-management')
   page.click('#open-management')
   page.locator('.campaign-hub [data-character]').first.click()
   assert page.locator('.character-hero').is_visible()
   assert page.locator('.character-skills').is_visible()
   assert page.locator('#tab-content').get_by_text('PERSONAL RESOURCES',exact=True).is_visible()
   assert page.locator('#tab-content').get_by_text('Personal wealth',exact=True).is_visible()
   assert page.locator('#tab-content').get_by_text('Crown title',exact=True).is_visible()
   page.locator('[data-action="pin"][data-type="character"]').click()
   assert page.locator('[data-action="pin"][data-type="character"]').get_attribute('aria-pressed')=='true'
   page.locator('[data-character-back]').click()
   assert page.locator('.campaign-hub').is_visible()
   for work in ['realm','court','foreign','war','people']:
    page.locator('[data-workspace="'+work+'"]').click()
    assert 1<=page.locator('#tabs .tab:visible').count()<=8
   page.click('#close-management');page.locator('#army-outliner summary').click()
   assert page.locator('#outliner-list [data-character]').count()==1
   page.locator('#army-outliner summary').click();page.click('#open-province')
   assert page.locator('#province-drawer').is_visible()
   if name=='desktop':
    lord=page.locator('#province-drawer [data-section="lord"]')
    lord.locator('summary').first.click()
    lord.get_by_text('Estate exemptions',exact=True).click()
    lord.get_by_role('button',name='Grant tax exemption',exact=True).click()
    assert lord.get_by_text('Tax exemption in effect',exact=True).count()==1
    province=page.locator('#province-panel').get_attribute('data-province')
    lord.get_by_text('Estate succession',exact=True).click()
    lord.locator('[id^="estate-law-province-"]').select_option('reversion')
    lord.get_by_role('button',name='Amend succession (75g)',exact=True).click()
    page.wait_for_function("id=>JSON.parse(localStorage.getItem('crown-of-nations.save')).politics.holdings[id].successionLaw==='reversion'",arg=province)
   page.locator('[data-action="pin"][data-type="province"]').click()
   assert page.locator('[data-action="pin"][data-type="province"]').get_attribute('aria-pressed')=='true'
   assert page.locator('[data-section="recruit"]').is_visible()
   assert page.locator('[data-section="command"]').is_visible()
   page.locator('[data-section="command"] [data-type="commander"]').first.click()
   assert 'Not appointed' not in page.locator('[data-section="command"] .army-command b').first.inner_text()
   page.locator('[data-section="recruit"] summary').click()
   assert page.locator('[data-action="recruit"][data-type="infantry"]').is_visible()
   page.screenshot(path=str(OUT/(name+'-province.png')))
   page.click('#close-province');page.click('#zoom-in');page.click('#zoom-out')
   page.locator('.map-options summary').click()
   # The actual pointer hit must reach the map option, not the adjacent quick nav.
   option=page.locator('#show-map-modes');option.scroll_into_view_if_needed();box=option.bounding_box()
   assert page.evaluate('([x,y])=>document.elementFromPoint(x,y)?.closest("#show-map-modes")!==null',[box['x']+box['width']/2,box['y']+box['height']/2]), 'Map options obscured by another interface layer'
   page.click('#show-map-modes');assert page.locator('#map-modes').is_visible()
   page.locator('[data-mapmode="terrain"]').click()
   page.locator('[data-mapmode="political"]').click()
   if name=='mobile':
    page.locator('.map-options summary').click();page.click('#focus-capital')
    page.locator('.map-options summary').click()
    box=page.locator('#world-map').bounding_box()
    x,y=box['x']+box['width']/2,box['y']+box['height']/2
    cdp=page.context.new_cdp_session(page)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x-25,'y':y,'id':1},{'x':x+25,'y':y,'id':2}]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-55,'y':y,'id':1},{'x':x+55,'y':y,'id':2}]})
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    assert page.locator('#province-drawer').is_hidden(),'Pinch must not select a province'
   page.click('#next-month');assert 'FEBRUARY' in page.locator('#date-display').inner_text()
   page.click('#save-game');assert page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save')).turn")==1
   if chromium and name in ('desktop','mobile'):
    if page.locator('.map-options').get_attribute('open') is None: page.locator('.map-options summary').click()
    page.click('#battle-showcase');page.locator('#battle-screen').wait_for(state='visible',timeout=30000)
    assert page.locator('#battle-start').is_visible()
    assert page.locator('#battle-comparison').is_visible()
    page.click('#battle-sound');assert page.locator('#battle-sound').get_attribute('aria-pressed')=='false'
    page.click('#battle-sound');assert page.locator('#battle-sound').get_attribute('aria-pressed')=='true'
    page.wait_for_timeout(500);page.screenshot(path=str(OUT/(name+'-battle-deployment.png')),timeout=45000)
    page.click('#battle-start');page.wait_for_timeout(700)
    page.click('#battle-zoom-in');page.click('#battle-zoom-out');page.click('#battle-move-tap');assert page.locator('#battle-move-tap').get_attribute('aria-pressed')=='true'
    page.click('#battle-move-tap');page.screenshot(path=str(OUT/(name+'-battle.png')),timeout=45000)
    page.click('#battle-retreat');page.click('#battle-return');assert page.locator('#battle-screen').is_hidden()
    if page.locator('.map-options').get_attribute('open') is None: page.locator('.map-options summary').click()
    page.click('#battle-showcase');page.locator('#battle-screen').wait_for(state='visible');assert page.locator('#battle-strength').get_attribute('data-renderer') in ('three','native','software')
    page.click('#battle-retreat');page.click('#battle-return');assert page.locator('#battle-screen').is_hidden()
    print(name,'PASS: practice battle deployment, running battle, touch orders, repeat battle and return')
   if name=='desktop':
    if page.locator('.map-options').get_attribute('open') is None: page.locator('.map-options summary').click()
    with page.expect_download() as info: page.click('#export-save')
    backup=info.value.path().read_bytes();assert b'"player":"england"' in backup
    page.reload(wait_until='domcontentloaded');page.locator('#realm-search').wait_for(state='visible')
    page.locator('#save-file').set_input_files({'name':'campaign.json','mimeType':'application/json','buffer':backup})
    page.locator('#start-screen').wait_for(state='hidden');assert 'FEBRUARY' in page.locator('#date-display').inner_text()
   if chromium and name=='desktop':
    allied_save=page.evaluate('''async () => {
     const {createGame,snapshot}=await import('/src/simulation.js');
     const world=await fetch('/data/world.json').then(r=>r.json());
     const g=createGame(world,'ming');
     const find=owner=>Object.values(g.armies).find(a=>a.owner===owner);
     Object.assign(find('joseon'),{province:'p141',infantry:267,archers:92,cavalry:27});
     find('ming').province='p137';
     find('ashikaga').province='p142';
     g.kingdom.difficulty='peaceful';
     g.factions.joseon.treasury=1200;
     g.factions.ming.treaties.joseon='alliance';
     g.factions.joseon.treaties.ming='alliance';
     g.factions.joseon.relations.ming=75;
     g.conflict.wars.test={id:'test',attacker:'ashikaga',defender:'ming',goal:'p137',score:0,battles:0,started:0,status:'active'};
     g.kingdom.threats=[{army:find('ashikaga').id,by:'ashikaga',province:'p137',staging:'p142',path:[],eta:2,status:'approaching'}];
     return snapshot(g);
    }''')
    page.reload(wait_until='domcontentloaded')
    page.locator('#realm-search').wait_for(state='visible')
    page.locator('#save-file').set_input_files({'name':'allied-field.json','mimeType':'application/json','buffer':allied_save.encode()})
    page.locator('#start-screen').wait_for(state='hidden')
    page.locator('#quick-nav [data-priority-tab="search"]').click()
    page.fill('#campaign-query','diplomacy')
    page.locator('.finder-row[data-priority-tab="diplomacy"]').click()
    page.get_by_text('Treaties and allied support',exact=True).click()
    page.get_by_role('button',name='Call field contingent',exact=True).click()
    assert page.get_by_text('Joseon Korea · 115 field troops · Arrives next month',exact=False).count()==1
    page.click('#close-management')
    page.click('#next-month')
    page.click('#next-month')
    page.locator('#battle-screen').wait_for(state='visible',timeout=30000)
    assert '115 ALLIED TROOPS' in page.locator('#battle-meta').inner_text()
    page.click('#battle-retreat')
    page.click('#battle-return')
    assert page.locator('#battle-screen').is_hidden()
    print('desktop PASS: call allied field contingent, march to the frontier, deploy in battle')
   if name=='desktop':
    page.reload(wait_until='domcontentloaded')
    page.locator('#realm-search').wait_for(state='visible')
    page.locator('#save-file').set_input_files({'name':'career-base.json','mimeType':'application/json','buffer':backup})
    page.locator('#start-screen').wait_for(state='hidden')
    page.click('#open-management')
    page.get_by_text('Play as a landed vassal',exact=True).click()
    page.locator('#career-person').wait_for(state='visible')
    person=page.locator('#career-person').input_value()
    page.get_by_role('button',name='Begin vassal career',exact=True).click()
    assert page.get_by_text('VASSAL CAREER',exact=True).is_visible()
    assert page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save')).playerCareer.person")==person
    page.locator('#tabs [data-tab="characters"]').click()
    assert page.locator('#people-query').is_visible()
    page.locator('.directory-list [data-character]').first.click()
    assert page.locator('.character-hero').is_visible()
    assert page.locator('#tab-content [data-action="politics"]').count()==0
    page.locator('#tab-content [data-action="pin"]').click()
    assert page.locator('#tab-content [data-action="pin"]').get_attribute('aria-pressed')=='true'
    page.locator('#tabs [data-tab="search"]').click()
    page.fill('#campaign-query','landless')
    assert page.locator('.finder-row[data-priority-tab="realm"]').count()==1
    page.fill('#campaign-query','military')
    assert page.locator('.finder-row[data-priority-tab="military"]').count()==0
    page.locator('#tabs [data-tab="chronicle"]').click()
    assert page.get_by_text('CAMPAIGN CHRONICLE',exact=True).is_visible()
    page.locator('#tabs [data-tab="realm"]').click()
    assert page.get_by_text('Career connections',exact=True).is_visible()
    page.click('#close-management')
    page.click('#open-province')
    assert page.locator('[data-action="recruit"]').count()==0
    page.click('#close-province')
    page.click('#next-month')
    page.click('#save-game')
    assert page.evaluate("JSON.parse(localStorage.getItem('crown-of-nations.save')).playerCareer.mode")=='vassal'
    page.reload(wait_until='domcontentloaded')
    page.locator('#load-existing').wait_for(state='visible')
    page.click('#load-existing')
    page.click('#open-management')
    assert page.get_by_text('VASSAL CAREER',exact=True).is_visible()
    page.screenshot(path=str(OUT/'desktop-vassal-career.png'))
    print('desktop PASS: playable vassal role, crown controls restricted, progression and save/reload')
   assert not errors,errors
   print(name,'PASS: map, workspaces, province, layers, zoom, campaign progression and save')
   page.close()
  browser.close()
finally:
 server.shutdown()
