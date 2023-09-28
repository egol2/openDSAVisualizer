import os
import pandas as pd
from datetime import datetime as dt, timedelta

# Reads Interactions file generated from abstracing_script with suffix _merged_result_unannotated.csv
def read_session_data(filename):
    global data
    print("working directory", os.getcwd())
    data = pd.read_csv(filename + "_merged_result_unannotated.csv")
    users = data['user ID'].unique()
    global df_dict
    df_dict = {elem: pd.DataFrame for elem in users}
    for user in df_dict.keys():
        df_dict[user] = data[:][data['user ID'] == user]
    # document event, Window open, Window close, window event, FF event, PE event, Other event

# Gets the delta time end - start assuming start, end are string
def getDeltaTime(start, end):
    start_time = dt.strptime(start, "%Y-%m-%d %H:%M:%S")
    end_time = dt.strptime(end, "%Y-%m-%d %H:%M:%S")
    return (end_time - start_time).total_seconds() 

# Generates a dictionary of transition counts between the three states
# R = Reading, V = Visualizations, E = Exercises
def getTransitionCounts(filename, start, end):
    read_session_data(filename)

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
    reading = ["document event ", "window event", "Window open", "Window close"]
    visualization = ['FF event']
    exercises = ['PE event']

    # Process data
    for i in data.index - 1:
        current_session = data.iloc[i]['session']
        # If the event lies within the threshold
        if data.iloc[i]['Event name'] in reading:
            current_state = 'R'
        elif data.iloc[i]['Event name'] in visualization:
            current_state = 'V'
        elif data.iloc[i]['Event name'] in exercises:
            current_state = 'E'
        if previous_state is not None and current_state != previous_state:
            transition_counts[previous_state + current_state] += 1
            match_count += 1
        # If starting new session, reset previous state
        previous_state = current_state if previous_session == current_session else None
        previous_session = current_session

    # Final value output
    print("Total transition counts for student {}: {}".format(data.iloc[i - 1]['user ID'], match_count))
    print("Transition state dictionary for student {}: {}".format(data.iloc[i - 1]['user ID'], transition_counts))

    # Export to csv
    # Create a DataFrame
    df = pd.DataFrame()
    # Append row representing student transition data
    df = pd.concat([df, pd.DataFrame([[data.iloc[i - 1]['user ID'], str(match_count)]])])
    # Reset match_count
    match_count = 0
    # df.to_csv("transition_counts.csv")

# Test and run functions
test_filename = 'id_15768'
getTransitionCounts(test_filename, 15, 120)