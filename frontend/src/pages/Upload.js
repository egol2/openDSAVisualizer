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
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Upload = () => {
    const [exFile, setExFile] = useState(null);
    const [intFile, setIntFile] = useState(null);
    const [scoreFile, setScoreFile] = useState(null);
    const [uploadButton, setUploadButton] = useState("Upload");
    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

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
        setSubmitClicked(true);
        //setUploadButton("Loading...")
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

        // Once you have the data, you can navigate to the "dashboard" page
        navigate("dashboard"); // Pass the data as a parameter
    };   
     
    useEffect(() => {
        document.body.style.backgroundColor = "var(--background)"
    })

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setDarkMode(currentTheme === 'dark');
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);
  
    const theme = createTheme({
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '--TextField-brandBorderColor': 'var(--text)',
                    },
                },
            },
        },
    }); 

    return (
        <div className="upload-page-container">
            <div className="upload-header"> Upload Files </div>
            <Link to="dashboard" className="close-button">
                <IconButton sx={{color: 'var(--text)' }} size="large">
                    <CloseIcon fontSize="inherit"/>
                </IconButton>
            </Link>
            
            <div className='input-file-wrapper'>
                
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'var(--text)', mr: 0.5, my: 0.5 }} />
                        <ThemeProvider theme={theme}>
                        <TextField sx={{ input: { color: 'var(--text)' } }}  label="Exercises"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setExFile)} />
                        </ThemeProvider>
                    </Box>
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'var(--text)', mr: 0.5, my: 0.5 }} />
                        <TextField sx={{ input: { color: 'var(--text)' } }} label="Interactions"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setIntFile)} />
                    </Box>
                    <Box className='input-box' sx={{ display: 'flex', alignItems: 'center' }}>
                        <FileUploadIcon sx={{ color: 'var(--text)', mr: 0.5, my: 0.5 }} />
                        <TextField sx={{ input: { color: 'var(--text)' } }} label="Scores"
                        InputLabelProps={{shrink: true,}} type="file" className="input-box" onChange={(event) => handleFileChange(event, setScoreFile)} />
                    </Box>
                    {submitClicked ? (
                        <CircularProgress />
                    ) : (
                        
                        <Button className='upload-button' size="large" variant="outlined" onClick={HandleUpload}>
                        {uploadButton}
                        </Button>
                    )}
                    
                
            </div>
        </div>
    );
  }
  
  export default Upload;