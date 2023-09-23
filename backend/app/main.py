from fastapi import FastAPI, File, UploadFile
from typing import Annotated

app = FastAPI()


@app.get("/")
def hello_world():
    return {"message": "OK"}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    open_file = await file.read()
    return {"filename": file.filename, "items": open_file}
