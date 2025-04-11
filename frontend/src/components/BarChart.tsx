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

const BarChartComponent: React.FC = () => {
  const subreddits = useSubreddits(); 
  
  return (
    <div style={{ width: "50%", height: 400 }}>
      <h2>Total Number of Subscribers</h2> 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={subreddits.sort((a, b) => b.subscribers - a.subscribers).slice(0,5)}
          width={500}
          height={300}
          margin={{
            right: 0,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip />
          <Legend />
          <Bar dataKey="subscribers" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
   

    </div>
  );
};

export default BarChartComponent;
