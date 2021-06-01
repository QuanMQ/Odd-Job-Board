const { DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define("user", {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM,
    defaultValue: "User",
    values: ["User", "Admin", "Moderator"],
  },
});

module.exports = User;
