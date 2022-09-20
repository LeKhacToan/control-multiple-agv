from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws")
async def find_path(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")