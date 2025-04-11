import React from "react";
import './App.css';
import UserTable from "./components/UserTable";
import BarChartComponent from "./components/BarChart";
import LineChartComponent from "./components/LineGraph";

function App() {
  return (
    <div className="App">
      <div className="table">   
        <h1>Table </h1>
        <UserTable />
      </div>
      <div className="chart">
        <h1>Charts</h1>
        <BarChartComponent />
        <h1> Line Graph </h1>
        <LineChartComponent/>
      </div>  
    </div>
  )};

export default App;
