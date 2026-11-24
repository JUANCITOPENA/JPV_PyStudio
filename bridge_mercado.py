"""
JPV PyStudio - Puente de Mercado Financiero en Vivo (CORS Proxy Local)
Autor: Ing. Juancito Peña Vizcaíno
Permite a aplicaciones WebAssembly (Pyodide, stlite Streamlit) en el navegador
consumir Yahoo Finance y mercados en tiempo real sin bloqueos de política CORS.
"""

import http.server
import urllib.request
import urllib.parse
import json
import sys

PORT = 8088

class FinanceProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # Endpoint de comprobación / estado
        if parsed.path in ['/', '/status', '/health']:
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            status_payload = {
                "status": "online",
                "motor": "JPV PyStudio Finance Bridge",
                "puerto": PORT,
                "endpoints": ["/api/chart?ticker=NVDA&range=5d&interval=1d"]
            }
            self.wfile.write(json.dumps(status_payload, indent=2).encode('utf-8'))
            return

        # Endpoint de consulta a Yahoo Finance
        if parsed.path == '/api/chart':
            params = urllib.parse.parse_qs(parsed.query)
            ticker = params.get('ticker', ['NVDA'])[0].upper().strip()
            period = params.get('range', ['5d'])[0]
            interval = params.get('interval', ['1d'])[0]

            yahoo_url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval={interval}&range={period}"
            req = urllib.request.Request(yahoo_url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            })
            try:
                with urllib.request.urlopen(req, timeout=6) as response:
                    body = response.read()
                    self.send_response(200)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(body)
                    return
            except Exception as e:
                self.send_response(502)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e), 'ticker': ticker}).encode('utf-8'))
                return
        
        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Silenciar logs ruidosos para mantener la consola limpia
        pass

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), FinanceProxyHandler)
    print(f"🚀 Puente CORS Financiero Activo en http://127.0.0.1:{PORT}")
    print("   Endpoints listos para JPV PyStudio en el navegador.")
    print("   Presiona Ctrl + C para detener.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nCerrando puente.")
        server.server_close()
