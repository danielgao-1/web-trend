import React from "react";
import './App.css';
import UserTable from "./components/UserTable";
import BarChartComponent from "./components/BarChart";
import LineChartComponent from "./components/LineGraph";

function App() {
  return (
    <div className="App">
      <h1>Heading Placement </h1>
      <div className="table-wrapper">   
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
