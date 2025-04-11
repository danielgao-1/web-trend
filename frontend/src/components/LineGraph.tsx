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
    <ResponsiveContainer width="50%" height="50%">
      <LineChart
        width={500}
        height={300}
        data={subreddits.sort((a, b) => b.subscribers - a.subscribers).slice(0,5)}
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
  )
};

export default LineChartComponent;
  