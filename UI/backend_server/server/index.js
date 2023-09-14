const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mysql = require('mysql');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');


const app = express();
const PORT1 = process.env.PORT || 3100;
const PORT2 = process.env.PORT || 3001;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const server2 = http.createServer(app);
const wss2 = new WebSocket.Server({ server: server2 });


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH']
}));

const con = mysql.createConnection({
  host: "3.95.210.12",
  user: "ethanchen",
  password: "cyx",
  database: "Persondb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Successfully connected to the database...\n");

  app.get("/run-python", (req, res) => {
    // Run the Python script as a child process
    const pythonProcess = spawn('/usr/bin/python3', ['server/ReadFromFile.py']);
  
    // Capture output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python script output:\n${data}`);
    });
  
    // Capture error output, if any
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error executing Python script:\n${data}`);
    });
  
    // Handle Python script exit
    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
    });
  
    res.sendStatus(200);
  });

  app.get("/personquery", (req, res) => {
    con.query("SELECT * FROM Power", function(err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });

  app.get("/matrix", (req, res) => {
    const filePath = path.join(__dirname, "matrix.txt");
  
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading matrix file:", err);
        return res.status(500).json({ error: "Failed to read matrix file" });
      }
  
      const matrix = JSON.parse(data);
      res.json({ matrix });
    });
  });

   app.use(express.json()); // Add this line to enable JSON parsing

   app.post("/update", (req, res) => {
    const { Colour, Vin, Vout, Iout, Duty } = req.body;
  
    console.log("Data received from client:");
    console.log("Colour:", Colour);
    console.log("Vin:", Vin);
    console.log("Vout:", Vout);
    console.log("Iout:", Iout);
    console.log("Duty:", Duty);
  
    // Update the database
    const sql = `UPDATE Power SET Vin = ?, Vout = ?, Iout = ?, Duty = ? WHERE Colour = ?`;
    const values = [Vin, Vout, Iout, Duty, Colour];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating database:", err);
        res.status(500).json({ error: "Failed to update database" });
      } else {
        console.log("Database updated successfully");
        res.sendStatus(200);
      }
    });
  });
  
  app.use(express.json()); // Add this line to enable JSON parsing
  app.post("/update-coordinates", (req, res) => {
    const { BeaconColour, TopXaxis, TopYaxis, BottomXaxis, BottomYaxis } = req.body;
    console.log(req.body);
  
    // Update the database
    const sql = `UPDATE BeaconCoordinates SET TopXaxis = ?, TopYaxis = ?, BottomXaxis = ?, BottomYaxis = ? WHERE BeaconColour = ?`;
    const values = [TopXaxis, TopYaxis, BottomXaxis, BottomYaxis, BeaconColour];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to update frame data" });
      } else {
        res.sendStatus(200);
      }
    });
  });

  wss.on("connection", (ws) => {
    // console.log("Client connected");
    ws.on("message", (message) => {
      // console.log("Message received from client:");
      try {
        const data = JSON.parse(message);
        const { BeaconColour, TopXaxis, TopYaxis, BottomXaxis, BottomYaxis } = data;
        // console.log(data);
  
        // Update the database
        const sql = `UPDATE BeaconCoordinates SET TopXaxis = ?, TopYaxis = ?, BottomXaxis = ?, BottomYaxis = ? WHERE BeaconColour = ?`;
        const values = [TopXaxis, TopYaxis, BottomXaxis, BottomYaxis, BeaconColour];
  
        con.query(sql, values, (err, result) => {
          if (err) {
            // Handle database update error
            console.error(err);
          } else {
            // Database update successful
            // console.log("Database updated successfully");
          }
        });
      } catch (error) {
        // Handle JSON parsing error
        console.error(error);
      }
    });
  });
  
  wss2.on("connection", (ws) => {
    // console.log("Client connected");
    ws.on("message", (message) => {
      // console.log("Message received from client:");
      try {
        const data = JSON.parse(message);
        const { ID, Dif1, Dif2 } = data;
        console.log(data);
        // console.log(data);
  
        // Update the database
        const sql = `UPDATE Angle SET Dif1 = ?, Dif2 = ? WHERE ID = ?`;
        const values = [Dif1, Dif2, ID];
  
        con.query(sql, values, (err, result) => {
          if (err) {
            // Handle database update error
            console.error(err);
          } else {
            // Database update successful
            console.log("Database updated successfully");
          }
        });
      } catch (error) {
        // Handle JSON parsing error
        console.error(error);
      }
    });
  });

  app.post("/angle", (req, res) => {
    // Extract data from the request body
    console.log("Data received from client:");
    const {ID, Dif1, Dif2} = req.body;
    console.log(req.body);
  
    const sql = `UPDATE Position SET Xaxis = ?, Yaxis = ? WHERE ID = ?`;
    const values = [Dif1, Dif2, ID];
  
    con.query(sql, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Failed to update frame data" });
      } else {
        res.sendStatus(200);
      }
    });
  });


  app.get("/frames", (req, res) => {
    con.query("SELECT * FROM BeaconCoordinates", function(err, result, fields) {
      if (err) throw err;
      res.json(result);
    });
  });

  server2.listen(3300, () => {
    console.log(`Server is running on port 3300`);
  });

  server.listen(3200, () => {
    console.log(`Server is running on port 3200`);
  });

  app.listen(PORT1, () => {
    console.log(`Server is running on port ${PORT1}`);
  });

  app.listen(PORT2, () => {
    console.log(`Server is running on port ${PORT2}`);
  });
});