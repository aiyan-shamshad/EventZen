const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true // One budget per event
  },
  totalBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'budgets',
  timestamps: true
});

module.exports = Budget;
