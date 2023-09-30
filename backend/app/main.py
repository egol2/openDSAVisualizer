from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
import os
import glob

from . import abstractor, files, behaviors

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:80",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/scores")
async def upload_scores(file: UploadFile):
    # Reading the uploaded file to ensure valid format
    try:
        file_contents = await file.read()
    except:
        raise HTTPException(status_code=422, detail="Unable to process file")
    
    # Check if the ./data folder has contents, if it does delete them (only the .scores file)
    if os.path.isfile("/app/app/data/.scores"):
        os.remove("/app/app/data/.scores")

    # Parse and store the scores file in a json format
    files.handle_scores(file_contents)
    
    return

@app.post("/upload/interactions")
async def upload_interactions(file: UploadFile):
    # Reading the uploaded file to ensure valid format
    try:
        file_contents = await file.read()
    except:
        raise HTTPException(status_code=422, detail="Unable to process file")
    
    # Check if the ./data folder has contents, if it does delete them (only .log and .json files)
    if os.path.isdir("/app/app/data"):
        for log in glob.glob("/app/app/data/*.log"):
            os.remove(log)
        for json in glob.glob("/app/app/data/*.json"):
            os.remove(json)

    # Segmenting the file contents into separate .log files based on student IDs
    files.segment(file_contents, "interactions")

    return

@app.post("/upload/exercises")
async def upload_exercises(file: UploadFile):
    # Reading the uploaded file to ensure valid format
    try:
        file_contents = await file.read()
    except:
        raise HTTPException(status_code=422, detail="Unable to process file")
    
    # Check if the ./data folder has contents, if it does delete them (only .exercises files)
    if os.path.isdir("/app/app/data"):
        for exercise in glob.glob("/app/app/data/*.exercises"):
            os.remove(exercise)

    # Segmenting the file contents into separate .exercises 
    files.segment(file_contents, "exercises")

    return 

@app.get("/scores")
async def scores():
    # Check if the .scores file exists, and send it
    if os.path.isfile("/app/app/data/.scores"):
        file = open("/app/app/data/.scores", "r")
        json = file.read()
        return json
    else:
        raise HTTPException(status_code=404, detail="Scores not found")

@app.get("/student/{id}")
async def student_info(id):
    # Check if .json file of student exists and return it
    full_json_path = "/app/app/data/" + str(id) + ".json"
    if os.path.isfile(full_json_path):
        json_file = open(full_json_path, "r")
        json = json_file.read()
        return json

    # Check if .log file of student exists and process
    full_item_path = "/app/app/data/" + str(id) + ".log"
    if not os.path.isfile(full_item_path):
        raise HTTPException(status_code=404, detail="Student ID not found")
    
    # Collecting the abstracted event data
    data = abstractor.abstract(full_item_path)
        
    # Collecting student behavior info
    (total_transitions, transitions) = behaviors.getTransitionCounts(data)
    
    # Compiling the resultant values
    result = {
        "id": id,
        "total_transitions": total_transitions,
        "transitions": transitions
    }

    # Writing the .json
    json_file = open(full_json_path, "w")
    json_file.write(str(result))
    json_file.close()
    
    return result
