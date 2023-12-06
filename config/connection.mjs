import mysql from 'mysql';
import dbconfig from './database.mjs';

// environments: development | production
const pool = mysql.createPool({
	connectionLimit: 20,
	host: dbconfig.development.database.host,
	port: dbconfig.development.database.port,
	user: dbconfig.development.database.user,
	password: dbconfig.development.database.password
});

const db = async (query, values) => {
	return new Promise(async (resolve, reject) => {
		pool.getConnection((err, connection) => {
			connection.query(query, values, (err, rows) => {
				connection.release();
				if (!err) {
					resolve(rows)
				} else {
					console.log(err);
					reject(err);
				};
			});
		});
	});
};

export default db;