import React, {useState} from 'react';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import '../styles/Upload.css';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";


const Upload = () => {
    const [exFile, setExFile] = useState(null);
    const [intFile, setIntFile] = useState(null);
    const [scoreFile, setScoreFile] = useState(null);

    const navigate = useNavigate();

    const handleFileChange = (event, setter) => {
      const file = event.target.files[0];
      setter(file);
    };

    const sendFileToEndpoint = async (file, endpoint) => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`http://localhost:8000${endpoint}`, { // '/upload-endpoint' is your server's endpoint to handle file uploads
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
    };
    const HandleUpload = async () => {

      // Handle file upload logic here, e.g., send the file to a server.
        console.log('Uploading file:', exFile);
        console.log('Uploading file:', intFile);
        console.log('Uploading file:', scoreFile);
        //event.preventDefault();

        const formData = new FormData();

        formData.append('exfile', exFile);  // 'file' is the field name for the server to retrieve the file
        formData.append('intfile', intFile);
        formData.append('scorefile', scoreFile);

        // Send the file to the server
        await sendFileToEndpoint(formData.get('exfile'), '/upload/exercises');
        await sendFileToEndpoint(formData.get('intfile'), '/upload/interactions');
        await sendFileToEndpoint(formData.get('scorefile'), '/upload/scores');
        await getStudents()
            .then(data => {
                // Handle the data here
                //console.log(data);
            
                // Once you have the data, you can navigate to the "dashboard" page
                navigate("dashboard", { state: data }); // Pass the data as a parameter
            })
            .catch(error => {
                // Handle errors here
                console.error(error);
            });
    };
  
 

    return (
        <div className="upload-page-container">
            
            <Link to="dashboard" className="close-button">
                <IconButton size="large">
                    <CloseIcon fontSize="inherit"/>
                </IconButton>
            </Link>
            
            <div className='input-file-wrapper'>
                
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                        <TextField label="Exercises"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setExFile)} />
                    </Box>
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                        <TextField label="Interactions"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setIntFile)} />
                    </Box>
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'action.active', mr: 0.5, my: 0.5 }} />
                        <TextField label="Scores"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setScoreFile)} />
                    </Box>
                    <Button className='upload-button' size="large" variant="outlined" color="error" onClick={HandleUpload}>
                        Upload
                    </Button>
                
            </div>
        </div>
    );
  }
  
  export default Upload;