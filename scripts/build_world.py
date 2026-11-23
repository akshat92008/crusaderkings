"""Regenerate a prototype map using the public-domain Natural Earth 1:110m dataset.

This intentionally DOES NOT reconstruct historical 1450 borders. Provinces are
synthetic polygons used for gameplay testing; faction markers are illustrative.
Requires geopandas/shapely/numpy; source shapefile from naturalearthdata.com.
"""
from pathlib import Path
import os
import geopandas as gpd
from shapely.geometry import Point, MultiPoint, mapping
from shapely.ops import unary_union, voronoi_diagram
import numpy as np, random, json, math
ROOT=Path(__file__).resolve().parents[1]
SOURCE=os.getenv('NATURAL_EARTH_SHP',str(ROOT/'assets/naturalearth/naturalearth_lowres.shp'))
F=[
 ('england','England','Europe',-1.5,52,'Monarchy','#c65b56','longbow'),
 ('france','France','Europe',2.2,47,'Monarchy','#4a86ae','heavy cavalry'),
 ('castile','Crown of Castile','Europe',-4.3,40.2,'Monarchy','#d9a74b','cavalry'),
 ('portugal','Portugal','Europe',-8.1,39.5,'Monarchy','#4aaf8d','navigation'),
 ('aragon','Crown of Aragon','Europe',1,41,'Monarchy','#af7964','naval'),
 ('burgundy','Burgundy','Europe',4.8,48.2,'Duchy','#8666a9','men-at-arms'),
 ('imperial','Imperial States','Europe',12,50,'Feudal states','#b78f60','pike'),
 ('poland','Poland','Europe',20,52,'Monarchy','#dc767c','cavalry'),
 ('muscovy','Grand Duchy of Moscow','Europe',38,56,'Grand duchy','#72a8a8','infantry'),
 ('novgorod','Novgorod','Europe',33,59,'Republic','#b7ca8a','trade'),
 ('ottomans','Ottoman Empire','Asia',29,40.7,'Sultanate','#b74d5b','janissaries'),
 ('mamluks','Mamluk Sultanate','Africa',31.2,30,'Sultanate','#b8ad71','mamluk cavalry'),
 ('timurids','Timurid Empire','Asia',64.5,35,'Empire','#c084a6','horse archers'),
 ('qara','Qara Qoyunlu','Asia',45.5,38,'Confederation','#657eb3','horse archers'),
 ('horde','Golden Horde','Asia',49,49,'Khanate','#a99572','steppe cavalry'),
 ('morocco','Marinid Morocco','Africa',-6.6,33.7,'Sultanate','#a26e8f','light cavalry'),
 ('ethiopia','Ethiopian Empire','Africa',39,10,'Empire','#b18a50','mountain infantry'),
 ('mali','Mali Empire','Africa',-8,14,'Empire','#7a9d65','commerce'),
 ('songhai','Songhai','Africa',0,16.3,'Kingdom','#bb8d50','river trade'),
 ('kongo','Kingdom of Kongo','Africa',15,-5.5,'Kingdom','#749eb4','infantry'),
 ('kilwa','Kilwa Sultanate','Africa',39,-8.5,'Sultanate','#69aea8','commerce'),
 ('vijayanagara','Vijayanagara Empire','Asia',76,15,'Empire','#c47d46','war elephants'),
 ('bahmani','Bahmani Sultanate','Asia',77,18.1,'Sultanate','#8e78b3','cavalry'),
 ('delhi','Delhi Sultanate','Asia',77.1,28.5,'Sultanate','#b78b5e','forts'),
 ('bengal','Bengal Sultanate','Asia',89,23.5,'Sultanate','#5c9e88','river trade'),
 ('gujarat','Gujarat Sultanate','Asia',72.5,22.8,'Sultanate','#c0a661','trade'),
 ('ming','Ming China','Asia',116.5,39.5,'Empire','#cb5b51','gunpowder'),
 ('joseon','Joseon Korea','Asia',127.4,37.5,'Kingdom','#719dbb','archery'),
 ('ashikaga','Ashikaga Shogunate','Asia',136,35.5,'Shogunate','#947bab','samurai'),
 ('ayutthaya','Ayutthaya','Asia',100.6,14.5,'Kingdom','#b3a25d','war elephants'),
 ('dai-viet','Đại Việt','Asia',105.8,21,'Kingdom','#6caa77','infantry'),
 ('majapahit','Majapahit','Asia',112,-7.1,'Empire','#ad765e','naval'),
 ('malacca','Malacca Sultanate','Asia',102.3,2.3,'Sultanate','#67aba0','commerce'),
 ('mexica','Aztec Triple Alliance','North America',-99.1,19.4,'Alliance','#b76d63','warriors'),
 ('maya','Maya City-States','North America',-89,18,'City-states','#6eaf91','archery'),
 ('pueblo','Pueblo Communities','North America',-108,35,'Communities','#b39a78','fortifications'),
 ('haudenosaunee','Haudenosaunee Polities','North America',-77,43,'Confederacies','#85a8ae','diplomacy'),
 ('inca','Inca Empire','South America',-72,-13.5,'Empire','#c5a05e','mountain roads'),
 ('muisca','Muisca Confederation','South America',-74,5,'Confederation','#7baeb1','gold trade'),
 ('tupi','Tupí Polities','South America',-47,-8,'Regional polities','#679e80','woodland warfare'),
 ('mapuche','Mapuche Polities','South America',-72,-37,'Regional polities','#8b9b61','resistance'),
 ('maori','Māori Iwi','Oceania',172.5,-41,'Iwi / hapū','#81aba5','fortified settlements'),
 ('fiji','Fijian Chiefdoms','Oceania',178,-17.8,'Chiefdoms','#b2936c','seafaring'),
 ('aboriginal','Aboriginal Australian Polities','Oceania',134,-25,'Regional polities','#bd9068','land knowledge'),
]
FAC=[]
for n,(id,name,continent,lon,lat,gov,col,special) in enumerate(F):
 FAC.append(dict(id=id,name=name,continent=continent,capital=[lon,lat],government=gov,color=col,specialty=special,initialTreasury=1800+((n*137)%1100),initialPrestige=18+(n*9)%35))
