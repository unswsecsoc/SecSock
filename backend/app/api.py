from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
import time

app = FastAPI()

# In-memory store for webhook data and WebSocket connections
webhooks = {}  # {token: [list of requests]}
clients = {}   # {token: [list of WebSocket connections]}

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

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
            </style>
        </head>
        <body>
            <h1>SecSock</h1>
            <h2>Welcome to the SecSock api</h2>
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
        "ip": request.client.host, # type: ignore
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