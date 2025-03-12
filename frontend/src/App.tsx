import React from "react";
import UserTable from "./components/UserTable"; // Import the UserTable component
import "./App.css"; // Import global styles

function App() {
  return (
    <div className="App">
      <h1>Reddit Subreddit Table</h1>
      <UserTable />
    </div>
  );
}

export default App;
