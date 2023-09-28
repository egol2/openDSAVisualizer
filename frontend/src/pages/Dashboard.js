import Input from '@mui/material/Input';
import React, {useState} from 'react';
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

const Dashboard = () => {
    
    const [selectedStudent, setSelectedStudent] = useState(null);
    // const [navigateToUpload, setNavigateToUpload] = useState(false);
    

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    // const handleNavigate = () => {
    //     setNavigateToUpload(true);
    // };

    const StudentDetail = ({ student }) => {
        return (
          <div>
            <h2>Student ID: {student.id}</h2>
            <p>Grade: {student.grade}</p>
          </div>
        );
    };


    const studentsData = [
        { id: 1, name: 'Student 1', grade: 'A' },
        { id: 2, name: 'Student 2', grade: 'B' },
        { id: 3, name: 'Student 3', grade: 'C' },
        { id: 4, name: 'Student 4', grade: 'D' },
        // Add more student data here
      ];

    
    const StudentList = ({ students, onStudentClick }) => {
        return (
            <ul>
            {students.map((student) => (
                <li key={student.id} onClick={() => onStudentClick(student)}>
                {student.name}
                </li>
            ))}
            </ul>
        );
    };
    
    const fakeFrequency = [8, 1, 10, 3, 4, 5]; //fake frequency for the state graph
    return (
        <div>
            <Link to="/Upload"><Button>Upload</Button></Link>
            
            <div className='dashboard-container'>
                <StudentList students={studentsData} onStudentClick={handleStudentClick}/>
                {selectedStudent && <StudentDetail student={selectedStudent} />}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }} >
                    <StateGraph fakeFrequency={fakeFrequency}/>
                    <ScatterPlot/>                         
                </Box>
                
                
            </div>

            
        </div>
    );
}

export default Dashboard;