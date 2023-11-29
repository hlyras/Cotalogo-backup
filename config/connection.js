const { Sequelize } = require('sequelize');
const dbconfig = require('./database');

const { host, port, user, password, database } = dbconfig.development.database;

const sequelize = new Sequelize(database, user, password, {
	host,
	port,
	dialect: 'mysql',
});

module.exports = sequelize;

// const mysql = require('mysql');
// const dbconfig = require('./database');

// // environments: development | production
// const pool = mysql.createPool({
// 	connectionLimit: 20,
// 	host: dbconfig.development.database.host,
// 	port: dbconfig.development.database.port,
// 	user: dbconfig.development.database.user,
// 	password: dbconfig.development.database.password
// });


// const db = async (query, values) => {
// 	return new Promise(async (resolve, reject) => {
// 		pool.getConnection((err, connection) => {
// 			connection.query(query, values, (err, rows) => {
// 				connection.release();
// 				if (!err) {
// 					resolve(rows)
// 				} else {
// 					console.log(err);
// 					reject(err);
// 				};
// 			});
// 		});
// 	});
// };

// module.exports = db;