import React from 'react';
import '../styles/StudentDetail.css';
import PersonIcon from '@mui/icons-material/Person';

const StudentDetail = ({ student }) => {
    return (
      <div className="student-detail-box">
        <div className="student-id-box">
          <PersonIcon fontSize="large" className="user-picture"/>  <h2>Student ID: {student.user_id}</h2>
        </div>
        <div className="right-box">
          <div className="student-box">
              <p>Projects: {student.Projects}</p> 
          </div>
          <div className="student-box">
              <p>OpenDSA: {student.OpenDSA}</p> 
          </div>
          <div className="student-box">
              <p>Midterm: {student.Midterm}</p> 
          </div>
          <div className="student-box">
              <p>Final: {student.Final}</p> 
          </div>
        </div>
      </div>
    );
};

export default StudentDetail;