random.seed(1450)
land=gpd.read_file(SOURCE)
land=land[land.continent!='Antarctica'].copy()
COUNTS={'Europe':48,'Asia':95,'Africa':56,'North America':43,'South America':39,'Oceania':18}
# Intersect each continent separately; generated province geometry is not historical.
provinces=[]; pid=0
for continent,count in COUNTS.items():
 rows=land[land.continent==continent]
 if rows.empty: continue
 shape=unary_union([g for g in rows.geometry if g is not None]).buffer(0).simplify(.12,preserve_topology=True)
 minx,miny,maxx,maxy=shape.bounds
 seeds=[]
 for f in FAC:
  if f['continent']==continent:
   p=Point(*f['capital']);
   if shape.contains(p): seeds.append(p)
 for i in range(20000):
  if len(seeds)>=count:break
  x=random.uniform(minx,maxx);y=random.uniform(miny,maxy)
  if shape.contains(Point(x,y)):
   if any(p.distance(Point(x,y)) < (2.0 if continent=='Europe' else 3.0) for p in seeds):continue
   seeds.append(Point(x,y))
 vor=voronoi_diagram(MultiPoint(seeds),envelope=shape.envelope)
 cells=[]
 for raw in vor.geoms:
  clipped=raw.intersection(shape).buffer(0)
  if clipped.is_empty or clipped.area<.08:continue
  cells.append(clipped)
 for geom in cells:
  center=geom.representative_point()
  x,y=center.x,center.y
  def distance(f):
   fx,fy=f['capital'];dx=abs(x-fx);dx=min(dx,360-dx)
   return math.sqrt((dx*max(.42,math.cos(math.radians(y))))**2+((y-fy)*1.22)**2)
  plausible=[f for f in FAC if f['continent']==continent]
  nearest=min(plausible,key=distance) if plausible else None
  dd=distance(nearest) if nearest else 999
  # Compact faction sphere-of-influence game approximation; remote areas independent.
  th={'Europe':15,'Asia':24,'Africa':22,'North America':16,'South America':20,'Oceania':23}[continent]
  owner=nearest['id'] if nearest and dd<th else 'independent'
  geo=geom.simplify(.22,preserve_topology=True)
  def round_coords(g):
   m=mapping(g)
   def r(v):return [r(x) for x in v] if isinstance(v,(tuple,list)) else round(float(v),3)
   return {'type':m['type'],'coordinates':r(m['coordinates'])}
  provinces.append({'id':f'p{pid}','name':f'{continent.split()[0]} Province {pid+1}','continent':continent,'owner':owner,'centroid':[round(x,3),round(y,3)],'terrain':('highlands' if y>35 and (pid%3)==0 else 'plains' if (pid%4) else 'forest'),'development':2+pid%6,'population':14+(pid*7)%65,'unrest':(pid*11)%17,'fort':(pid%9)==0,'geometry':round_coords(geo)})
  pid+=1
