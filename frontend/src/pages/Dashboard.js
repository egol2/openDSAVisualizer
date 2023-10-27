import React, {useState} from 'react';
import Button from '@mui/material/Button';
import '../styles/Dashboard.css';
import Box from '@mui/material/Box';
import StateGraph from '../components/StateGraph';
import ScatterPlot from '../components/ScatterPlot';
import Timeline from '../components/Timeline';
import { Link } from "react-router-dom";
import StudentList from '../components/StudentList';
import StudentDetail from '../components/StudentDetail';
import { useEffect } from 'react';


const Dashboard = () => {

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        getStudentInfo(student.user_id);
    }; 

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStudent, setIsLoadingStudent] = useState(true);
    const [studentsData, setStudentsData] = useState([]);
    const [studentInfoData, setStudentInfoData] = useState({});
    const [hintAtt, setHint] = useState([]);

    const processStudentData = async () => {
        try {
            const res = fetch('http://localhost:8000/process', {
                method: 'PUT'
            });
        } catch (error) {
            console.error('Error processing the files in the background:', error);
        }
    }

    const getStudents = async () => {
        setIsLoading(true);
        try { 
            const response = await fetch('http://localhost:8000/scores');
            
            if (response.ok) {
                console.log('Get student list successfully');
                const data = await response.json();
                setStudentsData(data);
                
                // console.log("Student Data\n:");
                // console.log(data);

            } else {
                console.error('Failed to get students:', await response.text());
            } 
            
        } catch (error) {
            console.error('Failed to get students:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const getStudentInfo = async (id) => {
        setIsLoadingStudent(true);
        try {
            const response = await fetch(`http://localhost:8000/student/${id}`);
            
            if (response.ok) {
                console.log('Get student info successfully');
                const data = await response.json();
                setStudentInfoData(data);
                setHint(data.exercises_info);
                console.log("Student Info Data!\n:");
                console.log(data);
            } else {
                console.error('Failed to get student info:', await response.text());
            } 
            
        } catch (error) {
            console.error('Failed to get student info:', error);
        } finally {
            setIsLoadingStudent(false);
        }
    }

    useEffect(() => {
        processStudentData();
        getStudents();
    }, []);

    // useEffect(() => {
    //     console.log("studentdata!");
    //     console.log(studentsData);
    //     console.log("studentdata^");
    // }, [studentsData]);

    const styleObj = {
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "rgba(213, 212, 212, 0.703)"
        },
        "&:active": {
          backgroundColor: "rgb(80, 78, 78)"
        }
    };

    const fakeFrequency = [8, 1, 10, 3, 4, 5]; //fake frequency for the state graph
    return (
        <div>
            <div className="dashboard-header">
                Dashboard
                <div className="upload-button-container">
                    <Link to="/"><Button sx={styleObj}>Back to Upload</Button></Link>
                </div>
            </div>
            <div className="dashboard-container">
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className= "column1">
                            <StudentList students={studentsData} onStudentClick={handleStudentClick}/>
                        </div>
                        <div className= "column2">
                            {selectedStudent && <StudentDetail student={selectedStudent} />}
                            <div className="graph-container">
                                {isLoadingStudent ? (
                                    <div>Loading...</div>
                                ) : (
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                                        <div className="row1">
                                            <StateGraph frequency={studentInfoData}/>
                                        </div>
                                        <div className="row2">
                                            <ScatterPlot hintAttemp = {hintAtt}/>
                                        </div>
                                        <div className="row3">
                                            <Timeline frequency={studentInfoData}/>
                                        </div>
                                    </Box>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;