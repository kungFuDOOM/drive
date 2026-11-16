# Generates public/og-image.png (1200x630), public/apple-touch-icon.png (180x180), public/favicon-32.png
from PIL import Image, ImageDraw, ImageFont
import sys, os
out = sys.argv[1] if len(sys.argv) > 1 else "public"
def font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf","/usr/share/fonts/dejavu/DejaVuSansMono-Bold.ttf"]:
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
def car(d, x, y, s, body="#ffe14a"):
    d.polygon([(x,y+s*.5),(x+s*.15,y+s*.2),(x+s*.7,y+s*.2),(x+s*.95,y+s*.5),(x+s*.95,y+s*.75),(x,y+s*.75)], fill=body)
    d.polygon([(x+s*.25,y+s*.25),(x+s*.62,y+s*.25),(x+s*.78,y+s*.5),(x+s*.15,y+s*.5)], fill="#101820")
    for wx in (x+s*.2, x+s*.7):
        d.ellipse([wx-s*.1,y+s*.65,wx+s*.1,y+s*.85], fill="#000", outline="#888", width=max(1,int(s/40)))
# OG image
W,H=1200,630
im=Image.new("RGB",(W,H),"#101820"); d=ImageDraw.Draw(im)
for i in range(H):
    c=int(16+i*0.03); d.line([(0,i),(W,i)],fill=(c,24+i//30,32+i//20))
# road
d.polygon([(520,260),(680,260),(1100,630),(100,630)], fill="#2a2f36")
d.polygon([(590,260),(610,260),(650,630),(550,630)], fill="#2a2f36")
for k in range(6):
    t0=k/6; t1=t0+0.07
    def pt(t,off): return (600+off*(1+t*5)*1, 260+370*t*t if False else 260+370*t)
    y0=260+370*t0; y1=260+370*t1; w0=2+8*t0*3; w1=2+8*t1*3
    d.polygon([(600-w0,y0),(600+w0,y0),(600+w1,y1),(600-w1,y1)], fill="#ffe14a")
d.rectangle([0,258,W,262], fill="#1d2a38")
car(d,490,430,220)
f=font(150); d.text((70,70),"DRIVE",font=f,fill="#ffe14a",stroke_width=6,stroke_fill="#000")
f2=font(38); d.text((76,250),"Arcade racing in your browser",font=f2,fill="#fff",stroke_width=2,stroke_fill="#000")
im.save(f"{out}/og-image.png")
# Icons
def icon(n):
    i=Image.new("RGB",(n,n),"#140e0a"); dd=ImageDraw.Draw(i)
    car(dd,n*.08,n*.2,n*.84)
    return i
icon(180).save(f"{out}/apple-touch-icon.png")
icon(64).resize((32,32),Image.LANCZOS).save(f"{out}/favicon-32.png")
