import React from 'react';
import '../styles/StudentList.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';

const StudentList = (props) => {

    console.log("log");
    console.log(props);
    const parsedStudents = JSON.parse(props.students.replace(/'/g, '"'));

    // sort students by letter grade and total percentage
    const gradeValues = {
        'A+': 12,
        A: 11,
        'A-': 10,
        'B+': 9,
        B: 8,
        'B-': 7,
        'C+': 6,
        C: 5,
        'C-': 4,
        'D+': 3,
        D: 2,
        'D-': 1,
        F: 0,
    };

    parsedStudents.sort((a, b) => {
        if (a.Grade === b.Grade) {
            const aTotal = a.Projects + a.Midterm + a.Final;
            const bTotal = b.Projects + b.Midterm + b.Final;
            return bTotal - aTotal;
        }
        return gradeValues[b.Grade] - gradeValues[a.Grade];
    });

    if (!parsedStudents|| !Array.isArray(parsedStudents) || parsedStudents.length === 0) {
        return <div className="list-container">No students to display.</div>;
    }

    const ListItemStyled = styled(ListItem)`
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 4px 0;
        padding: 10px 20px;
        font-weight: bold;
        font-size: 15px;`;
    
    return (
        <List class="list-container">
            <ListItem class="header">
                <div>Student ID</div>
                <div>Grade</div>
            </ListItem>
            {parsedStudents.map((student, index) => (
                <ListItemStyled key={student.user_id} key2={student.Grade} className={`list-item ${index % 2 === 0 ? 'first' : 'second'}`} onClick={() => props.onStudentClick(student)}>
                    <span className="student-name">{student.user_id}</span>
                    <span className="student-grade">{student.Grade}</span>
                </ListItemStyled>
            ))}
        </List>
    );
};

export default StudentList;