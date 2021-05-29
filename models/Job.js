const { DataTypes } = require("sequelize");
const User = require("./User");
const db = require("../config/database");

const Job = db.define("job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reward: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
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
  status: {
    type: DataTypes.ENUM,
    defaultValue: "pending",
    values: ["pending", "published", "denied"],
  },
});

User.hasMany(Job, { foreignKey: { allowNull: false } });
Job.belongsTo(User);

module.exports = Job;
