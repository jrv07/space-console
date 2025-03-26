import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './Visualization.css';

const Visualization = ({ data, type, title }) => {
  if (!data) return null;

  return (
    <div className="visualization">
      <h2>{title}</h2>
      {type === 'bar' && (
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      )}
      {type === 'line' && (
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      )}
    </div>
  );
};

export default Visualization;