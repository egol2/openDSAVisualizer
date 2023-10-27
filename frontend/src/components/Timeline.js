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
        [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        // [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        [{ R: 500 }],
    ];
    const categories = ["Exercise", "Visualization", "Reading"];
    const colors = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

    useEffect(() => {
        const svg = d3.select("#timeline");
        // const colors = d3.scaleOrdinal(d3.schemeCategory10);

        // 1. Find the maximum duration
        let maxDuration = 0;
        data.forEach(entryArray => {
            let totalSeconds = 0;
            entryArray.forEach(entry => {
                totalSeconds += entry[Object.keys(entry)[0]];
            });
            if (totalSeconds > maxDuration) {
                maxDuration = totalSeconds;
            }
        });

        // Draw the cumulative timeline
        const overlaySVG = d3.select("#overlay-timeline");
        const baseY = 55;  // Middle of the SVG height

        // 3. Generate the correct x-axis for the cumulative timeline
        const xScaleCumulative = d3.scaleLinear()
            .domain([0, maxDuration])
            .range([10, 790]);

        overlaySVG.append("g")
            .attr("transform", "translate(0,105)") 
            .call(d3.axisBottom(xScaleCumulative).ticks(10));

        const calcFrequencyAtSecond = (second, category) => {
            let countAtSecond = 0;
            const categoryKey = category.charAt(0); // Extract the first letter for comparison
            data.forEach(entryArray => {
                let timeSpent = 0;
                for (const entry of entryArray) {
                    const duration = entry[Object.keys(entry)[0]];
                    if (Object.keys(entry)[0] === categoryKey && second >= timeSpent && second <= timeSpent + duration) {
                        countAtSecond += 1;
                    }
                    timeSpent += duration;
                }
            });
            return countAtSecond;
        };

        // categories.forEach(category => {
        //     let upperPoints = [];
        //     let lowerPoints = [];

        //     for (let second = 0; second <= 800; second++) {
        //         const frequency = calcFrequencyAtSecond(second, category);
        //         const distanceBetweenPoints = frequency * 20;

        //         upperPoints.push([second, baseY - (distanceBetweenPoints / 2)]);
        //         lowerPoints.push([second, baseY + (distanceBetweenPoints / 2)]);
        //     }

        //     const areaGenerator = d3.area()
        //         .x(d => d[0])
        //         .y0(d => d[1])
        //         .y1(baseY)
        //         .curve(d3.curveLinear);

        //     const areaPathUpper = areaGenerator(upperPoints);
        //     const areaPathLower = areaGenerator(lowerPoints.reverse());

        //     const combinedPath = `${areaPathUpper} ${areaPathLower} Z`;  // Combining both paths

        //     overlaySVG.append("path")
        //         .attr("d", combinedPath)
        //         .attr("fill", colors(category))
        //         .attr("opacity", 0.6);
        // });
        categories.forEach(category => {
            let upperPoints = [];
            let lowerPoints = [];
        
            for (let second = 0; second <= maxDuration; second++) {
                const frequency = calcFrequencyAtSecond(second, category);
                const distanceBetweenPoints = frequency * 20;
        
                upperPoints.push([xScaleCumulative(second), baseY - (distanceBetweenPoints / 2)]);
                lowerPoints.push([xScaleCumulative(second), baseY + (distanceBetweenPoints / 2)]);
            }
        
            const areaGenerator = d3.area()
                .x(d => d[0])
                .y0(d => d[1])
                .y1(baseY)
                .curve(d3.curveLinear);
        
            const areaPathUpper = areaGenerator(upperPoints);
            const areaPathLower = areaGenerator(lowerPoints.reverse());
        
            const combinedPath = `${areaPathUpper} ${areaPathLower} Z`;
        
            overlaySVG.append("path")
                .attr("d", combinedPath)
                .attr("fill", colors(category))
                .attr("opacity", 0.6);
        });
        
        // draw the individual timelines
        data.forEach((entryArray, dataIndex) => {
            const svgId = `timeline-${dataIndex + 1}`;
            const svg = d3.select(`#${svgId}`);
            let xOffset = 10;

            svg.append("g")
                .attr("transform", "translate(0,85)")
                .call(d3.axisBottom(xScaleCumulative).ticks(10));

            entryArray.forEach(entry => {
                const category = Object.keys(entry)[0];
                const value = entry[category];
                const categoryName = categories.find(cat => cat.charAt(0) === category); // Match by first letter

                svg.append("rect")
                    .attr("x", xOffset)
                    .attr("y", 40)
                    .attr("width", xScaleCumulative(value) - xScaleCumulative(0))  // Using the scale to get the width
                    .attr("height", 30)
                    .attr("fill", colors(categoryName));

                xOffset += xScaleCumulative(value) - xScaleCumulative(0);
            });
        });

        // Render the legend SVG
        const legendSvg = d3.select("#legend-svg");
        const legend = legendSvg.append("g").attr("transform", "translate(10,5)");

        const computeSpacing = (wordLength) => 25 + wordLength * 7;

        let xOffset = 0;
        categories.forEach((category, index) => {
            const wordLength = category.length;
            const currentSpacing = computeSpacing(wordLength);

            legend.append("rect")
                .attr("x", xOffset)
                .attr("y", 0)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", colors(category));

            legend.append("text")
                .attr("x", xOffset + 20)
                .attr("y", 12)
                .text(category);

            xOffset += currentSpacing;
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
                    <svg id="overlay-timeline" width="800" height="125"></svg>
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
