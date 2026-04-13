from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from agent import run_research
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/research")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        req = json.loads(data)
        topic = req.get("topic")
        
        if not topic:
            await websocket.send_json({"error": "Topic is required"})
            await websocket.close()
            return
            
        async for update in run_research(topic):
            await websocket.send_json(update)
            await asyncio.sleep(0.01)
            
        await websocket.close()
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        # Let's cleanly close it
        try:
            await websocket.close()
        except:
            pass
