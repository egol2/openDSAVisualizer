from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import Annotated
import os
import sys

from . import abstractor, files

app = FastAPI()

root_path = "/app/app/"

@app.get("/")
def hello_world():
    return {"message": "OK"}

@app.post("/upload/scores")
async def upload_scores(file: UploadFile):
    open_file = await file.read()
    
    # Check if the ./data folder exists or has contents, if it does delete them (ONLY .scores FILES!)

    return {"filename": file.filename, "items": open_file}

@app.post("/upload/interactions")
async def upload_interactions(file: UploadFile):
    # Reading the uploaded file to ensure valid format
    try:
        file_contents = await file.read()
    except:
        raise HTTPException(status_code=422, detail="Unable to process file")
    
    # Check if the ./data folder exists or has contents, if it does delete them (ONLY .log AND .json FILES!)

    # Segmenting the file contents into separate .log files based on student IDs
    files.segment(file_contents)

    return {"filename": file.filename}

@app.post("/upload/exercises")
async def upload_exercises(file: UploadFile):
    open_file = await file.read()
    
    # Check if the ./data folder exists or has contents, if it does delete them (ONLY .exercises FILES!)

    return {"filename": file.filename, "items": open_file}

@app.get("/student/{id}")
async def student_info(id):
    # Check if .json file of student exists

    # Check if .log file of student exists and process
    full_item_path = root_path + "data/" + str(id) + ".log"
    if os.path.isfile(full_item_path):
        result = abstractor.abstract(full_item_path)
        
        #valA = behaviors.a(result)
        #valB = behaviors.b(result)
        # write the dataframe's values into a .json accordingly
    else:
        raise HTTPException(status_code=404, detail="Student ID not found")
    
    return {"status": "read!"}
