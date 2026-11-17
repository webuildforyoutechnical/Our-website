@echo off
title We Build For You - Local Server
echo Starting local web server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
