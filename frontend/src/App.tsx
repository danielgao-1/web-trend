import React from "react";
import './App.css';
import UserTable from "./components/UserTable";
import BarChartComponent from "./components/BarChart";
import LineChartComponent from "./components/LineGraph";
import TreeMapComponent from "./components/TreeMap";
import RedditIcon from './svg_files/reddit-4.svg';
import menulogo from './svg_files/menu-144.svg';






function App() {
  return (
    <div className="App">
      <div className="big-bar">
        <button className="icon-button"><img src={menulogo} alt="Menu logo" width={20} height={20} /></button>
        <div>
        <span style={{color: '#4484f4'}}>R</span>  
        <span style={{color: '#f04434'}}>e</span>
        <span style={{color: '#ffbc04'}}>d</span>
        <span style={{color: '#4484f4'}}>d</span>
        <span style={{color: '#38ac54'}}>i</span>
        <span style={{color: '#f04434'}}>t{' '}</span>
        <span style={{color: '#60646c'}}>Trends</span>

        <button style={{color: '#60646c'}}>Home</button>
        <button style={{color: '#60646c'}}>Explore</button>
        <button style={{color: '#60646c'}}>Trending Now</button>
        </div>
        <button 
        style={{ marginLeft: 'auto', border: 'none' }}
        onClick={() => window.open("https://www.reddit.com", "_blank")}
        >
        <img src={RedditIcon} alt="Reddit logo" width={40} height={40}/>
        </button>
      </div>

      <div className="table-wrapper">   
    <UserTable />
  </div>
  
  <h1>Dashboard</h1>
  <div className="charts-container">
    <div className="bar-chart">
      <BarChartComponent />
    </div>
    <div className="tree-map"> 
      <TreeMapComponent/>
    </div>
    <div className="line-graph">
      <LineChartComponent/>
    </div>
  </div>
</div>
  )};

export default App;
