"""
Outlines of a word in a font, for the name printed on the Revolux render.

The name is drawn as a path rather than set as text, so it looks the same on
every machine, stays sharp at any size and moves with the device as one
shape. Text is laid out on the pixel grid, the render is not, so as the
device floated the letters slipped up to two pixels against it each cycle.

The name is Montserrat SemiBold, which is under the SIL Open Font Licence.
To regenerate it (to change the word, say):

    npm pack @fontsource/montserrat && tar -xzf fontsource-montserrat-*.tgz
    pip install fonttools
    python scripts/wordmark-outline.py package/files/montserrat-latin-600-normal.woff REVOLUX 0.2

and paste the printed d and ink into src/components/RevoluxDevice.tsx.
The arguments are the font (TTF, OTF or WOFF), the word and the tracking in
ems.
"""

import json
import sys

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

font_path, word, tracking = sys.argv[1], sys.argv[2], float(sys.argv[3])
font = TTFont(font_path)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 1000 / font["head"].unitsPerEm  # a 1000-unit em, y down, origin on the baseline

kern = {}
if "kern" in font:
    for table in font["kern"].kernTables:
        kern.update(getattr(table, "kernTable", {}))

names = [cmap[ord(c)] for c in word]
path, bounds = SVGPathPen(glyphs), BoundsPen(glyphs)
x = 0.0
for i, name in enumerate(names):
    for pen in (path, bounds):
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
    x += glyphs[name].width * scale
    if i + 1 < len(names):
        x += kern.get((name, names[i + 1]), 0) * scale + tracking * 1000

print(json.dumps({"d": path.getCommands(), "ink": [round(v, 2) for v in bounds.bounds]}))
