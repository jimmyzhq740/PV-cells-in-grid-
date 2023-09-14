const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({
  origin: '*'
}));

app.use(cors({
  method: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH']
}));

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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
