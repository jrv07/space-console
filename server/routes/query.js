const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data/data.json');

const getData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

router.post('/query', (req, res) => {
  const { query } = req.body;
  const data = getData();
  const queryParts = query.toLowerCase()
    .split(/and|,/)
    .map(part => part.trim())
    .filter(part => part);

  const results = [];

  queryParts.forEach(q => {
    if (q.includes('sales')) {
      results.push({
        type: 'bar',
        data: data.sales,
        title: 'Monthly Sales Data',
        text: '', // Default empty
        sql: 'SELECT month, sales AS value FROM sales_data',
      });
    } else if (q.includes('users')) {
      results.push({
        type: 'line',
        data: data.users,
        title: 'User Growth Over Time',
        text: '',
        sql: 'SELECT month, users AS value FROM user_data',
      });
    } else if (q.includes('products')) {
      results.push({
        type: 'pie',
        data: data.products,
        title: 'Product Category Distribution',
        text: '',
        sql: 'SELECT category AS name, stock AS value FROM products',
      });
    } else if (q.includes('engagement')) {
      results.push({
        type: 'scatter',
        data: data.engagement,
        title: 'User Engagement (Likes vs Comments)',
        text: '',
        sql: 'SELECT likes, comments FROM engagement_data',
      });
    } else if (q.includes('performance')) {
      results.push({
        type: 'composed',
        data: data.performance,
        title: 'Revenue and Cost Performance',
        text: '',
        sql: 'SELECT month, revenue, cost FROM performance_data',
      });
    }
  });

  if (results.length > 0) {
    res.json(results);
  } else {
    res.json({ error: 'No recognized queries found' });
  }
});

module.exports = router;