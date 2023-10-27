import React from 'react';
import '../styles/StudentDetail.css';
import PersonIcon from '@mui/icons-material/Person';

const StudentDetail = ({ student }) => {
    return (
      <div className="student-detail-box">
        <div className="user-picture">
          <PersonIcon fontSize="large" />  
        </div>
        <div className="student-id-box">
            <h2>Student ID: {student.user_id}</h2>
        </div>
        <div className="student-proj-box">
            <p>Projects: {student.Projects}</p> 
        </div>
        <div className="student-openDSA-box">
            <p>OpenDSA: {student.OpenDSA}</p> 
        </div>
        <div className="student-Midterm-box">
            <p>Midterm: {student.Midterm}</p> 
        </div>
        <div className="student-Final-box">
            <p>Final: {student.Final}</p> 
        </div>
      </div>
    );
};

export default StudentDetail;