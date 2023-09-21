import React from 'react';

const StateGraph = () => {

    return (
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            

            <path d="M 50 200 q 250 -350 500 0" stroke="black"
            stroke-width="2" fill="none" />

            <path d="M 50 200 q 125 -150 250 0" stroke="black"
            stroke-width="2" fill="none" />

            <path d="M 300 200 q 125 -150 250 0" stroke="black"
            stroke-width="2" fill="none" />

            <path d="M 50 200 q 125 150 250 0" stroke="black"
            stroke-width="2" fill="none" />

            <path d="M 300 200 q 125 150 250 0" stroke="black"
            stroke-width="2" fill="none" />

            <path d="M 50 200 q 250 350 500 0" stroke="black"
            stroke-width="2" fill="none" />

            <circle cx="50" cy="200" r="40" stroke="black" stroke-width="0" fill="pink" />
            <circle cx="300" cy="200" r="40" stroke="black" stroke-width="0" fill="purple" />
            <circle cx="550" cy="200" r="40" stroke="black" stroke-width="0" fill="blue" />
        </svg>
    );
    
}

export default StateGraph;