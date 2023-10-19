import React from 'react';
import '../styles/StateGraph.css';
const StateGraph = (props) => {

    console.log("props");
    console.log(props);

    const totalTransitions = props.frequency.total_transitions;

    const normalize = (value) => {
        return (value / totalTransitions) * 40 + 5;
    }

    const normalizeArrow = (value) => {
        return (value / totalTransitions) * 2;
    }

    return (
        <div className="state-graph">
                
            <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">

                <defs>
                    <marker id="arrowhead" markerWidth="3.34" markerHeight="5" refX="5.5" refY="2.5" 
                            orient="auto" overflow="visible">
                        <path d="M0 0 L3.34 2.5 L0 5" stroke="#454747" fill="none" stroke-width=".6" />
                    </marker>

                    <marker id="reversedArrowhead" markerWidth="3.34" markerHeight="5" refX="-2" refY="2.5" 
                            orient="auto" overflow="visible">
                        <path d="M3.34 0 L0 2.5 L3.34 5" stroke="#454747" fill="none" stroke-width=".6" />
                    </marker>
                </defs>

                <path d="M 50 200 q 250 -350 500 0" stroke="#454747"
                    strokeWidth={normalize(props.frequency.transitions.RE)} fill="none"
                    marker-end="url(#arrowhead)">
                    <title>Reading → Exercise: {props.frequency.transitions.RE}</title></path>
                    
                <path d="M 50 200 q 125 -150 250 0" stroke="#454747"
                    strokeWidth={normalize(props.frequency.transitions.RV)} fill="none" 
                    marker-end="url(#arrowhead)">
                    <title>Reading → Visualizing: {props.frequency.transitions.RV}</title></path>

                <path d="M 300 200 q 125 -150 250 0" stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.VE)} fill="none"
                marker-end="url(#arrowhead)" ><title>Visualizing → Exercise: {props.frequency.transitions.VE}</title></path>

                <path d="M 50 200 q 125 150 250 0" stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.VR)} fill="none" 
                marker-start="url(#reversedArrowhead)"><title>Visualizing → Reading: {props.frequency.transitions.VR}</title></path>

                <path d="M 300 200 q 125 150 250 0" stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.EV)} fill="none" 
                marker-start="url(#reversedArrowhead)"><title>Exercise → Visualizing: {props.frequency.transitions.EV}</title></path>

                <path d="M 50 200 q 250 350 500 0" stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.ER)} fill="none" 
                marker-start="url(#reversedArrowhead)"><title>Exercise → Reading: {props.frequency.transitions.ER}</title></path>

                <circle className="reading-circle" cx="50" cy="200" r="40" stroke="black" strokeWidth="0" fill="#E3B448" />
                <text x="22" y="205" fill="black" fontSize="15" fontWeight="bold">Reading</text>

                <circle className="vis-circle" cx="300" cy="200" r="40" stroke="black" strokeWidth="0" fill="#CBD18F" />
                <text x="262" y="205" fill="black" fontSize="15" fontWeight="bold">Visualizing</text>

                <circle className="ex-circle" cx="550" cy="200" r="40" stroke="black" strokeWidth="0" fill="#4e9147" />
                <text x="522" y="205" fill="black" fontSize="15" fontWeight="bold">Exercise</text>

            </svg>
        </div>       
    );
    
    
}

export default StateGraph;