import React from 'react';
import '../styles/StudentDetail.css';

const StudentDetail = ({ student }) => {
    return (
      <div className="student-detail-box">
        <div className="user-picture">
            👤 
        </div>
        <div className="student-id-box">
            <h2>Student ID: {student.id}</h2>
        </div>
        <div className="student-grade-box">
            <p>Grade: {student.grade}</p>
        </div>
      </div>
    );
};

export default StudentDetail;