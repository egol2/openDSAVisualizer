import pandas as pd
from io import BytesIO
import json

# Takes in the byte buffer of the file contents as a .tsv and splits the contents of the file into separate .log files for each student
def segment(contents, type):
    ext = ""
    delim = ""

    if type == "interactions":
        ext = ".log"
        delim = '\t'
    elif type == "exercises":
        ext = ".exercises"
        delim = ","
    
    dataset = pd.read_csv(BytesIO(contents), delimiter=delim)
    dataset = pd.DataFrame(dataset)
    ids = dataset['user_id'].unique()

    for id_idx in range(len(ids)):
        data_slice = dataset[dataset['user_id'] == ids[id_idx]]
        data_slice.to_csv("/app/app/data/" + ids[id_idx].astype(str) + ext, index=False)

def handle_scores(contents):
    dataset = pd.read_csv(BytesIO(contents))
    dataset = pd.DataFrame(dataset)
    ids = dataset['user_id'].unique()

    # Building an array of json objects, where each object contains information regarding one student
    result = []

    for idx in dataset.index:
        result.append({
            "user_id": dataset['user_id'][idx],
            "Projects": dataset['Projects / 100'][idx],
            "Midterm": dataset['Midterm / 100'][idx],
            "Final": dataset['Final / 100'][idx],
            "OpenDSA": dataset['OpenDSA Exercises / 100'][idx],
            "Total": dataset['Final Score / 100'][idx],
            "Grade": dataset['Letter Grade'][idx],
        })

    json_file = open("/app/app/data/.scores", "w")
    json_file.write(str(result))
    json_file.close()
