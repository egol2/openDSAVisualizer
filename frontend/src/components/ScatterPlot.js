import { useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
const ScatterPlot = () => {
    const [data] = useState([
        [90,20],
        [20,100],
        [66,44],
        [53,80],
        [24,182],
        [80,72],
        [10,76],
        [33,150],
        [100,15],
        [5,10],
    ]);
    const svgRef = useRef();

    useEffect(() => {
        //setting up container
        const w = 600;
        const h = 400;
        const svg = d3.select(svgRef.current)
            .attr('width', w)
            .attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', '100px')
            .style('margin-bottom', '100px');
        //setting up scaling
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, w]);
        const yScale = d3.scaleLinear()
            .domain([0, 200])
            .range([h, 0]);
        
        
        //setting up axis
        const xAxis = d3.axisBottom(xScale).ticks(data.length);
        const yAxis = d3.axisLeft(yScale).ticks(10); //10 y1-y2
        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${h})`);
        svg.append('g')
            .call(yAxis);
        
        
        //setting up axis labaling
        svg.append('text')
            .attr('x', w/2 - 10)
            .attr('y', h + 50)
            .text('Hints')
            .style('font-weight', 'bold');
        svg.append('text')
            .attr('y', -50)
            .attr('x', -230)
            .text('Attemps')
            .style('font-weight', 'bold')
            .attr('transform', 'rotate(-90)') // Rotate the text 90 degrees counterclockwise
            //.attr('dy', '-2em'); // Adjust the vertical positioning of the rotated label
        //setting up svg data
        svg.selectAll()
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', d => xScale(d[0]))
                .attr('cy', d => yScale(d[1]))
                .attr('r', 5)
                .style('fill', '#0069c0');
        svg.style('margin-left', '100px');
        svg.style('margin-top', '40px');
    }, [data])
    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default ScatterPlot;