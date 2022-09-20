from fastapi import FastAPI

from ws.path import router as ws_router

app = FastAPI()
app.include_router(ws_router)

@app.on_event('startup')
async def startup():
    print('Start control multiple agv application')


@app.on_event('shutdown')
async def shutdown():
    print('Closing...')