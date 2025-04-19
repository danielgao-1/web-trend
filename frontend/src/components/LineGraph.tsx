import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
import useSubreddits from "./UseSubreddits";
import "./styles.css";


const LineChartComponent = () => {
  const subreddits = useSubreddits(); 
  return (
   
    <div style={{ width: '100%', height: '500px' }}>
       <h2>Total Comments Per 100 Post</h2>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={subreddits}
      >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis 
        dataKey="name"
       />
      <YAxis/>
      <Tooltip />
      <Legend/>
      <Line 
        dataKey="total_comments"
        name="Total Comments"/>
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
};

export default LineChartComponent;
  