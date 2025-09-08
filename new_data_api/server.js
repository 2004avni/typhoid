const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Replace with your actual API info
const API_URL = 'https://api.data.gov.in/resource/eaa8daa8-ddaf-4a2e-9db4-df39b6ae5c1d';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

app.use(cors());

// Route to serve JSON data at '/'
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
      },
      headers: {
        accept: 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Failed to fetch data');
  }
});

// Route to download CSV
app.get('/download-csv', async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        'api-key': API_KEY,
        format: 'json',
      },
      headers: {
        accept: 'application/json',
      },
    });

    const records = response.data.records;
    if (!records || records.length === 0) {
      return res.status(404).send('No records found to generate CSV');
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(records);

    const filename = 'data.csv';
    const filepath = path.join(__dirname, filename);

    // Write CSV file
    fs.writeFileSync(filepath, csv);

    // Send CSV file as download
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Delete file after sending
      fs.unlinkSync(filepath);
    });
  } catch (error) {
    console.error('Error generating CSV:', error.message);
    res.status(500).send('Failed to generate CSV');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
