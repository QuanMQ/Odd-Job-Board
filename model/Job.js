const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Job = db.define("job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reward: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Job;
