#!/bin/sh
set -e

# Start the Express + Socket.IO server
node server/dist/index.js &

# Serve the client build
serve -s client/dist -l 5173 &

# Wait for any process to exit
wait -n

# Exit with status of first process to exit
exit $?
