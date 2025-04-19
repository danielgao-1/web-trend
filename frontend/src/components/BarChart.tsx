import React from "react";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis,  
  YAxis,
  CartesianGrid,
  Tooltip, 
  Legend,
} from "recharts";
import useSubreddits from "./UseSubreddits";
import "./styles.css";

// typing for data
interface Subreddit {
  name: string;
  subscribers: number;

}

const BarChartComponent: React.FC = () => {
  const subreddits = useSubreddits(); 
  
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h2>Subscribers Per Subreddit</h2> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={subreddits.sort((a: Subreddit, b: Subreddit) => b.subscribers - a.subscribers)}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name"/>
          <YAxis 
            tickFormatter={(value: number) => `${(value / 1000000).toFixed(1)}M`}
            tickCount={5}
            width={80} 
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="subscribers" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;