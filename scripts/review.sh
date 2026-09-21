#!/usr/bin/env bash
# Starts a throwaway static server, captures screenshots, then shuts down.
# Usage: ./scripts/review.sh <route> <label> [width] [height] [full]
set -e
cd "$(dirname "$0")/.."

python3 -m http.server 4321 --bind 127.0.0.1 --directory dist > /dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

# Wait for the server to accept connections.
for _ in $(seq 1 40); do
  if curl -s -o /dev/null http://127.0.0.1:4321/; then break; fi
  sleep 0.25
done

node "$@"
