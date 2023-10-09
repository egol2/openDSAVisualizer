import Input from '@mui/material/Input';
import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import '../styles/Dashboard.css';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';
import StateGraph from '../components/StateGraph';
import ScatterPlot from '../components/ScatterPlot';
import Item from '../components/Item';
import { Outlet, Link } from "react-router-dom";
import StudentList from '../components/StudentList';
import StudentDetail from '../components/StudentDetail';
const Dashboard = () => {
    
    const [selectedStudent, setSelectedStudent] = useState(null);
    // const [navigateToUpload, setNavigateToUpload] = useState(false);
    

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    // const handleNavigate = () => {
    //     setNavigateToUpload(true);
    // };


    const studentsData = [
        { id: 1, name: 'Student 1', grade: 'A' },
        { id: 2, name: 'Student 2', grade: 'B' },
        { id: 3, name: 'Student 3', grade: 'C' },
        { id: 4, name: 'Student 4', grade: 'D' },
        { id: 5, name: 'Student 5', grade: 'C' },
        { id: 6, name: 'Student 6', grade: 'A' },
        { id: 3, name: 'Student 3', grade: 'C' },
        { id: 4, name: 'Student 4', grade: 'D' },
        { id: 5, name: 'Student 5', grade: 'C' },
        { id: 6, name: 'Student 6', grade: 'A' },
        { id: 3, name: 'Student 3', grade: 'C' },
        { id: 4, name: 'Student 4', grade: 'D' },
        { id: 5, name: 'Student 5', grade: 'C' },
        { id: 6, name: 'Student 6', grade: 'A' },
        { id: 3, name: 'Student 3', grade: 'C' },
        { id: 4, name: 'Student 4', grade: 'D' },
        { id: 5, name: 'Student 5', grade: 'C' },
        { id: 6, name: 'Student 6', grade: 'A' },
        // Add more student data here
      ];


    const getStudents = async () => {
        console.log("HELLOOOO");
        try {
            const response = await fetch('http://localhost:8000/scores');
            
            if (response.ok) {
                console.log('Get student list successfully');
                console.log(response);
            } else {
                console.error('Failed to get students:', await response.text());
            }
            

        } catch (error) {
            console.error('Failed to get students:', error);
        }
    }

    useEffect( () => {
        getStudents();
    }, []);

    const styleObj = {
        color: "white",
        "&:hover": {
          backgroundColor: "rgba(213, 212, 212, 0.703)"
        },
        "&:active": {
          backgroundColor: "rgb(80, 78, 78)"
        }
      };

    const fakeFrequency = [8, 1, 10, 3, 4, 5]; //fake frequency for the state graph
    return (
        <div>
            <div className="dashboard-header">
                Dashboard
                <div className="upload-button-container">
                    <Link to="/"><Button sx={styleObj}>Back to Upload</Button></Link>
                </div>
            </div>
            <div className="dashboard-container">
                <div className= "column1">
                    <StudentList students={studentsData} onStudentClick={handleStudentClick}/>
                </div>
                <div className= "column2">
                    {selectedStudent && <StudentDetail student={selectedStudent} />}
                    <div className="graph-container">
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }} >
                            <div className="row1">
                                <StateGraph fakeFrequency={fakeFrequency}/>
                            </div>
                            <div className="row2">
                                <ScatterPlot/>  
                            </div>                       
                        </Box>
                    </div>
                </div>
                
                
            </div>

            
        </div>
    );
}

export default Dashboard;