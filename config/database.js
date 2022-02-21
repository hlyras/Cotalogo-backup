module.exports = {
	development: {
	    url: '127.0.0.1:3001',
	    database: {
		    host: process.env.DB_DEVELOPMENT_HOST,
	        port: process.env.DB_DEVELOPMENT_PORT,
	        db: process.env.DB_DEVELOPMENT_DATABASE,
	        user: process.env.DB_DEVELOPMENT_USER,
	        password: process.env.DB_DEVELOPMENT_PASSWORD
	    },
	    server: {
	        host: process.env.DB_DEVELOPMENT_HOST,
	        port: process.env.DB_DEVELOPMENT_PORT
	    }
	},
	production: {
	    url: 'http://erpjariomilitar.com',
	    database: {
		    host: process.env.DB_PRODUCTION_HOST,
	        port: process.env.DB_PRODUCTION_PORT,
	        db: process.env.DB_PRODUCTION_DATABASE,
	        user: process.env.DB_PRODUCTION_USER,
	        password: process.env.DB_PRODUCTION_PASSWORD
	    },
	    server: {
	        host: process.env.DB_PRODUCTION_HOST,
	        port: process.env.DB_PRODUCTION_PORT
	    }
	}
};