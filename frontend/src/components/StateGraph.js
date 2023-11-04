import React from 'react';
import '../styles/StateGraph.css';
import * as d3 from 'd3';

const StateGraph = (props) => {

    console.log("props Stategraph:");
    console.log(props);

    const totalTransitions = props.frequency.total_transitions;

    const normalize = (value) => {
        return (value / totalTransitions) * 40 + 5;
    }

    const totalDurations = {
        Reading: props.frequency.module_durations.Reading.reduce((acc, cur) => acc + cur, 0),
        Visualizations: props.frequency.module_durations.Visualizations.reduce((acc, cur) => acc + cur, 0),
        Exercises: props.frequency.module_durations.Exercises.reduce((acc, cur) => acc + cur, 0)
    };

    // Find the max duration to normalize the sizes accordingly
    const maxDuration = Math.max(totalDurations.Reading, totalDurations.Visualizations, totalDurations.Exercises);

    const normalizeCircle = (duration) => {
        // This normalization will ensure that the largest circle has a radius of 40 units,
        // and the other circles are scaled down accordingly.
        return (duration / maxDuration) * 30 + 40;
    };

    const svgWidth = 700;
    const offsetX = (svgWidth - 600) / 2;

    const categories = ['Reading', 'Visualizing', 'Exercise'];
    const colors = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

    return (
        <div className="state-graph">

            <h3>Frequency Transitions</h3>
            
            <svg viewBox="0 0 700 400" width={svgWidth} height="400" xmlns="http://www.w3.org/2000/svg">

            <path d={`M ${50 + offsetX} 200 q 250 -350 500 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.RE)} fill="none">
                <title>Reading → Exercise: {props.frequency.transitions.RE}</title>
            </path>
            <text x={295 + offsetX} y={70} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.RE}</text>
            <polygon points={`${290 + offsetX},5 ${320 + offsetX},25 ${290 + offsetX},45`} style={{fill: "#454747"}} />

            <path d={`M ${50 + offsetX} 200 q 125 -150 250 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.RV)} fill="none">
                <title>Reading → Visualizing: {props.frequency.transitions.RV}</title>
            </path>
            <text x={165 + offsetX} y={165} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.RV}</text>
            <polygon points={`${160 + offsetX},105 ${190 + offsetX},125 ${160 + offsetX},145`} style={{fill: "#454747"}} />

            <path d={`M ${300 + offsetX} 200 q 125 -150 250 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.VE)} fill="none">
                <title>Visualizing → Exercise: {props.frequency.transitions.VE}</title>
            </path>
            <text x={425 + offsetX} y={165} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.VE}</text>
            <polygon points={`${420 + offsetX},105 ${450 + offsetX},125 ${420 + offsetX},145`} style={{fill: "#454747"}} />

            <path d={`M ${50 + offsetX} 200 q 125 150 250 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.VR)} fill="none">
                <title>Visualizing → Reading: {props.frequency.transitions.VR}</title>
            </path>
            <text x={165 + offsetX} y={245} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.VR}</text>
            <polygon points={`${200 + offsetX},255 ${170 + offsetX},275 ${200 + offsetX},295`} style={{fill: "#454747"}} />

            <path d={`M ${300 + offsetX} 200 q 125 150 250 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.EV)} fill="none">
                <title>Exercise → Visualizing: {props.frequency.transitions.EV}</title>
            </path>
            <text x={425 + offsetX} y={245} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.EV}</text>
            <polygon points={`${450 + offsetX},255 ${420 + offsetX},275 ${450 + offsetX},295`} style={{fill: "#454747"}} />

            <path d={`M ${50 + offsetX} 200 q 250 350 500 0`} stroke="#454747"
                strokeWidth={normalize(props.frequency.transitions.ER)} fill="none">
                <title>Exercise → Reading: {props.frequency.transitions.ER}</title>
            </path>
            <text x={295 + offsetX} y={345} fill="black" fontSize="15" fontWeight="bold">{props.frequency.transitions.ER}</text>
            <polygon points={`${330 + offsetX},355 ${300 + offsetX},375 ${330 + offsetX},395`} style={{fill: "#454747"}} />

            <circle className="vis-circle" cx={300 + offsetX} cy="200"
                    r={normalizeCircle(totalDurations.Visualizations)} stroke="black" strokeWidth="0" fill={colors('Visualizing')} />
            <text x={262 + offsetX} y="195" fill="black" fontSize="15" fontWeight="bold">
                Visualizing
                <tspan x={262 + offsetX} dy="20" > 
                    {Math.floor(totalDurations.Visualizations/60)} min
                </tspan>
            </text>

            <circle className="reading-circle" cx={50 + offsetX} cy="200"
                    r={normalizeCircle(totalDurations.Reading)} stroke="black" strokeWidth="0" fill={colors('Reading')} />
            <text x={22 + offsetX} y="195" fill="black" fontSize="15" fontWeight="bold">
                Reading
                <tspan x={22 + offsetX} dy="20" > 
                    {Math.floor(totalDurations.Reading/60)} min
                </tspan>
            </text>

            <circle className="ex-circle" cx={550 + offsetX} cy="200"
                    r={normalizeCircle(totalDurations.Exercises)} stroke="black" strokeWidth="0" fill={colors('Exercise')} />
            <text x={522 + offsetX} y="195" fill="black" fontSize="15" fontWeight="bold">
                Exercise
                <tspan x={522 + offsetX} dy="20" > 
                    {Math.floor(totalDurations.Exercises/60)} min
                </tspan>
            </text>
            </svg>
        </div>       
    );

}

export default StateGraph;

