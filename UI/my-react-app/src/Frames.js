import React, { useEffect, useState } from "react";

const Frames = () => {
  const [frameCoords, setFrameCoords] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://192.168.0.159:3100/frames")
        .then((res) => res.json())
        .then((data) => {
          const formattedData = data.map((frame) => ({
            color: frame.BeaconColour,
            topX: parseInt(frame.TopXaxis),
            topY: parseInt(frame.TopYaxis),
            bottomX: parseInt(frame.BottomXaxis),
            bottomY: parseInt(frame.BottomYaxis),
          }));
          setFrameCoords(formattedData);
          console.log(formattedData); // Print the formatted data to the console
        })
        .catch((err) => console.log(err));
    };

    const intervalId = setInterval(fetchData, 50); // Fetch data every 0.2 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, []);

  const frameStyle = {
    position: "absolute",
    border: "2px solid",
    borderRadius: "5px",
  };

  const squareStyle = {
    position: "relative",
    width: "440px",
    height: "330px",
    margin: "40px",
    border: "2px solid black",
  };

  return (
    <div style={squareStyle}>
      {frameCoords.map((frame, index) => {
        const frameWidth = Math.abs(frame.bottomX - frame.topX);
        const frameHeight = Math.abs(frame.bottomY - frame.topY);
  
        // Check if the frame dimensions are equal to the specified values
        if (frameWidth === 440 && frameHeight === 330) {
          return null; // Do not render the frame
        }
  
        return (
          <div
            key={index}
            style={{
              ...frameStyle,
              top: `${frame.bottomY}px`,
              left: `${frame.bottomX}px`,
              width: `${frameWidth}px`,
              height: `${frameHeight}px`,
              borderColor: frame.color,
            }}
          ></div>
        );
      })}
    </div>
  );  
};

export default Frames;

