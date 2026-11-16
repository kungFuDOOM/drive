import sys, time
from playwright.sync_api import sync_playwright
track, cam, t, tag = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width":1600,"height":840}, device_scale_factor=1)
    pg.on("pageerror", lambda e: print("ERR", e))
    pg.goto(f"http://127.0.0.1:4177/?autostart=1&track={track}&cam={cam}&q=3&laps=3")
    pg.wait_for_timeout(3000)
    try: pg.evaluate("__game.skipIntro&&__game.skipIntro()")
    except Exception as e: print(e)
    pg.evaluate("__game.setLineGuide(false)")
    pg.evaluate(f"__game.fastForward({t})")
    pg.wait_for_timeout(2500)
    pg.add_style_tag(content="body>*:not(canvas){visibility:hidden !important} canvas{visibility:hidden !important} #view{visibility:visible !important}")
    pg.screenshot(path=f"/tmp/shots/{tag}.png", timeout=120000)
    b.close()
