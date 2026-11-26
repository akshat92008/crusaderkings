@echo off
cd /d "%~dp0"
if exist scripts\build_hometown_art.py if not exist assets\hometown\village_hall.png py scripts\build_hometown_art.py
start "" "http://localhost:8080/"
py -m http.server 8080
pause
