import React from "react";
import './App.css';
import UserTable from "./components/UserTable";
import BarChart from "./components/BarChart";

function App() {
  return (
    <div className="App">
       <section>
          <h1>Table </h1>
          <UserTable />
          </section>
        <section>
          <h1>Charts</h1>
          <BarChart />
        </section>
    </div>
  )};

export default App;
