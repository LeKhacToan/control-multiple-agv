from fastapi import FastAPI

app = FastAPI()


@app.on_event('startup')
async def startup():
    print('Start control multiple agv application')


@app.on_event('shutdown')
async def shutdown():
    print('Closing...')
