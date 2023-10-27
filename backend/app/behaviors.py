import os
import pandas as pd
from datetime import datetime as dt, timedelta
import re

# Consider all document and window events as Reading
reading = ["document event", "window event", "Window open", "Window close"]
visualization = ['FF event']
exercises = ['PE event']

# Reads Interactions file generated from abstracing_script with suffix _merged_result_unannotated.csv
def read_session_data(input_data):
    global data
    data = input_data
    users = data['User ID'].unique()
    global df_dict
    df_dict = {elem: pd.DataFrame for elem in users}
    for user in df_dict.keys():
        df_dict[user] = data[:][data['User ID'] == user]
    # document event, Window open, Window close, window event, FF event, PE event, Other event

# Gets the delta time end - start assuming start, end are string
def getDeltaTime(start, end):
    start_time = dt.strptime(start, "%Y-%m-%d %H:%M:%S")
    end_time = dt.strptime(end, "%Y-%m-%d %H:%M:%S")
    return (end_time - start_time).total_seconds() 

# Generates a dictionary of transition counts between the three states
# R = Reading, V = Visualizations, E = Exercises
def getTransitionCounts(input_data):
    read_session_data(input_data)

    # match_count is total number of transitions
    match_count = 0
    previous_state = None
    current_state = None
    previous_session = None
    current_session = None
    # Initialize state transition counts dictionary
    transition_counts = {
        "RV": 0,
        "RE": 0,
        "VR": 0,
        "VE": 0,
        "EV": 0,
        "ER": 0
    }

    # Process data
    for i in data.index - 1:
        current_session = data.iloc[i]['Session']
        # If the event lies within the threshold
        if data.iloc[i]['Event Name'] in reading:
            current_state = 'R'
        elif data.iloc[i]['Event Name'] in visualization:
            current_state = 'V'
        elif data.iloc[i]['Event Name'] in exercises:
            current_state = 'E'
        if previous_state is not None and current_state != previous_state:
            transition_counts[previous_state + current_state] += 1
            match_count += 1
        # If starting new session, reset previous state
        previous_state = current_state if previous_session == current_session else None
        previous_session = current_session

    # Final value output
    return match_count, transition_counts

# Get cumulative event count and time duration spent in the Reading state for an individual student
def getReadingDuration(filename, start, end):
    read_session_data(filename)
    match_count = 0
    duration = 0.0
    for i in data.index - 1:
        if not pd.isna(data.iloc[i]['Action Time']):
            action_time = float(data.iloc[i]['Action Time'][13:-3]) if "Reading Time" in data.iloc[i]['Action Time'] else 0
            if (start <= action_time <= end): 
                match_count += 1
                duration += action_time
    return match_count, duration

# Get cumulative event count and time duration spent in the Visualization state for an individual student
def getVisualizationDuration(filename, start, end):
    read_session_data(filename)
    match_count = 0
    duration = 0.0
    for i in data.index - 1:
        action_time = float(getDeltaTime(data.iloc[i]['Start Time'], data.iloc[i]['End Time'])) if data.iloc[i]['Event Name'] == 'FF event' else 0
        if (start <= action_time <= end): 
            match_count += 1
            duration += action_time
    return match_count, duration

# Get cumulative event count and time duration spent in the Exercises state for an individual student
def getExercisesDuration(filename, start, end):
    read_session_data(filename)
    match_count = 0
    duration = 0.0
    for i in data.index - 1:
        action_time = float(getDeltaTime(data.iloc[i]['Start Time'], data.iloc[i]['End Time'])) if data.iloc[i]['Event Name'] == 'PE event' else 0
        if (start <= action_time <= end): 
            match_count += 1
            duration += action_time
    return match_count, duration

# Get a list of lists where each sublist is [hints, attempts] for each question
def getExercisesInfo(filename):
    all_question_data = pd.read_csv(filename)
    exercises_info = []
    for question in all_question_data['question_name'].unique():
        curr_question = all_question_data[all_question_data['question_name'] == question]
        exercises_info.append([len(curr_question[curr_question['request_type'] == 'hint']),
                                    len(curr_question[curr_question['request_type'] == 'attempt'])])
    return exercises_info

