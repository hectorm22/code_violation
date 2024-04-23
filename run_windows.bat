@echo off
if "%1" equ "build" (
    echo compiling game...
    npm run build
) else (
    node server.js
)
