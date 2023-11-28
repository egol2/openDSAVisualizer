import { useRef, useEffect} from 'react';
import * as d3 from 'd3';
import '../styles/ScatterPlot.css';

const ScatterPlot = (props) => {
    const rawData = props.hintAttemp;

    // Filter the data to exclude outliers
    const data = rawData.filter(d => d[0] <= 30 && d[1] <= 30);

    const svgRef = useRef();

    useEffect(() => {
        //setting up container
        const w = 600;
        const h = 400;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${w + margin.left + margin.right} ${h + margin.top + margin.bottom}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        //setting up scaling
        const xMax = d3.max(data, d => d[1]);//d3.max(data, d => d[0]);
        const yMax = xMax//d3.max(data, d => d[1]);
        const xScale = d3.scaleLinear()
            .domain([0, xMax])
            .range([0, w]);
        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([h, 0]);
        
        
        //setting up axis
        const xAxis = d3.axisBottom(xScale).ticks(xMax/4);
        const yAxis = d3.axisLeft(yScale).ticks(yMax/4);
        const xAxisGroup = svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${h})`);
        const yAxisGroup = svg.append('g')
            .call(yAxis);
        
        // add grid lines
        xAxisGroup.selectAll('line')
            .attr('stroke', '#ddd')
            .attr('stroke-width', 0.5)
            .attr('y1', -h)
            .attr('y2', 0);
        
        //setting up axis labaling
        svg.append('text')
            .attr('x', w/2)
            .attr('y', h + 40)
            .text('Hints')
            .style('font-weight', 'bold')
            .style('text-anchor', 'middle')
            .style('fill', 'var(--text)');
        svg.append('text')
            .attr('y', -30)
            .attr('x', -h/2)
            .text('Attempts')
            .style('font-weight', 'bold')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .style('fill', 'var(--text)');

        const pointCounts = data.reduce((counts, point) => {
            const key = `${point[0]},${point[1]}`;
            counts[key] = (counts[key] || 0) + 1;
            return counts;
        }, {});
        
        //setting up svg data
        svg.selectAll()
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', d => xScale(d[0]))
                .attr('cy', d => yScale(d[1]))
                .attr('r', d => Math.sqrt(pointCounts[`${d[0]},${d[1]}`])/3.2 + 4)
                .style('fill', '#0069c0')
                .style('opacity', 0.35) // set opacity to 50%
                .append('title')  // Add a title element for each circle
                .text(d => `Hints: ${d[0]}, Attempts: ${d[1]}`);
    }, [data])
    return (
        <div className="scatter-plot">
            <h3>Exercise attempts vs hints</h3>
            <svg ref={svgRef} viewBox="0 0 600 400" width="800"></svg>
        </div>
    );
}

export default ScatterPlot;