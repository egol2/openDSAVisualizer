import os
import pandas as pd
import csv
from datetime import datetime as dt, timedelta
from io import StringIO, BytesIO

# Initializing some variables
avg_session_time = 0
total_session_count = 0
total_session_time = 0

document_event = ['document-ready']
window_event = ['window-unload', 'window-blur', 'window-focus', ]
pe_event = ['jsav-matrix-click', 'jsav-exercise-grade', 'jsav-exercise-reset', 'jsav-node-click', 
                'button-identifybutton', 'button-editbutton', 'button-addrowbutton', 'button-deletebutton', 'button-setterminalbutton', 'button-addchildbutton',
                'button-checkbutton', 'button-autobutton', 'button-donebutton',
                'submit-helpbutton', 'submit-edgeButton', 'submit-deleteButton', 'submit-undoButton', 'submit-redoButton', 'submit-editButton', 'submit-nodeButton',
                'submit-begin', 'submit-finish', 'button-hintbutton', 'button-movebutton', 'button-removetreenodebutton', 'button-savefile', 'button-edgebutton', 
                'jsav-exercise-model-end', 'jsav-exercise-model-begin', 'jsav-array-click',
                'jsav-exercise-gradeable-step', 'jsav-exercise-grade',
                'jsav-exercise-model-open', 'jsav-exercise-model-forward',
                'jsav-exercise-model-close', 'jsav-node-click',
                'jsav-exercise-grade-change', 'jsav-exercise-reset',
                'jsav-exercise-step-fixed', 'jsav-arraytree-click',
                'jsav-exercise-undo', 'jsav-exercise-model-backward',
                'jsav-exercise-model-begin', 'jsav-exercise-step-undone',
                'jsav-exercise-model-end', 'odsa-award-credit', 'odsa-exercise-init', 
                'button-classify', 'button-throwRoll', 'button-calculate',
                'button-decrement', 'button-help', 'button-selecting',
                'button-sorting', 'button-incrementing', 'button-run',
                'button-partition', 'button-markSorted', 'button-reset',
                'button-outputbuffer', 'button-noaction', 'button-submit',
                'button-insert', 'button-remove', 'button-next', 'button-about',
                'button-undir', 'button-dir', 'button-clear', 'button-read',
                'button-write', 'button-restart']
ff_event = ['jsav-begin', 'jsav-end', 'jsav-forward', 'jsav-backward']
other_event = ['hyperlink', 'jsav-narration-on', 'jsav-narration-off', 'button-layoutRef', 'odsa-exercise-init']

# Reads a raw interaction data file
def readfile(file_name):
    df = pd.read_csv(file_name)
    global csvdata
    csvdata = df.sort_values(['user_id', 'action_time'])

# convert time in a specific format to display
def GetTime(seconds):
    sec = timedelta(seconds=int(seconds))
    d = dt(1,1,1) + sec
    return "%d days %d hours %d minutes %d seconds" % (d.day-1, d.hour, d.minute, d.second)

# helper function to write a name of the event
def writeEvName(row):
    event = row['name']
    if event in document_event:
        return "Document event"
    elif event in window_event:
        return "Window event"
    elif event in ff_event:
        return "FF event"
    elif event in pe_event:
        return "PE event"
    else:
        return "Other event"

# Helper function to write a description for events
def writeDesc(row):    
    # exercise_type
    if row['ex_type'] == "pe":
        return "Attempted to solve PE"
    elif pd.isnull(row['inst_section_id']):
        return row['description']
    else:
        # ev_name
        if row['short_name']:
            return f'Attempted to solve {row[9]} frame '
        else:
            return f'Attempted to solve {row[9]} exercise'

# Helper function to write a time for events
def writeTime(row, start, end):
    if row['description'] == "PE" or row['ex_type'] == "pe" or check_pe_helper(row['name']):
        return f'{(end - start).total_seconds()} seconds'
    elif row['name'] in ff_event:
        return f'{(end-start).total_seconds()} seconds'
    elif "document" not in row['name']:
        # ev_name
        if row['short_name']:
            return f'In slideshow for {(end - start).total_seconds()} seconds' if (end - start).total_seconds() > 0 else None
        else:
            return f'In exercise for {(end - start).total_seconds()} seconds' if (end - start).total_seconds() > 0 else None

# Check whether the event is associated with PE
def check_pe_helper(command):
    if command in pe_event:
        return True
    else:
        return False

