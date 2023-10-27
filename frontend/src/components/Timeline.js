// import React from 'react';
import React, { useEffect } from 'react';
import '../styles/StateGraph.css';
import * as d3 from 'd3';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';

const Timeline = (props) => {

    const data = [
        [{ Reading: 34 }, { Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Visualization: 60 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
        [{ Exercise: 56 }, { Visualization: 20 }, { Exercise: 45 }, { Reading: 123 }],
    ];

    // console.log("props");
    // console.log(props);
    useEffect(() => {
        const svg = d3.select("#timeline");
    
        const colors = d3.scaleOrdinal(d3.schemeCategory10); // This provides 10 unique colors. Extend if necessary.
    
        data.forEach((entryArray, dataIndex) => {
            const svgId = `timeline-${dataIndex}`;
            const svg = d3.select(`#${svgId}`)
                .style("transform", `translateY(${dataIndex}px)`);
            let xOffset = 10;
    
            let totalSeconds = 0;
            entryArray.forEach(entry => {
                totalSeconds += entry[Object.keys(entry)[0]];
            });
    
            const xScale = d3.scaleLinear()
                .domain([0, totalSeconds])
                .range([10, 790]);
    
            svg.append("g")
                .attr("transform", "translate(0,85)")
                .call(d3.axisBottom(xScale).ticks(10));
    
            entryArray.forEach(entry => {
                const key = Object.keys(entry)[0];
                const value = entry[key];
    
                svg.append("rect")
                    .attr("x", xOffset)
                    .attr("y", 40)
                    .attr("width", value)
                    .attr("height", 30)
                    .attr("fill", colors(key));
    
                xOffset += value;
            });
            
            if (dataIndex === 0) {
                // Adding a legend
                const uniqueKeys = [...new Set(entryArray.map(d => Object.keys(d)[0]))];
                const legend = svg.append("g")
                    .attr("transform", "translate(10,5)");
    
                uniqueKeys.forEach((key, index) => {
                    legend.append("rect")
                        .attr("x", index * 80)
                        .attr("y", 0)
                        .attr("width", 15)
                        .attr("height", 15)
                        .attr("fill", colors(key));
    
                    legend.append("text")
                        .attr("x", index * 80 + 20)
                        .attr("y", 12)
                        .text(key);
                });
            }
        });
    
    }, [data]);
    
    const ListItemStyled = styled(ListItem)`
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 8px 0;
    `;

    return (
        <div className="state-graph">
            <h3>Multiple Timelines</h3>
            <List>
                {
                    data.map((_, index) => (
                        <ListItemStyled key={index}>
                            <svg id={`timeline-${index}`} width="800" height="110"></svg>
                        </ListItemStyled>
                    ))
                }
            </List>
        </div>       
    );
    
    
}

export default Timeline;