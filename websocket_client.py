import json
import uuid
import requests
import websockets
from config import PRODUCTION_WS_URL,LOCAL_WS_URL,MINT_SECRET,MINT_URL
# ------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------

WS_URL_DEV = PRODUCTION_WS_URL

WS_URL_LOCAL = LOCAL_WS_URL

MINT_URL = MINT_URL

MINT_SECRET = MINT_SECRET


# ------------------------------------------------------------------
# JWT
# ------------------------------------------------------------------

def get_fresh_token():
    response = requests.post(
        MINT_URL,
        headers={
            "X-Mint-Secret": MINT_SECRET,
            "Content-Type": "application/json",
        },
    )

    response.raise_for_status()

    data = response.json()

    token = (
        data.get("access_token")
        or data.get("token")
        or data.get("jwt")
    )

    if not token:
        raise Exception(
            f"Token not found.\n{json.dumps(data, indent=2)}"
        )

    return token


# ------------------------------------------------------------------
# WebSocket Helpers
# ------------------------------------------------------------------

async def connect(env):
    token = get_fresh_token()
    
    if env.lower() == "local":
        CONNECT_URL = WS_URL_LOCAL
    elif env.lower() == "dev":
        CONNECT_URL = WS_URL_DEV
    

    ws = await websockets.connect(
        CONNECT_URL,
        additional_headers={
            "Authorization": f"Bearer {token}"
        },
    )

    return ws


async def disconnect(ws):
    if ws:
        await ws.close()


async def send(ws, payload):
    await ws.send(json.dumps(payload))


async def receive(ws):
    while True:

        raw = await ws.recv()

        message = json.loads(raw)

        if message.get("type") == "ping":
            await send(ws, {"type": "pong"})
            continue

        return message


# ------------------------------------------------------------------
# Submit URL
# ------------------------------------------------------------------

async def submit_url(figma_url,environment):

    ws = await connect(environment)

    try:

        await send(
            ws,
            {
                "type": "submit_url",
                "request_id": str(uuid.uuid4()),
                "figma_url": figma_url,
            },
        )

        while True:

            message = await receive(ws)

            msg_type = message.get("type")

            if msg_type == "error":
                raise Exception(
                    message.get(
                        "message",
                        "Unknown error",
                    )
                )

            if msg_type == "submit_url_response":
                return message["result"]

    finally:
        await disconnect(ws)


# ------------------------------------------------------------------
# Convert
# ------------------------------------------------------------------

async def convert(file_key, frame_name,environment):

    ws = await connect(environment)

    try:

        await send(
            ws,
            {
                "type": "convert",
                "request_id": str(uuid.uuid4()),
                "file_key": file_key,
                "frame_name": frame_name,
            },
        )

        while True:

            message = await receive(ws)

            msg_type = message.get("type")

            if msg_type == "error":
                raise Exception(
                    message.get(
                        "message",
                        "Unknown error",
                    )
                )

            if msg_type == "convert_response":
                return message["result"]

    finally:
        await disconnect(ws)