#!/bin/bash
# Double-click to preview the Shamil website on this Mac.
cd "$(dirname "$0")"
lsof -ti tcp:5050 | xargs kill 2>/dev/null
( sleep 1; open "http://localhost:5050" ) &
node preview-server.js
