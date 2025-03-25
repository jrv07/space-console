const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to data.json
const dataFilePath = path.join(__dirname, '../data/data.json');

// Helper to read data
const getData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Query route
router.post('/query', (req, res) => {
  const { query } = req.body;
  const data = getData();
  let result = {};

  if (query.toLowerCase().includes('sales')) {
    result = { type: 'bar', data: data.sales, title: 'Sales Data' };
  } else if (query.toLowerCase().includes('users')) {
    result = { type: 'line', data: data.users, title: 'User Growth' };
  } else {
    result = { error: 'Query not recognized' };
  }

  res.json(result);
});

module.exports = router;