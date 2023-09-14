const { spawn } = require('child_process');

// Run the Python script as a child process
const pythonProcess = spawn('python', ['test.py']);

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
