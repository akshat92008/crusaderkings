#!/bin/zsh
cd "$(dirname "$0")"
echo 'Crown of Nations — local browser game'
echo 'Launching at http://localhost:8080/'
if [ -f scripts/build_hometown_art.py ] && [ ! -f assets/hometown/village_hall.png ]; then
  python3 scripts/build_hometown_art.py || echo 'Hometown optional artwork extraction failed; using fallback sprites.'
fi
python3 -m http.server 8080 &
SERVER_PID=$!
sleep 1
open 'http://localhost:8080/'
wait $SERVER_PID
