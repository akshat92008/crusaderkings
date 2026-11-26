"""Run the served game in Chromium and verify 2D Isometric Banner Lines sprites & combat."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = 'http://127.0.0.1:' + str(server.server_port)
errors = []

try:
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
        except Exception:
            browser = p.chromium.launch(channel='chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
        page = browser.new_page(viewport={'width': 1600, 'height': 900}, device_scale_factor=1)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(base, wait_until='domcontentloaded', timeout=45000)
        page.wait_for_function("document.querySelectorAll('#start-faction option').length>=44", timeout=25000)
        page.click('#start-new')
        page.wait_for_timeout(400)
        info = page.evaluate("""async () => {
            const [{BattleGame}, {createGame}] = await Promise.all([import('/src/battle.js'), import('/src/simulation.js')]);
            const world = await (await fetch('/data/world.json')).json();
            const game = createGame(world, 'ottomans');
            const attacker = Object.values(game.armies).find(a => a.owner === 'ottomans');
            if (!attacker) throw Error('Ottoman starting army missing');
            const enemy = world.factions.find(f => f.id !== 'ottomans').id;
            document.querySelector('#battle-screen').hidden = false;
            const descriptor = {
                attacker: attacker.id,
                enemy,
                to: attacker.province,
                defenseTroops: 85,
                defenseGarrison: 65,
                interactive: true,
                fieldBattle: true,
                simpleField: true,
                bannerView: true
            };
            const battle = new BattleGame(document.getElementById('battle-canvas'), descriptor, game, () => {}, () => {});
            window.__battleSmoke = battle;
            return {
                formations: battle.groups.length,
                renderer: battle.ctx.constructor.name,
                banner2d: !!battle.ctx.isBannerRenderer,
                lifecycle: battle.lifecycle
            };
        }""")
        assert info['formations'] >= 6, info
        assert info['banner2d'], info
        assert info['lifecycle'] == 'Deployment', info
        page.wait_for_function("window.__battleSmoke.ctx.spritesReady", timeout=20000)
        sprite_count = page.evaluate("window.__battleSmoke.ctx.loadedSpriteCount")
        assert sprite_count >= 12, sprite_count
        started = page.evaluate("window.__battleSmoke.startAssault()")
        assert started and page.evaluate("window.__battleSmoke.lifecycle") == 'Active'
        page.wait_for_timeout(500)
        assert not errors, errors
        print('BANNER_2D_SMOKE_OK', info, {'spriteCount': sprite_count})
finally:
    server.shutdown()
