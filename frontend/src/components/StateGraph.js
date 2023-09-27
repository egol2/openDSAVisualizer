import React from 'react';
import '../styles/StateGraph.css';
const StateGraph = (props) => {


    return (
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            
            <path className="tooltip-path" d="M 50 200 q 250 -350 500 0" stroke="#454747"
            stroke-width={props.fakeFrequency[0]} fill="none" />

            <path d="M 50 200 q 125 -150 250 0" stroke="#454747"
            stroke-width={props.fakeFrequency[1]} fill="none" />

            <path d="M 300 200 q 125 -150 250 0" stroke="#454747"
            stroke-width={props.fakeFrequency[2]} fill="none" />

            <path d="M 50 200 q 125 150 250 0" stroke="#454747"
            stroke-width={props.fakeFrequency[3]} fill="none" />

            <path d="M 300 200 q 125 150 250 0" stroke="#454747"
            stroke-width={props.fakeFrequency[4]} fill="none" />

            <path d="M 50 200 q 250 350 500 0" stroke="#454747"
            stroke-width={props.fakeFrequency[5]} fill="none" />

            <circle className="reading-circle" cx="50" cy="200" r="40" stroke="black" stroke-width="0" fill="#E3B448" />
            <text x="22" y="205" fill="black" font-size="15" font-weight="bold">Reading</text>
            <circle className="vis-circle" cx="300" cy="200" r="40" stroke="black" stroke-width="0" fill="#CBD18F" />
            <text x="262" y="205" fill="black" font-size="15" font-weight="bold">Visualizing</text>
            <circle className="ex-circle" cx="550" cy="200" r="40" stroke="black" stroke-width="0" fill="#4e9147" />
            <text x="522" y="205" fill="black" font-size="15" font-weight="bold">Exercise</text>
        </svg>
    );
    
}

export default StateGraph;