import React from 'react';
import '../styles/StudentList.css';

const StudentList = (props) => {
    if (!props.students || !Array.isArray(props.students) || props.students.length === 0) {
        return <div className="list-container">No students to display.</div>;
    }
    
    return (
        <div className="list-container">
            <ul className="student-list">
            {props.students.map((student, index) => (
                <li key={student.user_id} className={`list-item ${index % 2 === 0 ? 'first' : 'second'}`} onClick={() => props.onStudentClick(student)}>
                    Student {student.user_id}
                </li>
            ))}
            </ul>
        </div>
    );
};

export default StudentList;