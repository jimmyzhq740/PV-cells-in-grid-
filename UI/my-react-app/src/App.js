import React, { useState } from "react";
import "./App.css";
import MatrixComponent from "./MatrixViewer";
import Table from "./table";
import Frames from "./Frames";

const App = () => {
  const [startUpdating, setStartUpdating] = useState(false);

  const handleStartClick = () => {
    setStartUpdating(true);
  };

  return (
    <div className="App">
      <h1>Route App</h1>
      <div className="app-container">
        <div className="matrix-container">
          <MatrixComponent startUpdating={startUpdating} />
          {!startUpdating && (
            <button className="start-button" onClick={handleStartClick}>
              Start
            </button>
          )}
        </div>
        <div className="table-container">
          <Table />
        </div>
      </div>
      {startUpdating && (
        <div className="frames-container">
          <Frames />
        </div>
      )}
    </div>
  );
};

export default App;
