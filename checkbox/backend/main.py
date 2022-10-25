# from fastapi import FastAPI
from routes.task import router as task_router
from fastapi import FastAPI
import os
from pymongo import MongoClient
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from util.indices import create_indices

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("TOKEN_SECRET"))

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# from uvicorn import run


@app.get("/")
async def root():
    return {"message": "welcome to the server, how may I assist you!"}


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))
    app.database = app.mongodb_client['test']
    create_indices(app)
    print("Connected to the MongoDB database!")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


app.include_router(task_router, tags=["tasks"], prefix="/task")


# if __name__ == '__main__':
#     run('main:app', reload=True, port=8082)
