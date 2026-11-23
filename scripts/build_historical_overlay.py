"""Make a compact, clearly labeled 1450 Cliopatria reference overlay.
Source CC BY 4.0, as provided by the user; historically incomplete.
Not interchangeable with selectable game province borders.
"""
from pathlib import Path
from shapely.geometry import shape, mapping
import json,sys
ROOT=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/mnt/data/cliopatria_1450_active_raw.geojson')
obj=json.loads(source.read_text())
features=[]
for x in obj['features']:
    try:
        geom=shape(x['geometry'])
        if geom.is_empty or not geom.is_valid:continue
        simplified=geom.simplify(.08,preserve_topology=True)
        p=x['properties']
        features.append({'type':'Feature','properties':{k:p.get(k) for k in ['Name','Type','FromYear','ToYear','SeshatID']},'geometry':mapping(simplified)})
    except Exception:pass
out={'type':'FeatureCollection','attribution':'Cliopatria 1450 GeoJSON historical reference, CC BY 4.0; incomplete and uncertain; not the playable province geometry','features':features}
path=ROOT/'data/historical-1450-reference.geojson'
path.write_text(json.dumps(out,separators=(',',':')))
print('Historical features:',len(features),'bytes:',path.stat().st_size)
