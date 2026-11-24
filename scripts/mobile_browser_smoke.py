"""Real Chromium desktop/mobile acceptance; screenshots are test artifacts."""
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
  browser=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'])
  for name,width,height,touch in [('desktop',1440,900,False),('mobile',390,844,True),('small-phone',320,640,True)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=touch,is_mobile=touch,device_scale_factor=1)
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
   page.click('#open-management')
   for work in ['realm','court','foreign','war','people']:
    page.locator('[data-workspace="'+work+'"]').click()
    assert 1<=page.locator('#tabs .tab:visible').count()<=5
   page.click('#close-management');page.click('#open-province')
   assert page.locator('#province-drawer').is_visible()
   assert page.locator('[data-section="recruit"]').is_visible()
   page.locator('[data-section="recruit"] summary').click()
   assert page.locator('[data-action="recruit"][data-type="infantry"]').is_visible()
   page.screenshot(path=str(OUT/(name+'-province.png')))
   page.click('#close-province');page.click('#zoom-in');page.click('#zoom-out')
   page.locator('.map-options summary').click();page.click('#show-map-modes');assert page.locator('#map-modes').is_visible()
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
   if name in ('desktop','mobile'):
    if page.locator('.map-options').get_attribute('open') is None: page.locator('.map-options summary').click()
    page.click('#battle-showcase');page.locator('#battle-screen').wait_for(state='visible',timeout=30000)
    assert page.locator('#battle-start').is_visible()
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
   assert not errors,errors
   print(name,'PASS: map, workspaces, province, layers, zoom, campaign progression and save')
   page.close()
  browser.close()
finally:
 server.shutdown()
