import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, Tooltip, CartesianGrid,
  ScatterChart, Scatter, ComposedChart, Area, Cell
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { pinChart, unpinChart } from '../../redux/store';
import { FaThumbtack } from 'react-icons/fa';
import './Visualization.css';

const Visualization = ({ data, type, title }) => {
  const dispatch = useDispatch();
  const pinnedCharts = useSelector(state => state.data.pinnedCharts);
  const isPinned = pinnedCharts.some(chart => chart.title === title);

  if (!data) return null;

  const COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ffbb28', '#ff8042'];

  const handlePinToggle = () => {
    if (isPinned) {
      dispatch(unpinChart(title));
    } else {
      dispatch(pinChart({ data, type, title }));
    }
  };

  return (
    <div className="visualization">
      <div className="visualization-header">
        <h2>{title}</h2>
        <button
          className={`pin-btn ${isPinned ? 'pinned' : ''}`}
          onClick={handlePinToggle}
          title={isPinned ? 'Unpin Chart' : 'Pin Chart'}
        >
          <FaThumbtack />
        </button>
      </div>
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
      {type === 'pie' && (
        <PieChart width={600} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}
      {type === 'scatter' && (
        <ScatterChart width={600} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="likes" name="Likes" unit="" />
          <YAxis dataKey="comments" name="Comments" unit="" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Engagement" data={data} fill="#8884d8" />
        </ScatterChart>
      )}
      {type === 'composed' && (
        <ComposedChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8" />
          <Line type="monotone" dataKey="cost" stroke="#ff7300" />
        </ComposedChart>
      )}
    </div>
  );
};

export default Visualization;