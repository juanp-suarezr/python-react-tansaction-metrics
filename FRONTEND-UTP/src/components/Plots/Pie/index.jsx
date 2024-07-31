import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, selectedAccount }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Limpiar el gráfico anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Configuración del gráfico
    const width = 400;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Crear el contenedor SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Crear los colores
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.type))
      .range(d3.schemeCategory10);

    // Crear el generador de gráficos de pastel
    const pie = d3.pie()
      .value(d => d.total_amount);

    // Crear los arcos
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Crear las secciones del pastel
    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    // Añadir la leyenda
    const legend = svg.selectAll('.legend')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(-160,${i * 20 - height / 2})`);

    legend.append('rect')
      .attr('x', width / 2)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d => color(d.type));

    legend.append('text')
      .attr('x', width / 2 + 25)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('font-size', '14px')
      .style('fill', 'black')
      .style('text-anchor', 'start')
      .text(d => `${d.type} (${d.percentage}%)`);

    // Añadir el texto del account seleccionado
    svg.append('text')
      .attr('x', -100)
      .attr('y', -height / 2 + 20)
      .attr('dy', '.35em')
      .style('font-size', '16px')
      .style('fill', 'black')
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .text(`Account: ${selectedAccount || 'All'}`);
      
  }, [data, selectedAccount]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default PieChart;
