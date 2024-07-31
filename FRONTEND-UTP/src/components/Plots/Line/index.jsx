import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const LineChart = ({ data, selectedAccount }) => {
    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 40, right: 20, bottom: 50, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        // Selecciona el SVG y limpia el contenido anterior
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Crear un grupo contenedor para el gráfico
        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);


        const parseDate = d3.timeParse('%Y-%m-%d');
        data.forEach(d => {
        d.date = parseDate(d.date);
        });

        const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total_amount)])
        .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Ejes
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m-%d')).tickSize(-height);
        const yAxis = d3.axisLeft(y).tickSize(-width);

        g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');

        g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

        const types = d3.group(data, d => d.type);

        const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.total_amount))
        .curve(d3.curveBasis);

        types.forEach((values, key) => {
        g.append('path')
            .datum(values)
            .attr('fill', 'none')
            .attr('stroke', color(key))
            .attr('stroke-width', 1.5)
            .attr('d', line);
        });


        // Crear un grupo contenedor para la leyenda
        const legendContainer = g.append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${width - 180},0)`);

        // Añadir un fondo de color a la leyenda
        const legendBackground = legendContainer.append('rect')
            .attr('width', 200)
            .attr('height', types.size * 20 + 10) // Ajustar altura según el número de elementos en la leyenda
            .attr('x', -20)
            .attr('y', -5)
            .style('fill', '#f8f8f8') // Color de fondo de la leyenda
            .style('stroke', '#ccc'); // Borde opcional

        const legend = legendContainer.selectAll('.legend')
            .data(types.keys())
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0,${i * 20})`);

        legend.append('rect')
            .attr('x', 0)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);

        legend.append('text')
            .attr('x', 25)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('font-size', '14px')
            .style('fill', 'black')
            .style('text-anchor', 'start')
            .text(d => d);

        // Añadir el nombre de la cuenta seleccionada
        g.append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('dy', '.35em')
            .style('font-size', '16px')
            .style('fill', 'black')
            .style('text-anchor', 'start')
            .text(`Account: ${selectedAccount || 'All'}`);
    }, [data, selectedAccount]);

    

    return (
        <svg ref={svgRef}></svg>
    )
};

export default LineChart;
