import Input from '@mui/material/Input';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import '../styles/Upload.css';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedScoreFile, setSelectedScoreFile] = useState(null);
    const [navigateToDashboard, setNavigateToDashboard] = useState(false);
    
    // const form = document.querySelector('form');
    // form.addEventListener('submit', handleSubmit);


    // function handleSubmit(event) {
    //   // The rest of the logic will go here.
    //   console.log("HERE");
    // }
    
    if (navigateToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };
  
    const handleUpload = () => {
      // Handle file upload logic here, e.g., send the file to a server.
      if (selectedFile) {
        console.log('Uploading file:', selectedFile);
        //sending the file to a server
      }
      //setNavigateToDashboard(true);
    };
  
    return (
        <div className="upload-page-container">
            
            <div className='input-file-wrapper'>
                <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                    <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                    <TextField label="Exercises"
                    InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={handleFileChange} />
                </Box>
                <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                    <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                    <TextField label="Interactions"
                    InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={handleFileChange} />
                </Box>
                <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                    <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                    <TextField label="Scores"
                    InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={handleFileChange} />
                </Box>
                <Button className='upload-button' size="large" variant="outlined" color="error" onClick={handleUpload}>
                  Upload
                </Button>

                {/* <form action="/api" method="post" enctype="multipart/form-data">
                  <label for="file">File</label>
                  <input id="file" name="file" type="file" />
                  <button>Upload</button>
                </form> */}
            </div>
            
        </div>
    );
  }
  
  export default Upload;