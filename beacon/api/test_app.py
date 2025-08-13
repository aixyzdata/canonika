from fastapi import FastAPI

app = FastAPI(title="Test App")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
async def test():
    return {"message": "Test endpoint working"} 