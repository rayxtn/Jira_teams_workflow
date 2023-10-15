import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const StatisticsComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from your database or API here
    // Example: Fetch a list of items
    fetch('http://localhost:8080/api/weekissues')
      .then(response => response.json())
      .then(data => {
        setData(data);
        drawDonutChart(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const drawDonutChart = (data) => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#donut-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.value);

    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arc = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc.append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.label));

    const label = d3.arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    arc.append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.label);
  };

  return (
    <div>
      <h2>Statistics</h2>
      <div id="donut-chart"></div>
    </div>
  );
};

export default StatisticsComponent;
