import Input from '@mui/material/Input';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import '../styles/Upload.css';

import { Outlet, Link } from "react-router-dom";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedScoreFile, setSelectedScoreFile] = useState(null);
    const [selectedInteractionFile, setSelectedInteractionFile] = useState(null);

    const [navigateToDashboard, setNavigateToDashboard] = useState(false);
    
    if (navigateToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    const handleFileChange = (event) => {
      const exerciseFile = event.target.files[0];
      // const interactionFile = event.target.files[0];
      // const scoreFile = event.target.files[0];
      setSelectedFile(exerciseFile);
      // setSelectedScoreFile(interactionFile);
      // setSelectedInteractionFile(scoreFile);

   
    };
  
    const handleUpload = async () => {
      // Handle file upload logic here, e.g., send the file to a server.
      if (selectedFile) {
        console.log('Uploading file:', selectedFile);
        // console.log('Uploading file:', selectedScoreFile);
        // console.log('Uploading file:', selectedInteractionFile);
        //sending the file to a server
        const formData = new FormData();

        formData.append('file', selectedFile);  // 'file' is the field name for the server to retrieve the file

        // Send the file to the server
        try {
            const response = await fetch('http://localhost:8000/uploadfile', { // '/upload-endpoint' is your server's endpoint to handle file uploads
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                console.log('File uploaded successfully');
            } else {
                console.error('File upload failed:', await response.text());
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
        }
      }
      //setNavigateToDashboard(true);

      
    };
  
    return (
        <div className="upload-page-container">

            <Link to="/" className="close-button">
                <IconButton size="large">
                    <CloseIcon fontSize="inherit"/>
                </IconButton>
            </Link>
            
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
                <Link to="/Dashboard">
                    <Button className='upload-button' size="large" variant="outlined" color="error" onClick={handleUpload}>
                    Upload
                    </Button>
                </Link>
            </div>        
        </div>
    );
  }
  
  export default Upload;