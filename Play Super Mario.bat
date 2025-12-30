@echo off
cd "C:\Users\ajayk\.gemini\antigravity\scratch\super_mario_night"
start cmd /k "node server.js"
timeout /t 3
start http://localhost:3000
