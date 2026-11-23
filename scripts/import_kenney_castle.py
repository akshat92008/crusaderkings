"""Import a subset of the creator's Kenney Castle Kit CC0 models.
Usage: python3 scripts/import_kenney_castle.py /path/to/kenney_castle-kit.zip
"""
from pathlib import Path
import sys
import zipfile

ASSETS = ('wall', 'gate', 'tower-square-base', 'tower-square-top',
          'tower-square-roof', 'siege-catapult', 'siege-ram', 'rocks-large')

def import_pack(archive, destination):
    with zipfile.ZipFile(archive) as source:
        names = set(source.namelist())
        license_text = source.read('License.txt').decode('utf-8')
        if 'CC0' not in license_text:
            raise ValueError('License does not explicitly include CC0; refusing import')
        required = [f'Models/GLB format/{name}.glb' for name in ASSETS]
        missing = [name for name in required if name not in names]
        if missing:
            raise FileNotFoundError('Missing Kenney GLBs: '+', '.join(missing))
        destination.mkdir(parents=True, exist_ok=True)
        for name, member in zip(ASSETS, required):
            (destination / f'{name}.glb').write_bytes(source.read(member))
        (destination / 'LICENSE.txt').write_text(license_text)
    return len(ASSETS)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/import_kenney_castle.py <kenney_castle-kit.zip>')
    destination = Path(__file__).resolve().parents[1] / 'assets' / 'battle' / 'kenney'
    print(f'Imported {import_pack(Path(sys.argv[1]),destination)} CC0 models into {destination}')
