#!/bin/bash
# Reassemble multi-part large zip packs
cd "$(dirname "$0")/.."
echo "Reassembling large packs..."
cat large_packs/City_Builder_Village_Buildings_part_1.zip.part_* > City_Builder_Village_Buildings_part_1.zip
cat large_packs/City_Builder_Village_Buildings_part_2.zip.part_* > City_Builder_Village_Buildings_part_2.zip
cat large_packs/Foozle_2DS0008_Isometric_Gold_Mine_1.zip.part_* > Foozle_2DS0008_Isometric_Gold_Mine_1.zip
echo "Reassembly complete!"
