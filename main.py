from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
import time

import uvicorn

app = FastAPI()

# In-memory store for webhook data and WebSocket connections
webhooks = {}  # {token: [list of requests]}
clients = {}   # {token: [list of WebSocket connections]}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return HTMLResponse("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Webhook Viewer</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .log { white-space: pre-wrap; background: #f4f4f4; padding: 10px; border: 1px solid #ccc; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1>SecSock</h1>
        <h2>Disclaimer goes here: yadadadadadadda</h2>
        <button onclick="createNew()">Generate New Webhook</button>
        <p id="info"></p>
        <div id="requests"></div>

        <script>
    async function createNew() {
        const res = await fetch('/new');
        const data = await res.json();
        const token = data.token;
        document.getElementById('info').innerHTML = `Your Webhook URL: <code>http://localhost:8000/hook/${token}</code>`;

        const ws = new WebSocket(`ws://${location.host}/ws/${token}`);
        ws.onmessage = (event) => {
            const req = JSON.parse(event.data);
            const div = document.createElement('div');
            div.className = 'log';
            div.textContent = `${new Date(req.timestamp * 1000).toLocaleTimeString()}
${req.method} Request
Query Parameters: ${JSON.stringify(req.query_params || {}, null, 2)}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body: ${req.body}`;
            document.getElementById('requests').prepend(div);
        };
    }
</script>

    </body>
    </html>
    """)

# Generates a new webhook to use
@app.get("/new")
def new_webhook():
    token = uuid.uuid4().hex[:8]  # short UUID
    webhooks[token] = []
    clients[token] = []
    return {"url": f"/hook/{token}", "token": token}

# Catches requests to the generated webhook
@app.api_route("/hook/{token}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def catch_all(token: str, request: Request):
    if token not in webhooks:
        return JSONResponse(status_code=404, content={"error": "Token not found"})

    req_data = {
        "method": request.method,
        "headers": dict(request.headers),
        "body": (await request.body()).decode("utf-8", errors="ignore"),
        "query_params": dict(request.query_params),
        "timestamp": time.time()
    }
    webhooks[token].append(req_data)

    # Notify WebSocket listeners
    for ws in clients[token]:
        try:
            await ws.send_json(req_data)
        except:
            pass

    return {"status": "received"}

# Returns request data made to a specific URL
@app.get("/requests/{token}")
def get_requests(token: str):
    return webhooks.get(token, [])

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    if token not in clients:
        await websocket.close()
        return

    await websocket.accept()
    clients[token].append(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep connection alive
    except WebSocketDisconnect:
        clients[token].remove(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")