# Ensure every featured faction has at least one controllable province.
for f in FAC:
 if any(p['owner']==f['id'] for p in provinces): continue
 candidates=sorted([p for p in provinces if p['continent']==f['continent']],key=lambda p:(p['centroid'][0]-f['capital'][0])**2+(p['centroid'][1]-f['capital'][1])**2)
 spare=next((p for p in candidates if sum(q['owner']==p['owner'] for q in provinces)>1), candidates[0])
 spare['owner']=f['id']
# Lightweight navigation graph: nearby same-continent provinces.
for p in provinces:
 near=sorted((q for q in provinces if q['id']!=p['id'] and q['continent']==p['continent']),key=lambda q:(q['centroid'][0]-p['centroid'][0])**2+(q['centroid'][1]-p['centroid'][1])**2)[:6]
 p['neighbors']=[q['id'] for q in near]
for p in provinces:
 for nid in p['neighbors']:
  q=provinces[int(nid[1:])]
  if p['id'] not in q['neighbors']:q['neighbors'].append(p['id'])
# Descriptive geographic labels for prototype sectors (not authoritative historical names).
def zone(c,x,y):
 if c=='Europe':
  return 'Iberian' if x<-2 else 'Atlantic' if x<8 else 'Baltic' if y>56 else 'Alpine' if y<48 else 'Eastern'
 if c=='Africa':
  return 'Maghreb' if y>25 else 'Sahel' if y>10 else 'Nile' if x>24 and y>0 else 'Congo' if y>-16 else 'Southern'
 if c=='Asia':
  return 'Anatolian' if x<42 else 'Persian' if x<67 and y<45 else 'Steppe' if x<100 and y>38 else 'Deccan' if x<91 and y<23 else 'Indic' if x<96 else 'Indochinese' if x<117 and y<25 else 'Siberian' if y>50 else 'Eastern'
 if c=='North America':
  return 'Mesoamerican' if y<28 else 'Pacific' if x<-115 else 'Great Lakes' if x>-95 and y>37 else 'Northern'
 if c=='South America':
  return 'Andean' if x<-67 else 'Amazon' if y> -12 else 'Southern'
 return 'Oceanic' if x<0 else 'Austral'
counts={}
for p in provinces:
 key=zone(p['continent'],*p['centroid'])
 counts[key]=counts.get(key,0)+1
 modifier={'forest':'Woodlands','plains':'Marches','highlands':'Highlands'}[p['terrain']]
 p['name']=f"{key} {modifier} {counts[key]}"
res={'meta':{'title':'Crown of Nations 1450 Prototype','provinceCount':len(provinces),'date':1450,'caveat':'Synthetic prototype provinces; not historical 1450 borders. Natural Earth supplies coastlines only.','mapSource':'Natural Earth public domain 1:110m low resolution'},'factions':FAC,'provinces':provinces}
(ROOT/'data'/'world.json').write_text(json.dumps(res,separators=(',',':'),ensure_ascii=False),encoding='utf8')
print('wrote world',len(provinces),'provinces',len(FAC),'factions',round((ROOT/'data'/'world.json').stat().st_size/1024),'KiB')
