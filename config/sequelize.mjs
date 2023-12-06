import Sequelize from 'sequelize';
import dbconfig from './database.mjs';

const { host, port, user, password, database } = dbconfig.development.database;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
  logging: false,
});

export default sequelize;