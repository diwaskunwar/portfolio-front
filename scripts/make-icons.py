#!/usr/bin/env python3
"""
Generates the favicon and the social card from the portrait.

Both are built from the same block mosaic the hero renders on canvas, so the
tab icon, the shared link, and the page itself are visibly the same artwork
rather than three unrelated images.

    python3 scripts/make-icons.py

Requires pillow. Outputs into public/.
"""

from PIL import Image, ImageDraw, ImageFont

SRC = "public/diwas.webp"

# Near-black page ground, never pure #000, matching --background.
BG = (10, 10, 12)
FG = (245, 245, 247)
ICON_BG = (238, 238, 240)  # the portrait backdrop, so the rounded corners show

# Head plus a little shoulder. The full frame is mostly empty backdrop, which
# at 16px reads as a pale square with a smudge in it.
CROP = (96, 50, 384, 338)      # icon: head fills the frame at 16px
OG_CROP = (62, 28, 418, 384)   # card: room for the chin and shoulders

GAP_RATIO = 0.14  # same gutter fraction as BlockPortrait
ICON_GAP = 0.09   # tighter for the icon: at 16px a 14% gutter is a black mesh


def mosaic(cols, crop=CROP, src=SRC):
    """Downsample to cols x cols and return a row-major luminance grid."""
    img = Image.open(src).convert("L").crop(crop)
    small = img.resize((cols, cols), Image.LANCZOS)
    px = small.load()
    return [[px[x, y] for x in range(cols)] for y in range(cols)]


def stretch(grid):
    """
    Rescale luminance to the full range.

    The source is a studio portrait: a bright backdrop and a dark subject with
    everything interesting compressed into the middle. Without this the blocks
    come out as a narrow band of greys and the face disappears at small sizes.
    """
    flat = [v for row in grid for v in row]
    lo, hi = min(flat), max(flat)
    span = max(1, hi - lo)
    return [[round((v - lo) * 255 / span) for v in row] for row in grid]


def svg_icon(cols=20, size=512, radius=96):
    grid = stretch(mosaic(cols))
    cell = size / cols
    gap = cell * ICON_GAP

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
        f'width="{size}" height="{size}" role="img" aria-label="Diwas Kunwar">',
        f'<rect width="{size}" height="{size}" rx="{radius}" fill="rgb{ICON_BG}"/>',
        f'<g>',
    ]

    for y, row in enumerate(grid):
        for x, lum in enumerate(row):
            x0 = round(x * cell + gap / 2, 2)
            y0 = round(y * cell + gap / 2, 2)
            w = round(cell - gap, 2)
            # True luminance. Inverting to "lift the subject off the dark
            # ground" turned the black hair white and the icon read as a
            # helmet rather than a head.
            v = lum
            parts.append(
                f'<rect x="{x0}" y="{y0}" width="{w}" height="{w}" rx="{round(w * 0.18, 2)}" '
                f'fill="rgb({v},{v},{v})"/>'
            )

    parts.append("</g></svg>")
    return "\n".join(parts)


def png_icon(path, px, cols=20, radius_ratio=0.1875):
    """Raster fallback for browsers and platforms that will not take an SVG."""
    scale = 4
    size = px * scale
    grid = stretch(mosaic(cols))
    cell = size / cols
    gap = cell * ICON_GAP

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=size * radius_ratio, fill=ICON_BG + (255,))

    for y, row in enumerate(grid):
        for x, lum in enumerate(row):
            v = lum
            x0 = x * cell + gap / 2
            y0 = y * cell + gap / 2
            w = cell - gap
            d.rounded_rectangle([x0, y0, x0 + w, y0 + w], radius=w * 0.18, fill=(v, v, v, 255))

    img.resize((px, px), Image.LANCZOS).save(path)


def font(names, size):
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def og_card(path="public/og.png", host="diwas-kunwar.com.np", w=1200, h=630, cols=34):
    """1200x630 social card. Crawlers will not render SVG, so this is raster."""
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)

    sans = font(["/System/Library/Fonts/Helvetica.ttc"], 88)
    mono = font(["/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Monaco.ttf"], 24)
    mono_sm = font(["/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Monaco.ttf"], 20)

    pad = 76
    rule = (58, 58, 66)
    dim = (178, 178, 188)

    # Portrait, right-aligned, same mosaic as everything else.
    #
    # Cell edges are snapped to whole pixels. At 46 columns the boundaries fell
    # on fractions, so the gutter landed on some rows and not others and the
    # whole thing moired into a sparse grid overlay.
    box = 392
    ox, oy = w - pad - box, (h - box) // 2
    grid = stretch(mosaic(cols, crop=OG_CROP))
    cell = box / cols
    gap = max(1, round(cell * GAP_RATIO))
    for y, row in enumerate(grid):
        y0, y1 = round(y * cell), round((y + 1) * cell)
        for x, lum in enumerate(row):
            x0, x1 = round(x * cell), round((x + 1) * cell)
            d.rectangle(
                [ox + x0, oy + y0, ox + x1 - gap, oy + y1 - gap],
                fill=(lum, lum, lum),
            )

    # Masthead rule, mirroring the page.
    d.text((pad, pad), "AI / ML ENGINEER", font=mono, fill=FG)
    d.line([(pad, pad + 46), (w - pad, pad + 46)], fill=rule, width=2)

    d.text((pad, 206), "Diwas", font=sans, fill=FG)
    d.text((pad, 302), "Kunwar", font=sans, fill=FG)

    # Baselines set from the bottom edge so nothing can collide with the rule,
    # which is what happened when these were positioned from the top.
    d.text((pad, h - 186), "Agentic AI  ·  LLM systems  ·  MLOps", font=mono_sm, fill=dim)
    d.text((pad, h - 152), "Shipped into education, legal, pharma", font=mono_sm, fill=dim)

    d.line([(pad, h - 96), (pad + 132, h - 96)], fill=rule, width=2)
    d.text((pad, h - 76), host, font=mono_sm, fill=(140, 140, 150))

    img.save(path, optimize=True)


if __name__ == "__main__":
    with open("public/favicon.svg", "w") as f:
        f.write(svg_icon())
    png_icon("public/favicon-32.png", 32)
    png_icon("public/apple-touch-icon.png", 180)
    og_card()
    print("wrote favicon.svg, favicon-32.png, apple-touch-icon.png, og.png")
