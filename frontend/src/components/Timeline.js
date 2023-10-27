// import React from 'react';
import React, { useEffect } from 'react';
import '../styles/StateGraph.css';
import * as d3 from 'd3';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';

const Timeline = (props) => {
    const data = [
        [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        [{ E: 56 }, { V: 20 }, { E: 45 }, { R: 123 }],
    ];

    const categories = ["Exercise", "Visualization", "Reading"];

    useEffect(() => {
        const svg = d3.select("#timeline");
        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw the cumulative timeline
        const overlaySVG = d3.select("#overlay-timeline");
        const baseY = 55;  // Middle of the SVG height

        const calcFrequencyAtSecond = (second, category) => {
            let countAtSecond = 0;
            data.forEach(entryArray => {
                let timeSpent = 0;
                for (const entry of entryArray) {
                    const duration = entry[Object.keys(entry)[0]];
                    if (Object.keys(entry)[0] === category && second >= timeSpent && second <= timeSpent + duration) {
                        countAtSecond += 1;
                    }
                    timeSpent += duration;
                }
            });
            return countAtSecond;
        };

        categories.forEach(category => {
            let upperPoints = [];
            let lowerPoints = [];

            for (let second = 0; second <= 800; second++) {
                const frequency = calcFrequencyAtSecond(second, category);
                const distanceBetweenPoints = frequency * 20;  // A scaling factor

                upperPoints.push([second, baseY - (distanceBetweenPoints / 2)]);
                lowerPoints.push([second, baseY + (distanceBetweenPoints / 2)]);
            }

            const upperLine = d3.line()(upperPoints);
            const lowerLine = d3.line()(lowerPoints.reverse());  // Reverse to draw the area correctly

            const areaPath = `${upperLine} ${lowerLine} Z`;  // Z to close the path

            overlaySVG.append("path")
                .attr("d", areaPath)
                .attr("fill", d3.scaleOrdinal(d3.schemeCategory10)(category))
                .attr("opacity", 0.6);  // Opacity for better visualization

            lowerPoints.reverse();  // Reverse it back for consistency
        });
        
        // draw the individual timelines
        data.forEach((entryArray, dataIndex) => {
            const svgId = `timeline-${dataIndex + 1}`;  // +1 because we have added a legend SVG
            const svg = d3.select(`#${svgId}`);
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
        });

        // Render the legend SVG
        const uniqueKeys = [...new Set(data.flat().map(d => Object.keys(d)[0]))];
        const legendSvg = d3.select("#legend-svg");
        const legend = legendSvg.append("g").attr("transform", "translate(10,5)");

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
                {/* Legend Entry */}
                <ListItemStyled>
                    <svg id="legend-svg" width="800" height="22"></svg>
                </ListItemStyled>

                {/* Combined Timelines Entry */}
                <ListItemStyled>
                    <svg id="overlay-timeline" width="800" height="110"></svg>
                </ListItemStyled>

                {data.map((_, index) => (
                    <ListItemStyled key={index}>
                        <svg id={`timeline-${index + 1}`} width="800" height="110"></svg>
                    </ListItemStyled>
                ))}
            </List>
        </div>
    );
}

export default Timeline;
