const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attendee = sequelize.define('Attendee', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('REGISTERED', 'ATTENDED', 'CANCELLED'),
    defaultValue: 'REGISTERED'
  }
}, {
  tableName: 'attendees',
  timestamps: true
});

module.exports = Attendee;
