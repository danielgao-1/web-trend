import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import useSubreddits from './useSubreddits';
import './styles.css';

// Custom Tooltip for Treemap
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, subscribers } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="label" style={{ fontWeight: "bold", marginBottom: "4px" }}>
          {name}
        </p>
        <p>{`Subscribers: ${subscribers.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const TreeMapComponent = () => {
  const subreddits = useSubreddits();

  return (
    <div style={{ width: '100%', height: '450px' }}>
      <h2>Subscriber Treemap</h2>
      <ResponsiveContainer>
        <Treemap
          data={subreddits}
          dataKey="subscribers"
          nameKey="name"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default TreeMapComponent;
