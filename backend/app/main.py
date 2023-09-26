from fastapi import FastAPI, File, UploadFile
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello_world():
    return {"message": "OK"}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    print("hello!")
    open_file = await file.read()
    return {"filename": file.filename, "items": open_file}
