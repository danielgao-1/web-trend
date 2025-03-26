import React from "react";
import './App.css';
import UserTable from "./components/UserTable";
import BarChart from "./components/BarChart";

function App() {
  return (
    <div className="App">
      <div className="table">   
        <h1>Table </h1>
        <UserTable />
      </div>
      <div className="chart">
        <h1>Charts</h1>
        <BarChart />
      </div>  
    </div>
  )};

export default App;
