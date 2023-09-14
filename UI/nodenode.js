var http = require('http');

var server = http.createServer(function(req, res) {
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Maze Map</title>
      <style>
        #mapContainer {
          float: left;
          width: 50%;
          height: 100vh;
          background-color: #f1f1f1;
        }
        #infoContainer {
          float: right;
          width: 50%;
          height: 100vh;
          background-color: #ffffff;
        }
        #startButton {
          position: absolute;
          bottom: 20px;
          right: 20px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div id="mapContainer"></div>
      <div id="infoContainer">
        <div id="textInfo">some text info</div>
      </div>
      <button id="startButton">Start</button>

      <script>
        // Add your JavaScript code here
      </script>
    </body>
    </html>
  `;

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(htmlContent);
});

console.log('Server is running on port 3000');
server.listen(3000, '0.0.0.0');
