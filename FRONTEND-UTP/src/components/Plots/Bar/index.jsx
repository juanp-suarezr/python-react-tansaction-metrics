import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, selectedAccount }) => {
    const svgRef = useRef();

    useEffect(() => {
        // Configuración del gráfico
        const margin = { top: 20, right: 30, bottom: 50, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        // Seleccionar y limpiar el contenedor SVG
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Limpiar el contenido anterior

        // Crear el contenedor g
        const g = svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Escalas
        const x = d3.scaleBand()
            .domain(data.map(d => d.type))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.average_monthly_amount)])
            .nice()
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Ejes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

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

        // Añadir las barras
        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.type))
            .attr('y', d => y(d.average_monthly_amount))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.average_monthly_amount))
            .attr('fill', d => color(d.type));

        // Añadir la leyenda
        const legend = g.selectAll('.legend')
            .data(data)
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0,${i * 20})`);

        legend.append('rect')
            .attr('x', width + 20)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', d => color(d.type));

        legend.append('text')
            .attr('x', width + 45)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('font-size', '14px')
            .style('fill', 'white')
            .style('text-anchor', 'start')
            .text(d => d.type);

        // Añadir el texto del account seleccionado
        g.append('text')
            .attr('x', 0)
            .attr('y', -10)
            .attr('dy', '.35em')
            .style('font-size', '16px')
            .style('fill', 'black')
            .style('font-weight', 'bold')
            .text(`Account: ${selectedAccount || 'All'}`);
    }, [data, selectedAccount]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default BarChart;
