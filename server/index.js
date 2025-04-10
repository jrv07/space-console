require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', authRoutes);
app.use('/api', queryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});