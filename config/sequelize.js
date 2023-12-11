const { Sequelize } = require('sequelize');
const dbconfig = require('./database');

const { host, port, user, password, database } = dbconfig.development.database;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
});

module.exports = sequelize;