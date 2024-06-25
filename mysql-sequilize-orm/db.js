const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodewmysql", "root", "12345", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