# Check whether this and next events are the same type of event (PE)
def bundle_pe(curr, next):
    if not pd.isnull(curr['ex_type']) or curr['description'] == 'PE': # curr has value
        if not pd.isnull(next['ex_type']): # both curr and next has values
            if curr['ex_type'] != 'pe' and next['ex_type'] != 'pe':
                return False
        else: #if only curr has value
            if not check_pe_helper(next['name']) and next['description'] != 'PE':
                return False 
    else: # curr doesn't have value
        if check_pe_helper(curr['name']):
            if next['ex_type'] == 'pe' or check_pe_helper(next['name']):
                return True
            else:
                return False
        else:
            return False
    return True
 
# Check whether this and next events are the same type of event (FF)
def bundle_ff(curr, next):
    if not pd.isnull(curr['short_name']) and curr['short_name'] == next['short_name']:
        return True
    else:
        return False

# Main function to abstract a raw event data into a session data
def abstract(file_name):
    readfile(file_name)
    
    global avg_session_time
    global total_session_count
    global total_session_time

    session_count = 0 
    session_start_time = csvdata.iloc[0]['action_time'] # Initially set up the start time as the first event's action time
    session_end_time = 0
    columns = ["Session", "User ID", "Inst Book", "Event Name", "Event Description", "Start Time", "End Time", "Action Time", "Exercise Type", "Number of Events"]
    start_time = 0
    num_event = 1

    is_pe_exercise = False
    is_ff_exercise = False

    # Write a csv file into a variable
    result = StringIO("")
    with result as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(columns)
        session_count += 1

        row_iterator = csvdata.iterrows()
        _, curr = next(row_iterator)
        for i, row in row_iterator:
            
            # Set the threshold for the session
            threshold = 600

        # Example of sample raw interaction data
        # id	    user_id	    inst_book_id	name	        description	            action_time	        inst_chapter_module_id	inst_section_id	    inst_exercise_id	short_name	    ex_type
        # 0         1           2               3               4                       5                   6                       7                   8                   9               10          
        # 22961032	8387	    722	            document-ready	"User loaded module"	2020-01-21 18:43	70590				
        # 23119732	3013	    722	            jsav-node-click	{"ev_num":43}	        2020-01-29 2:41	    70620	                109676	            1095	            sheet1exercise3	pe

            user_id = curr['user_id']
            book_id = curr['inst_book_id']
            ev_name = curr['name'] 
            ev_desc = curr['description']
            action_time = curr['action_time']
            module_id = curr['inst_chapter_module_id']
            section_id = curr['inst_section_id']
            exercise_id = curr['inst_exercise_id']
            exercise_name = curr['short_name']
            exercise_type = curr['ex_type']
            next_ev = row

            now = dt.strptime(action_time, "%Y-%m-%d %H:%M:%S")
            next_time = dt.strptime(next_ev['action_time'], "%Y-%m-%d %H:%M:%S")
            time_diff = (next_time - now).total_seconds()

            end_time = start_time

            if start_time == 0:
                start_time = action_time

            if session_count == 0:
                # writer.writerow("\n")
                # writer.writerow([f'Session {session_count + 1}'])
                session_count += 1
                session_start_time = action_time
                total_session_count = total_session_count + 1

            if user_id == next_ev['user_id']:
                if (time_diff > threshold): # Creating a new session
                    # For the last event of a session, we need to add one more row of event at the end of the session
                    end_time = action_time
                    start = dt.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                    end = dt.strptime(end_time, "%Y-%m-%d %H:%M:%S")
                    diff = writeTime(curr, start, end)
                    # diff = f'{(end - start).total_seconds()} seconds' if (end - start).total_seconds() > 0 else None 
                    if is_pe_exercise:
                        writer.writerow([session_count, user_id, book_id, writeEvName(curr), "Attempted to solve PE", start_time, end_time, diff, exercise_name, num_event])
                    elif is_ff_exercise:
                        writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])
                    else:
                        writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])

                    # Write a comprehensive information about a session
                    # Uncomment these lines if you want to see an annotated version of abstracted data
                    session_end_time = end
                    # writer.writerow([f'User inactive for {GetTime(time_diff)}'])
                    # writer.writerow([f'Session lasted for {session_end_time - dt.strptime(session_start_time, "%Y-%m-%d %H:%M:%S")}'])
                    # writer.writerow("\n")
                    # writer.writerow([f'Session {session_count + 1}'])
                    

                    total_session_time = total_session_time + (session_end_time - dt.strptime(session_start_time, "%Y-%m-%d %H:%M:%S")).total_seconds()
                    total_session_count = total_session_count + 1

                    session_count += 1
                    session_start_time = next_ev['action_time']
                    start_time = 0
                    num_event = 1
                    is_pe_exercise = False
                    is_ff_exercise = False

                else: # Retreive all events in one session
                    if user_id == next_ev['user_id']:
                        if ev_name == next_ev['name']: # Finds duplicate events within the same session
                            end_time = action_time
                            num_event += 1
                            curr = row
                            continue
                        else:
                            if bundle_pe(curr, next_ev):
                                end_time = action_time
                                num_event += 1
                                is_pe_exercise = True
                                curr = row
                                continue
                            elif bundle_ff(curr, next_ev):
                                end_time = action_time
                                num_event += 1
                                is_ff_exercise = True
                                curr = row
                                continue
                            else:
                                end_time = action_time                        
                                start = dt.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                                end = dt.strptime(end_time, "%Y-%m-%d %H:%M:%S")
                                diff = writeTime(curr, start, end)
                                # diff = f'In slideshow for {(end - start).total_seconds()} seconds' if (end - start).total_seconds() > 0 else None 

                                if is_pe_exercise:
                                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), "Attempted to solve PE", start_time, end_time, diff, exercise_name, num_event])
                                elif ev_name == 'window-focus':
                                    # if next_ev['name'] == 'window-blur':
                                        # if (next_time - now).total_seconds() > 3:
                                    writer.writerow([session_count, user_id, book_id, "Window open", writeDesc(curr), start_time, end_time, f'Reading time: {(next_time - now).total_seconds()} sec', exercise_name, num_event])

                                elif ev_name == 'window-blur' and next_ev['name'] == 'window-focus':
                                    # if (next_time - now).total_seconds() > 3:
                                    writer.writerow([session_count, user_id, book_id, "Window close", writeDesc(curr), start_time, end_time, f'Away time: {(next_time - now).total_seconds()} sec', exercise_name, num_event])
                                elif is_ff_exercise:
                                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])
                                else:
                                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])
                                start_time = 0
                                num_event = 1
                                is_pe_exercise = False
                                is_ff_exercise = False
                    else:
                        start_time = 0
                        session_count = 0
                        num_event = 1

            else: # Starts a new session for new student
                # For the last event of a session, we need to add one more row of event at the end of the session
                end_time = action_time                        
                start = dt.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                end = dt.strptime(end_time, "%Y-%m-%d %H:%M:%S")
                diff = writeTime(curr, start, end)
                # diff = f'{(end - start).total_seconds()} seconds' if (end - start).total_seconds() > 0 else None 
                if is_pe_exercise:
                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), "Attempted to solve PE", start_time, end_time, diff, exercise_name, num_event])
                elif ev_name == 'window-focus' and next_ev['name'] == 'window-blur':
                    # if (next_time - now).total_seconds() > 3:
                    writer.writerow([session_count, user_id, book_id, "Window open", writeDesc(curr), start_time, end_time, f'Reading time: {(next_time - now).total_seconds()} sec', exercise_name, num_event])
                elif ev_name == 'window-blur' and next_ev['name'] == 'window-focus':
                    # if (next_time - now).total_seconds() > 3:
                    writer.writerow([session_count, user_id, book_id, "Window close", writeDesc(curr), start_time, end_time, f'Away time: {(next_time - now).total_seconds()} sec', exercise_name, num_event])
                elif is_ff_exercise:
                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])
                else:
                    writer.writerow([session_count, user_id, book_id, writeEvName(curr), writeDesc(curr), start_time, end_time, diff, exercise_name, num_event])
                
                # Write a comprehensive information about a session
                start_time = 0
                session_count = 0
                num_event = 1

                session_end_time = end
                # writer.writerow([f'Session lasted for {session_end_time - dt.strptime(session_start_time, "%Y-%m-%d %H:%M:%S")}'])
                # writer.writerow([f'All User Session Ended for User: {user_id}'])
                total_session_time = total_session_time + (session_end_time - dt.strptime(session_start_time, "%Y-%m-%d %H:%M:%S")).total_seconds()

                is_pe_exercise = False
                is_ff_exercise = False
            curr = row
        file_csv = StringIO(result.getvalue())
        final = pd.read_csv(file_csv)
        return pd.DataFrame(final)

                
            
