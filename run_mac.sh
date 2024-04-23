#!/bin/sh
if [ "$1" = "build" ]; then
    echo compiling game...
    npm run build
else
    npm run dev
fi
