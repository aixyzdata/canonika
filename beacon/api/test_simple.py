from fastapi import FastAPI, Request
import time

app = FastAPI(title="Test Simple")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/websocket")
async def websocket_endpoint(request: Request):
    try:
        data = await request.json()
        return {
            "type": "connection",
            "id": f"test_{int(time.time() * 1000)}",
            "data": {"message": "Test endpoint working"},
            "timestamp": time.time()
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 