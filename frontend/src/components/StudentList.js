import React from 'react';
import '../styles/StudentList.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';

const StudentList = (props) => {

    console.log("log");
    console.log(props);
    const parsedStudents = JSON.parse(props.students.replace(/'/g, '"'));

    // const parsedStudents = JSON.parse(props.students);

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