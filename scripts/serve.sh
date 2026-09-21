#!/usr/bin/env bash
# Serves the built site for local review and screenshotting.
cd "$(dirname "$0")/../dist" || exit 1
exec python3 -m http.server 4321 --bind 127.0.0.1
