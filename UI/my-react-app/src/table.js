import React, { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 200); // Refresh data every 0.5 seconds

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const fetchData = () => {
    fetch("http://192.168.0.159:3100/personquery/")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="Table">
      <h2 className="table-header">Beacon Power Data:</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Colour</th>
            <th>Vin</th>
            <th>Vout</th>
            <th>Iout</th>
            <th>&delta;</th>
          </tr>
        </thead>
        <tbody>
          {data.map((Power) => (
            <tr key={Power.Colour}>
              <td>{Power.Colour}</td>
              <td>{Power.Vin}</td>
              <td>{Power.Vout}</td>
              <td>{Power.Iout}</td>
              <td>{Power.Duty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

