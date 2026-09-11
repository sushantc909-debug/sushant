#!/usr/bin/env python3
"""
Sushant Studios — local server (Python)
=======================================

Run it in your terminal:

    python3 server.py            # → http://localhost:8080
    python3 server.py 3000       # → http://localhost:3000

Then open the printed URL in any browser (phone, tablet or laptop).
The site is 100% static — this server only serves the files.
"""

import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEFAULT_PORT = 8080


class Handler(SimpleHTTPRequestHandler):
    """Static file server for the Sushant Studios site."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # never let browsers cache during development
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"  ▸ {self.address_string()}  {fmt % args}")


def main() -> None:
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"!! '{sys.argv[1]}' is not a valid port. Using {DEFAULT_PORT}.")

    url = f"http://0.0.0.0:{port}"
    print()
    print("  ╔══════════════════════════════════════════════════╗")
    print("  ║   SUSHANT STUDIOS — anti-gravity studio server   ║")
    print("  ╚══════════════════════════════════════════════════╝")
    print()
    print(f"   Serving:  {ROOT}")
    print(f"   Open:     http://localhost:{port}")
    print(f"   On LAN:   http://<this-computer-ip>:{port}")
    print()
    print("   Stop with: Ctrl + C")
    print()

    try:
        HTTPServer(("0.0.0.0", port), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\n  ✦ Server stopped. See you next time.")
    except OSError as exc:
        print(f"  !! Could not bind port {port}: {exc}")
        print("     Try another port:  python3 server.py 9000")
        sys.exit(1)


if __name__ == "__main__":
    main()
