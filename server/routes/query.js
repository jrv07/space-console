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
  const queryParts = query.toLowerCase()
    .split(/and|,/) // Split by "and" or commas
    .map(part => part.trim())
    .filter(part => part); // Remove empty parts

  const results = [];

  queryParts.forEach(q => {
    if (q.includes('sales')) {
      results.push({ type: 'bar', data: data.sales, title: 'Monthly Sales Data' });
    } else if (q.includes('users')) {
      results.push({ type: 'line', data: data.users, title: 'User Growth Over Time' });
    } else if (q.includes('products')) {
      results.push({ type: 'pie', data: data.products, title: 'Product Category Distribution' });
    } else if (q.includes('engagement')) {
      results.push({ type: 'scatter', data: data.engagement, title: 'User Engagement (Likes vs Comments)' });
    } else if (q.includes('performance')) {
      results.push({ type: 'composed', data: data.performance, title: 'Revenue and Cost Performance' });
    }
  });

  if (results.length > 0) {
    res.json(results); // Return array of results
  } else {
    res.json({ error: 'No recognized queries found' });
  }
});

module.exports = router;