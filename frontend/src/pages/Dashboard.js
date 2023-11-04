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
        console.log("Student212322\n:");
        console.log(student);
    }; 

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStudent, setIsLoadingStudent] = useState(true);
    const [studentsData, setStudentsData] = useState([]);
    const [studentInfoData, setStudentInfoData] = useState({});
    const [hintAtt, setHint] = useState([]);
    const [viewMode, setViewMode] = useState('full');

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

    useEffect(() => {
        if (studentsData.length > 0) {
            const parsedData = JSON.parse(studentsData.replace(/'/g, '"'));
            handleStudentClick(parsedData[0]);
        }
    }, [studentsData]);

    // useEffect(() => {
    //     console.log("studentdata!");
    //     console.log(studentsData);
    //     console.log("studentdata^");
    // }, [studentsData]);

    const styleObj = {
        color: "var(--text)",
        fontWeight: "bold",
        margin: "0 10px",
        backgroundColor: "var(--secondary)",
        "&:hover": {
            backgroundColor: "var(--highlight)"
        },
        "&:active": {
            backgroundColor: "var(--highlight)"
        }
    };

    const fakeFrequency = [8, 1, 10, 3, 4, 5]; //fake frequency for the state graph
    return (
        <div>
            <div className="dashboard-header">
                Dashboard
                <div className="upload-button-container">
                    <Button sx={styleObj} onClick={() => setViewMode(viewMode === 'grid' ? 'full' : 'grid')}>
                        {viewMode === 'grid' ? 'Full View' : 'Grid View'}
                    </Button>
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
                            <div className={`graph-container ${viewMode === 'grid' ? 'grid-view' : 'full-view'}`}>
                                {isLoadingStudent ? (
                                    <div>Loading...</div>
                                ) : (
                                    <>
                                        {viewMode === 'grid' ? (
                                            <div className="sub-column">
                                                <div className="row1">
                                                <StateGraph frequency={studentInfoData}/>
                                                </div>
                                                <div className="row2">
                                                <ScatterPlot hintAttemp = {hintAtt}/>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="row1">
                                                    <StateGraph frequency={studentInfoData}/>
                                                </div>
                                                <div className="row2">
                                                    <ScatterPlot hintAttemp = {hintAtt}/>
                                                </div>
                                            </>
                                        )}
                                        <div className="row3">
                                            <Timeline duration={studentInfoData}/>
                                        </div>
                                    </>
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