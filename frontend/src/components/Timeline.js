// import React from 'react';
import React, { useEffect } from 'react';
import '../styles/StateGraph.css';
import * as d3 from 'd3';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';

const Timeline = (props) => {
    /*
    const data = [
        [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        // [{ R: 34 }, { E: 56 }, { V: 20 }, { E: 45 }, { V: 60 }, { R: 123 }],
        [{ R: 500 }],
    ];
    */
    // const data = props.duration.session_durations;
    const data = props.duration.session_durations.map(entry => entry[1]);

    console.log("data");
    console.log(data);

    // const data = props.duration;

    const categories = ["reading", "exercises", "visualizations"];
    const colors = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

    useEffect(() => {
        const svg = d3.select("#timeline");
        // const colors = d3.scaleOrdinal(d3.schemeCategory10);

        // 1. Find the maximum duration
        let maxDuration = 0;
        data.forEach(entryArray => {
            let totalSeconds = 0;
            entryArray.forEach(entry => {
                totalSeconds += entry[1];
            });
            if (totalSeconds > maxDuration) {
                maxDuration = totalSeconds;
            }
        });

        // where the left side of the svg starts to get drawn from
        const leftX = 45;

        // Draw the cumulative timeline
        const overlaySVG = d3.select("#overlay-timeline");
        const baseY = 245;  // Middle of the SVG height

        // 3. Generate the correct x-axis for the cumulative timeline
        const xScaleCumulative = d3.scaleLinear()
            .domain([0, maxDuration])
            .range([leftX, 790]);

        overlaySVG.append("g")
            .attr("transform", "translate(0,"+baseY+")") 
            .call(d3.axisBottom(xScaleCumulative).ticks(10))
            .append("text")  // Add this line to append a text label
            .attr("fill", "#000")  // Set the text color
            .attr("y", 30)  // The y position of the text
            .attr("dy", ".71em")  // Shift the position a bit to properly align
            .style("text-anchor", "start")  // Anchor the text at the end position
            .attr("x", 350)  // The y position of the text
            .text("Time in seconds");  // The label
        
        const calcFrequencyAtSecond = (second, category) => {
            let countAtSecond = 0;
            data.forEach(entryArray => {
                let timeSpent = 0;
                for (const entry of entryArray) {
                    const currentCategory = entry[0];
                    const duration = entry[1];
                    if (currentCategory === category && second >= timeSpent && second <= timeSpent + duration) {
                        countAtSecond += 1;
                    }
                    timeSpent += duration;
                }
            });
            return countAtSecond;
        };
        // Calculate the max frequency across all categories and all seconds
        // Calculate frequencies for all categories and all seconds
        const allFrequencies = [];
        for (let second = 0; second <= maxDuration; second++) {
            categories.forEach(category => {
                const frequency = calcFrequencyAtSecond(second, category);
                allFrequencies.push(frequency);
            });
        }

        // Find the maximum frequency
        const maxFrequency = d3.max(allFrequencies);

        // Create a scale for normalized frequency
        const thicknessScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([0, 400]);  // 0 to 30 pixels, adjust as needed

        const yScaleFrequency = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([baseY, baseY - 400]);  // adjust the range as needed
        overlaySVG.append("g")
            .attr("transform", "translate("+ leftX + ",0)") 
            .call(d3.axisLeft(yScaleFrequency).ticks(10))
            .append("text")  // Add this line to append a text label
            .attr("fill", "#000")  // Set the text color
            .attr("transform", "rotate(-90)")  // Rotate the text to be vertical
            .attr("y", -45)  // The y position of the text
            .attr("dy", ".71em")  // Shift the position a bit to properly align
            .style("text-anchor", "middle")  // Anchor the text at the end position
            .attr("x", -100)  // The y position of the text
            .text("Frequency");  // The label
        
        categories.forEach(category => {
            let upperPoints = [];
            let lowerPoints = [];
        
            for (let second = 0; second <= maxDuration; second++) {
                const frequency = calcFrequencyAtSecond(second, category);
                const distanceBetweenPoints = thicknessScale(frequency);
                // const distanceBetweenPoints = frequency * 20;
        
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
                .attr("d", areaPathUpper)
                .attr("fill", colors(category))
                .attr("opacity", 0.7)
                // .style("mix-blend-mode", "normal");
        });
        
        // draw the individual timelines
        data.forEach((entryArray, dataIndex) => {
            const svgId = `timeline-${dataIndex + 1}`;
            const svg = d3.select(`#${svgId}`);
            let xOffset = leftX;

            svg.append("g")
                .attr("transform", "translate(0,85)")
                .call(d3.axisBottom(xScaleCumulative).ticks(10))
                .append("text")  // Add this line to append a text label
                .attr("fill", "#000")  // Set the text color
                .attr("y", 30)  // The y position of the text
                .attr("dy", ".71em")  // Shift the position a bit to properly align
                .style("text-anchor", "start")  // Anchor the text at the end position
                .attr("x", 350)  // The y position of the text
                .text("Time in seconds");  // The label

            entryArray.forEach(entry => {
                const category = entry[0];
                const value = entry[1];
                // const categoryName = categories.find(cat => cat.charAt(0) === category); // Match by first letter

                svg.append("rect")
                    .attr("x", xOffset)
                    .attr("y", 40)
                    .attr("width", xScaleCumulative(value) - xScaleCumulative(0))  // Using the scale to get the width
                    .attr("height", 30)
                    .attr("fill", colors(category));

                xOffset += xScaleCumulative(value) - xScaleCumulative(0);
            });
        });

        // Render the legend SVG
        const legendSvg = d3.select("#legend-svg");
        const legend = legendSvg.append("g").attr("transform", "translate(" + leftX + ",5)");

        const computeSpacing = (wordLength) => 35 + wordLength * 7;

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

        const totalSessions = data.length;
        // Assuming the width of the legend SVG is known
        const legendWidth = legendSvg.node().getBoundingClientRect().width;

        // Add a label for total number of sessions, right-justified
        legendSvg.append("text")
            .attr("x", legendWidth - 10)  // Subtracting 10 for padding
            .attr("y", 16)
            .attr("text-anchor", "end")
            .text(`Total Sessions: ${totalSessions}`);

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
                    <svg id="overlay-timeline" width="800" height="300"></svg>
                </ListItemStyled>

                {data.map((_, index) => (
                    <ListItemStyled key={index}>
                        <svg id={`timeline-${index + 1}`} width="800" height="130"></svg>
                    </ListItemStyled>
                ))}
            </List>
        </div>
    );
}

export default Timeline;
