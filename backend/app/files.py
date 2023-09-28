import pandas as pd
from io import BytesIO

# Takes in the byte buffer of the file contents as a .tsv and splits the contents of the file into separate .log files for each student
def segment(contents):
    dataset = pd.read_csv(BytesIO(contents), delimiter='\t')
    dataset = pd.DataFrame(dataset)
    ids = dataset['user_id'].unique()
    for id_idx in range(len(ids)):
        data_slice = dataset[dataset['user_id'] == ids[id_idx]].set_index('id', drop=True)
        data_slice.to_csv("/app/app/data/" + ids[id_idx].astype(str) + '.log')