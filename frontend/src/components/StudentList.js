import React from 'react';
import '../styles/StudentList.css';

const StudentList = (props) => {

    console.log("log");
    console.log(props);
    const parsedStudents = JSON.parse(props.students.replace(/'/g, '"'));

    // const parsedStudents = JSON.parse(props.students);

    if (!parsedStudents|| !Array.isArray(parsedStudents) || parsedStudents.length === 0) {
        return <div className="list-container">No students to display.</div>;
    }
    
    return (
        <div className="list-container">
            <div className="student-list-header">
                <div className="student-header-cell">Student ID</div>
                <div className="grade-header-cell">Grade</div>
            </div>
            <ul className="student-list">
            {parsedStudents.map((student, index) => (
                <li key={student.user_id} key2={student.Grade} className={`list-item ${index % 2 === 0 ? 'first' : 'second'}`} onClick={() => props.onStudentClick(student)}>
                <span className="student-name">{student.user_id}</span>
                <span className="student-grade">{student.Grade}</span>
            </li>
            ))}
            </ul>
        </div>
    );
};

export default StudentList;