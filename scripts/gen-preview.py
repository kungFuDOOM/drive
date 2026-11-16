# Builds public/og-image.png (1200x630), apple-touch-icon.png (180x180), favicon-32.png from a real in-game render.
# Usage: python3 scripts/gen-preview.py [render.png] [outdir]
# The render comes from scripts/capture-preview.py (headless Chrome, HUD hidden).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, os
src = sys.argv[1] if len(sys.argv) > 1 else "scripts/preview-render.jpg"
out = sys.argv[2] if len(sys.argv) > 2 else "public"
FONT = "/usr/share/fonts/truetype/sand-box/google/Exo 2/Exo2-Italic-VariableFont_wght.ttf"
def font(sz, wght=900):
    f = ImageFont.truetype(FONT, sz)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f
def spaced(d, xy, text, f, fill, track, anchor_center=True):
    w = sum(d.textlength(c, font=f) for c in text) + track * (len(text) - 1)
    x = xy[0] - w / 2 if anchor_center else xy[0]
    for c in text:
        d.text((x, xy[1]), c, font=f, fill=fill); x += d.textlength(c, font=f) + track
    return w
def grad_v(w, h, stops):  # stops: [(pos, (r,g,b,a))]
    g = Image.new("RGBA", (1, h))
    for y in range(h):
        t = y / (h - 1)
        for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
            if p0 <= t <= p1:
                k = (t - p0) / (p1 - p0 or 1); g.putpixel((0, y), tuple(int(c0[i] + (c1[i] - c0[i]) * k) for i in range(4))); break
    return g.resize((w, h))

im = Image.open(src).convert("RGB")
W, H = 1200, 630
from PIL import ImageEnhance
base = ImageEnhance.Color(ImageEnhance.Brightness(im.resize((W, H), Image.LANCZOS)).enhance(1.15)).enhance(1.12).filter(ImageFilter.UnsharpMask(1, 70, 2)).convert("RGBA")

# --- OG image: top scrim for the title, soft vignette, bottom fade
base = Image.alpha_composite(base, grad_v(W, H, [(0, (6, 4, 20, 170)), (0.36, (6, 4, 20, 95)), (0.55, (6, 4, 20, 0)), (0.85, (6, 4, 20, 0)), (1, (6, 4, 20, 140))]))
cx = W // 2
# extra darkening behind the title block + gentle sharpen on the render
vig = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(vig).ellipse([200, -40, 1000, 300], fill=(10, 5, 25, 120))
base = Image.alpha_composite(base, vig.filter(ImageFilter.GaussianBlur(60)))
# title with glow + gradient fill
tf = font(190, 900)
bb = ImageDraw.Draw(base).textbbox((0, 0), "DRIVE", font=tf)
tw, th = bb[2] - bb[0], bb[3] - bb[1]
TOP = 58
tx, ty = cx - tw // 2 - bb[0], TOP - bb[1]
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).text((tx, ty), "DRIVE", font=tf, fill=(255, 70, 120, 200))
glow = glow.filter(ImageFilter.GaussianBlur(26))
base = Image.alpha_composite(base, glow)
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(shadow).text((tx + 4, ty + 7), "DRIVE", font=tf, fill=(0, 0, 0, 190))
base = Image.alpha_composite(base, shadow.filter(ImageFilter.GaussianBlur(5)))
mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).text((tx, ty), "DRIVE", font=tf, fill=255)
fill = grad_v(W, H, [(0, (255, 255, 255, 255)), (0.2, (255, 255, 255, 255)), (0.36, (255, 214, 236, 255)), (0.5, (255, 150, 190, 255)), (1, (255, 150, 190, 255))])
# gradient spans the title's vertical extent
fill = Image.new("RGBA", (W, H)); fill.paste(grad_v(W, th, [(0, (255, 255, 255, 255)), (0.45, (255, 255, 255, 255)), (1, (255, 168, 205, 255))]), (0, TOP))
base.paste(fill, (0, 0), mask)
# tagline
d = ImageDraw.Draw(base)
sf = font(28, 800)
ty2 = TOP + th + 16
TAG = "ARCADE RACING IN YOUR BROWSER"
sh2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
spaced(ImageDraw.Draw(sh2), (cx, ty2 + 3), TAG, sf, (0, 0, 0, 200), 4)
base = Image.alpha_composite(base, sh2.filter(ImageFilter.GaussianBlur(4)))
d = ImageDraw.Draw(base)
w = spaced(d, (cx, ty2), TAG, sf, (255, 214, 228, 255), 4)
assert w <= 600, w
og = base.convert("RGB")
og.save(os.path.join(out, "og-image.png"), optimize=True)
if os.path.getsize(os.path.join(out, "og-image.png")) > 560_000:
    og.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(os.path.join(out, "og-image.png"), optimize=True)

# --- icons: tight crop on the lead cars + bold "D"
ICON_CROP = (780, 330, 1330, 880)  # tight crop on the hero car in the 1600x840 render
def icon(size):
    S = 4 * size
    c = im.crop(ICON_CROP).resize((S, S), Image.LANCZOS).convert("RGBA")  # cars cluster in the 1600x840 render
    c = Image.alpha_composite(c, Image.new("RGBA", (S, S), (22, 12, 40, 225)))
    c = Image.alpha_composite(c, grad_v(S, S, [(0, (60, 20, 70, 60)), (1, (20, 10, 38, 120))]))
    f = font(int(S * 0.74), 900)
    d = ImageDraw.Draw(c)
    b = d.textbbox((0, 0), "D", font=f)
    x, y = (S - (b[2] - b[0])) / 2 - b[0], (S - (b[3] - b[1])) / 2 - b[1]
    sh = Image.new("RGBA", (S, S), (0, 0, 0, 0)); ImageDraw.Draw(sh).text((x + S * .02, y + S * .03), "D", font=f, fill=(0, 0, 0, 220))
    c = Image.alpha_composite(c, sh.filter(ImageFilter.GaussianBlur(S * .015)))
    ImageDraw.Draw(c).text((x, y), "D", font=f, fill=(255, 255, 255, 255))
    return c.convert("RGB").resize((size, size), Image.LANCZOS)
icon(180).save(os.path.join(out, "apple-touch-icon.png"), optimize=True)
icon(32).save(os.path.join(out, "favicon-32.png"), optimize=True)
