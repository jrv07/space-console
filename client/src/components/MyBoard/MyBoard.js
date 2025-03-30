import React from 'react';
import { useSelector } from 'react-redux';
import Visualization from '../Visualization/Visualization';
import './MyBoard.css';

const MyBoard = () => {
  const pinnedCharts = useSelector(state => state.data.pinnedCharts);

  return (
    <div className="my-board">
      <h2>My Board</h2>
      {pinnedCharts.length > 0 ? (
        <div className="pinned-charts">
          {pinnedCharts.map((chart, index) => (
            <Visualization
              key={index}
              data={chart.data}
              type={chart.type}
              title={chart.title}
            />
          ))}
        </div>
      ) : (
        <p>No charts pinned yet. Pin some from the Search page!</p>
      )}
    </div>
  );
};

export default MyBoard;