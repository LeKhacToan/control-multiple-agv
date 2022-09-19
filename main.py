from fastapi import FastAPI
from src.util.time_enhanced import time_enhanced

app = FastAPI()


@app.on_event('startup')
async def startup():
    print('Start control multiple agv application')


@app.on_event('shutdown')
async def shutdown():
    print('Closing...')


@app.get("/")
async def read_root():
    data = [(1,3), (3,5), (3,6)]
    await time_enhanced(1,data)
    return {"Hello": "World"}