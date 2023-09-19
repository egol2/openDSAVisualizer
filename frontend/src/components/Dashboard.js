import Input from '@mui/material/Input';
import React, {useState} from 'react';
import Button from '@mui/material/Button';
import '../styles/Dashboard.css';
import { TextField } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Box from '@mui/material/Box';

const Dashboard = () => {
    
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

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
      
    return (
        <div>
            <div className='dashboard-header'>
                <h1>Dashboard</h1>
                <Button className='back-to-upload-button'>BACK TO Upload</Button>
            </div>
            <div className='dashboard-container'>
                <StudentList students={studentsData} onStudentClick={handleStudentClick}/>
                {selectedStudent && <StudentDetail student={selectedStudent} />}
            </div>
        </div>
    );
}

export default Dashboard;