const express = require("express");
const cors = require("cors");
const axios = require("axios");  // Importing Axios

const app = express();
const PORT = process.env.PORT || 3000; // Correct variable name

// Enable CORS for frontend connections
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON requests

// ✅ CORS Headers Middleware (For Cross-Origin Requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Endpoint to handle verification
app.post('/verify', async (req, res) => {
  const { data } = req.body; // Extract the verification data from the request body
  
  // Log the received data
  console.log("Received data:", data);

  try {
    // Call Google Apps Script with the provided data
    const response = await axios.post('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
      data: data // Send the data to Google Apps Script
    });

    // If Google Apps Script returns status "Verified"
    if (response.data.status === 'Verified') {
      res.json({ status: 'Verified' }); // Return verification success
    } else {
      res.status(400).json({ status: 'Failed', message: 'Verification failed.' });
    }
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ status: 'Error', message: 'Internal server error' });
  }
});

// Start the Express server
app.listen(PORT, () => {  // Use the correct variable `PORT`
  console.log(`Server is running on port ${PORT}`);
});
