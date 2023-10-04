import React from 'react';
import '../styles/StudentList.css';

const StudentList = (props) => {
    return (
        <div className="list-container">
            <ul className="student-list">
            {props.students.map((student, index) => (
                <li key={student.id} className={`list-item ${index % 2 === 0 ? 'first' : 'second'}`} onClick={() => props.onStudentClick(student)}>
                    Student {student.id}
                </li>
            ))}
            </ul>
        </div>
    );
};

export default StudentList;