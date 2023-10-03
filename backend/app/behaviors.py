import os
import pandas as pd
from datetime import datetime as dt, timedelta

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
    # Consider all document and window events as Reading
    reading = ["Document event ", "Window event", "Window open", "Window close"]
    visualization = ['FF event']
    exercises = ['PE event']

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
    print("Total transition counts for student {}: {}".format(data.iloc[0]['User ID'], match_count))
    print("Transition state dictionary for student {}: {}".format(data.iloc[0]['User ID'], transition_counts))

    # Export to csv
    # Create a DataFrame
    df = pd.DataFrame()
    # Append row representing student transition data
    df = pd.concat([df, pd.DataFrame([[data.iloc[0]['User ID'], str(match_count)]])])
    # df.to_csv("transition_counts.csv")
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
    print("Total reading count for student {}: {}".format(data.iloc[0]['User ID'], match_count))
    print("Total reading duration for student {}: {}".format(data.iloc[0]['User ID'], duration))
    df = pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([[data.iloc[0]['User ID'], str(match_count), str(duration)]])])
    # df.to_csv("reading_duration.csv")
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
    print("Total visualization count for student {}: {}".format(data.iloc[0]['User ID'], match_count))
    print("Total visualization duration for student {}: {}".format(data.iloc[0]['User ID'], duration))
    df = pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([[data.iloc[0]['User ID'], str(match_count), str(duration)]])])
    # df.to_csv("visualization_duration.csv")
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
    print("Total exercises count for student {}: {}".format(data.iloc[0]['User ID'], match_count))
    print("Total exercises duration for student {}: {}".format(data.iloc[0]['User ID'], duration))
    df = pd.DataFrame()
    df = pd.concat([df, pd.DataFrame([[data.iloc[0]['User ID'], str(match_count), str(duration)]])])
    # df.to_csv("exercises_duration.csv")   
    return match_count, duration

# Test and run functions
# columns=["Session", "User ID", "Inst Book", "Event Name", "Event Description", "Start Time", "End Time", "Action Time", "Exercise Type", "Number of Events"]
# test_row = pd.DataFrame(data=[[1,15768,1106,"document event",
#                                "User loaded the 00.01 How to Use this System module",
#                                dt.strptime("2021-08-22 18:12:07", "%Y-%m-%d %H:%M:%S"),
#                                dt.strptime("2021-08-22 18:12:07", "%Y-%m-%d %H:%M:%S"),"","",1]], 
#                                columns=columns)
# getTransitionCounts(test_row)
# getReadingDuration(test_row, 5, 3600)
# getVisualizationDuration(test_row, 5, 3600)
# getExercisesDuration(test_row, 5, 3600)