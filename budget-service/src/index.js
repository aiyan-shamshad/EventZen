require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, createDb } = require('./config/database');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Gateway routes /api/budget/** here
app.use('/api/budget', budgetRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

const startServer = async () => {
  try {
    await createDb(); // Create eventzen_budget if it doesn't exist
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // sync creates tables based on models Budget and Expense
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Budget Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
