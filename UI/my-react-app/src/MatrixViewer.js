import React, { useEffect, useState } from "react";

const MatrixComponent = ({ startUpdating }) => {
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    if (startUpdating) {
      fetchMatrix();
      const intervalId = setInterval(fetchMatrix, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startUpdating]);

  const fetchMatrix = async () => {
    try {
      const response = await fetch("http://192.168.0.159:3001/matrix");
      const data = await response.json();
      setMatrix(data.matrix);
    } catch (error) {
      console.error("Error fetching matrix:", error);
    }
  };

  const handleMove = (direction) => {
    console.log("Moving", direction);
    // Add your logic for handling movement here
  };

  const matrixContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px",
    marginLeft: "120px",
  };

  const matrixRowStyle = {
    display: "flex",
    marginBottom: "2px", // Add spacing between neighboring rows
  };

  const matrixCellStyle = (value) => {
    let backgroundColor;
    if (value === 0) {
      backgroundColor = "white";
    } else if (value === 1) {
      backgroundColor = "black";
    } else if (value === 2) {
      backgroundColor = "blue";
    }
    const borderColor = "red"; // Change the color of the cell lines
    return {
      width: "8px",
      height: "8px",
      backgroundColor,
      border: `1px solid ${borderColor}`,
      marginRight: "2px", // Add spacing between neighboring cells
    };
  };

  return (
    <div>
      <h2 className="matrix-header">Matrix Viewer</h2>
      <div style={matrixContainerStyle}>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={matrixRowStyle}>
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                style={matrixCellStyle(value)}
              ></div>
            ))}
          </div>
        ))}
        {startUpdating && (
          <div className="movement-buttons">
            <button onClick={() => handleMove("left")}>Left</button>
            <button onClick={() => handleMove("right")}>Right</button>
            <button onClick={() => handleMove("front")}>Front</button>
            <button onClick={() => handleMove("back")}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrixComponent;
