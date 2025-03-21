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
import useSubreddits from "./useSubreddits"; // hook for data
import "./styles.css";

const Example: React.FC = () => {
  const subreddits = useSubreddits(); 
  // .sort((a, b) = b.subscribers - a.subscribers) 
  // .slice(0, 10); 
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Bar Chart</h2> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={subreddits}
          width={500}
          height={300}
          margin={{
            right: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="subscribers" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Example;
