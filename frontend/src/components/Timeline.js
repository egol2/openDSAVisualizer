// import React from 'react';
import React, { useEffect, useState } from 'react';
import '../styles/StateGraph.css';
import * as d3 from 'd3';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import styled from '@emotion/styled';
import Slider from '@mui/material/Slider';

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

    const categories = ["reading", "visualizations", "exercises"];
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

        const leftX = 65;
        const topYOffset = 50;

        // Draw the cumulative timeline
        const overlaySVG = d3.select("#overlay-timeline");
        const baseY = 245 + topYOffset;

        overlaySVG.attr("height", baseY + 40);  // Setting the height

        // 3. Generate the correct x-axis for the cumulative timeline
        const xScaleCumulative = d3.scaleLinear()
            .domain([0, maxDuration])
            .range([leftX, 790]);

        // 4. Create the x-axis with tick marks formatted as minutes
        const xAxisCumulative = d3.axisBottom(xScaleCumulative)
            .tickFormat(function(d) {
                return `${parseInt(d/60)}`;
            });

        overlaySVG.append("g")
            .attr("transform", "translate(0,"+baseY+")") 
            .call(xAxisCumulative)
            .append("text")  // Add this line to append a text label
            .attr("fill", "#000")  // Set the text color
            .attr("y", 30)  // The y position of the text
            .attr("dy", ".71em")  // Shift the position a bit to properly align
            .style("text-anchor", "start")  // Anchor the text at the end position
            .attr("x", 790/2)  // The y position of the text
            .text("Time in minutes");  // The label
        
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
            .attr("x", -baseY / 2)  // The y position of the text
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
        // data.forEach((entryArray, dataIndex) => {
        //     const svgId = `timeline-${dataIndex + 1}`;
        //     const svg = d3.select(`#${svgId}`);
        //     let xOffset = leftX;

        //     svg.append("g")
        //         .attr("transform", "translate(0,85)")
        //         .call(d3.axisBottom(xScaleCumulative).ticks(10))
        //         .append("text")  // Add this line to append a text label
        //         .attr("fill", "#000")  // Set the text color
        //         .attr("y", 30)  // The y position of the text
        //         .attr("dy", ".71em")  // Shift the position a bit to properly align
        //         .style("text-anchor", "start")  // Anchor the text at the end position
        //         .attr("x", 350)  // The y position of the text
        //         .text("Time in seconds");  // The label

        //     entryArray.forEach(entry => {
        //         const category = entry[0];
        //         const value = entry[1];
        //         // const categoryName = categories.find(cat => cat.charAt(0) === category); // Match by first letter

        //         svg.append("rect")
        //             .attr("x", xOffset)
        //             .attr("y", 40)
        //             .attr("width", xScaleCumulative(value) - xScaleCumulative(0))  // Using the scale to get the width
        //             .attr("height", 30)
        //             .attr("fill", colors(category));

        //         xOffset += xScaleCumulative(value) - xScaleCumulative(0);
        //     });
        // });

        // Assuming a height of 10 for each timeline
        const timelineHeight = 10;
        const yOffset = 40; // offset to position the timelines a bit down on the SVG

        // Calculate the total SVG height: combined height of all timelines, plus space for the legend and any margins
        const totalSvgHeight = yOffset + (timelineHeight * data.length) + 85; // 85 for the axis, 30 for the text label

        // Modify the SVG to set the computed height
        const svg2 = d3.select("#combined-timeline-svg");
        svg2.attr("height", totalSvgHeight);

        data.forEach((entryArray, dataIndex) => {
            let xOffset = leftX;
            // Calculate y position based on timeline index
            const yPos = yOffset + (timelineHeight * dataIndex);

            entryArray.forEach(entry => {
                const category = entry[0];
                const value = entry[1];

                svg2.append("rect")
                    .attr("x", xOffset)
                    .attr("y", yPos)
                    .attr("width", xScaleCumulative(value) - xScaleCumulative(0))
                    .attr("height", 5)
                    .attr("fill", colors(category));

                xOffset += xScaleCumulative(value) - xScaleCumulative(0);
            });
        });

        // Y scale for session numbers
        const yScaleSessions = d3.scaleLinear()
            .domain([1, data.length]) // from first to last session
            .range([yOffset, yOffset + timelineHeight * (data.length - 1) + 5]);

        // Append y-axis for session numbers on the left side
        svg2.append("g")
            .attr("transform", `translate(${leftX - 10},0)`) // Move a bit left from the starting x position
            .call(d3.axisLeft(yScaleSessions).ticks(data.length/3))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -(yOffset + timelineHeight * (data.length - 1) + 5) / 2)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Sessions");

        // Append x-axis and label below all timelines
        svg2.append("g")
            .attr("transform", `translate(0,${yOffset + timelineHeight * data.length + 10})`)
            .call(xAxisCumulative)
            .append("text")
            .attr("fill", "#000")
            .attr("y", 30)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .attr("x", 790/2)
            .text("Time in minutes");


        // Render the legend SVG
        const legendSvg = d3.select("#legend-svg");
        const legend = legendSvg.append("g").attr("transform", "translate(20,5)");

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
    
    // State for the slider value
    const [sliderValue, setSliderValue] = useState(0);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };
    
    const ListItemStyled = styled(ListItem)`
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 8px 0;
        padding: 15px;
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

                {/* {data.map((_, index) => (
                    <ListItemStyled key={index}>
                        <svg id={`timeline-${index + 1}`} width="800" height="130"></svg>
                    </ListItemStyled>
                ))} */}
                {/* <ListItemStyled>
                    <Slider
                        defaultValue={0}
                        value={sliderValue}
                        min={1}
                        max={data.length - 1}
                        aria-label="Timeline Selector"
                        valueLabelDisplay="on"
                        onChange={handleSliderChange}
                        // onChangeCommitted={handleSliderChange}
                    />
                </ListItemStyled>
                <ListItemStyled>
                    <svg id={`timeline-${sliderValue}`} width="800" height="130"></svg>
                </ListItemStyled> */}
                <ListItemStyled>
                    <svg id={`combined-timeline-svg`} width="800" height="130"></svg>
                </ListItemStyled>
            </List>
        </div>
    );
}

export default Timeline;
