import Input from '@mui/material/Input';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import '../styles/Upload.css';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
  
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
    };
  
    return (
        <div className="upload-page-container">
            <div className='header'>
                <h1>OpenDSA Data Visualizer</h1>
            </div>
            
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
            </div>
            
        </div>
    );
  }
  
  export default Upload;