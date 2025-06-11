const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // update path if needed

const Integration = sequelize.define('Integration', {
  name: { type: DataTypes.STRING, allowNull: false },
  api_key: { type: DataTypes.STRING, allowNull: false },
  base_url: { type: DataTypes.STRING, allowNull: false },
  usage_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true,
  tableName: 'integrations',
});

module.exports = Integration;