# Get a dictionary where keys are "Reading", "Visualizations", and "Exercises"
# Each value list is a list of cumulative durations by module
def getDurationByModule(input_data):
    read_session_data(input_data)
    module_durations = {"Reading": [],
                    "Visualizations": [],
                    "Exercises": []}
    
    # Reading
    reading_events = data[data["Action Time"].astype(str).str.contains("Reading time")]
    reading_ids = reading_events["Event Description"].str.extract(r'(\d{2}\.\d{2})', expand=False)
    for id in reading_ids.unique().tolist():
        single_module = reading_events[reading_events["Event Description"].str.contains(id)].reset_index(drop=True)
        single_duration = 0.0
        for i in single_module.index:
            single_duration += float(single_module.iloc[i]["Action Time"][13:-3])
        module_durations["Reading"].append(single_duration)

    # Visualizations
    vis_events = data[data["Event Name"] == "FF event"]
    vis_ids = vis_events["Exercise Type"]
    for id in vis_ids.unique().tolist():
        single_module = vis_events[vis_events["Exercise Type"] == id].reset_index(drop=True)
        single_duration = 0.0
        for i in single_module.index:
            single_duration += float(getDeltaTime(single_module.iloc[i]["Start Time"], single_module.iloc[i]["End Time"]))
        module_durations["Visualizations"].append(single_duration)

    # Exercises
    exer_events = data[data["Event Name"] == "PE event"]
    exer_ids = exer_events["Exercise Type"]
    for id in exer_ids.unique().tolist():
        single_module = exer_events[exer_events["Exercise Type"] == id].reset_index(drop=True)
        single_duration = 0.0
        for i in single_module.index:
            single_duration += float(getDeltaTime(single_module.iloc[i]["Start Time"], single_module.iloc[i]["End Time"]))
        module_durations["Exercises"].append(single_duration)
    return module_durations

def getDurationForRow(row):
    if row["Event Name"] == "reading":
        if "Reading time" in str(row['Action Time']):
            return float(row['Action Time'][13:-3])
        else:
            return 0
    elif row["Event Name"] == "visualizations":
        return float(getDeltaTime(row['Start Time'], row['End Time']))
    elif row["Event Name"] == "exercises":
        return float(getDeltaTime(row['Start Time'], row['End Time']))
    else:
        return 0

def getDurationBySession(input_data):
    read_session_data(input_data)
    data = data[data['Event Name'].isin(reading + visualization + exercises)]
    data = data.reset_index(drop=True)
    data['Event Name'] = data['Event Name'].replace(reading, "reading")
    data['Event Name'] = data['Event Name'].replace(visualization, "visualizations")
    data['Event Name'] = data['Event Name'].replace(exercises, "exercises")
    data['Duration'] = data.apply(lambda x:getDurationForRow(x), axis=1)

    threshold = 1 # second

    # Mask value is True if consecutive state, False otherwise
    mask = data['Event Name'] != data['Event Name'].shift(1, fill_value=data['Event Name'].iloc[0])
    group_key = mask.cumsum()

    # Group by Session and consecutive state mask then sum up the 'Duration' column
    result = data.groupby(['Session', group_key])['Duration'].sum().reset_index()

    # Dictionary that maps group_key to the original Event Name
    event_name_mapping = data.groupby(group_key)['Event Name'].first().to_dict()
    # Replace group_key with the original Event Name
    result['Event Name'] = result["Event Name"].map(event_name_mapping)

    # Truncate any rows with duration below the threshold
    result = result[result['Duration'] >= threshold]

    # Returned result is a list of sublists, where each sublist corresponds to a unique session ID (first element in each sublist).
    # In each session ID sublist there is a list of tuples of form (state, duration)
    result_grouped = result.groupby('Session').apply(lambda x: [(row['Event Name'], row['Duration']) for _, row in x.iterrows()]).reset_index(name='Processing')
    result_grouped_list = result_grouped[['Session', 'Processing']].values.tolist()

    return result_grouped_list
    