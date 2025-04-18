import React from "react"
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
    <div style={{ width: "50%", height: 400 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={subreddits}
        margin={{
          right: 30,
        }}
      >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="name"/>
      <YAxis/>
      <Tooltip />
      <Legend />
      <Line dataKey="total_comments"/>
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
};

export default LineChartComponent;
  