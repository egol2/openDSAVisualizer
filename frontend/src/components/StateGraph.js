import React from 'react';
import '../styles/StateGraph.css';
const StateGraph = (props) => {



    return (
        <div className="state-graph">
            <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
                
                <path d="M 50 200 q 250 -350 500 0" stroke="#454747"
                stroke-width={props.fakeFrequency[0]} fill="none" ><title>Reading → Exercise: {props.fakeFrequency[0]}</title></path>
                <polygon points="300,10 320,25 300,40" style={{fill: "#454747"}} />

                <path d="M 50 200 q 125 -150 250 0" stroke="#454747"
                stroke-width={props.fakeFrequency[1]} fill="none" ><title>Raeding → Visualizing: {props.fakeFrequency[1]}</title></path>
                <polygon points="170,110 190,125 170,140" style={{fill: "#454747"}} />
                
                <path d="M 300 200 q 125 -150 250 0" stroke="#454747"
                stroke-width={props.fakeFrequency[2]} fill="none" ><title>Visualizing → Exercise: {props.fakeFrequency[2]}</title></path>
                <polygon points="420,110 450,125 420,140" style={{fill: "#454747"}} />

                <path d="M 50 200 q 125 150 250 0" stroke="#454747"
                stroke-width={props.fakeFrequency[3]} fill="none" ><title>Visualizing → Reading: {props.fakeFrequency[3]}</title></path>
                <polygon points="190,260 170,275 190,290" style={{fill: "#454747"}} />

                <path d="M 300 200 q 125 150 250 0" stroke="#454747"
                stroke-width={props.fakeFrequency[4]} fill="none" ><title>Exercise → Visualizing: {props.fakeFrequency[4]}</title></path>
                <polygon points="450,260 420,275 450,290" style={{fill: "#454747"}} />

                <path d="M 50 200 q 250 350 500 0" stroke="#454747"
                stroke-width={props.fakeFrequency[5]} fill="none" ><title>Exercise → Reading: {props.fakeFrequency[5]}</title></path>
                <polygon points="320,360 300,375 320,390" style={{fill: "#454747"}} />

                <circle className="reading-circle" cx="50" cy="200" r="40" stroke="black" stroke-width="0" fill="#E3B448" />
                <text x="22" y="205" fill="black" font-size="15" font-weight="bold">Reading</text>
                <circle className="vis-circle" cx="300" cy="200" r="40" stroke="black" stroke-width="0" fill="#CBD18F" />
                <text x="262" y="205" fill="black" font-size="15" font-weight="bold">Visualizing</text>
                <circle className="ex-circle" cx="550" cy="200" r="40" stroke="black" stroke-width="0" fill="#4e9147" />
                <text x="522" y="205" fill="black" font-size="15" font-weight="bold">Exercise</text>
            </svg>
        </div>       
    );
    
}

export default StateGraph;