const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Budget = require('./Budget');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  budgetId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('VENUE', 'CATERING', 'MARKETING', 'STAFF', 'OTHER'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

// Relationships
Budget.hasMany(Expense, { foreignKey: 'budgetId' });
Expense.belongsTo(Budget, { foreignKey: 'budgetId' });

module.exports = Expense;
