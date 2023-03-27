const db = require('../../config/connection');
const lib = require('jarmlib');
const bcrypt = require('bcrypt-nodejs');

const User = function (user) {
	this.id;
	this.email = user.email;
	this.business = user.business;
	this.password = user.password;
	this.name = user.name;
	this.access = '30days';
	this.balance = 0;
	this.token = "";

	this.save = () => {
		if (!this.business || this.business.length < 1 || lib.string.hasForbidden(user.business)) { return { err: "O nome da empresa é inválido!" }; }
		if (!lib.validateEmail(this.email)) { return { err: "Email inválido!" }; }

		this.password = bcrypt.hashSync(this.password, null, null);

		let obj = lib.convertTo.object(this);

		let query = lib.Query.save(obj, 'cms_cotalogo.user');
		return db(query);

		// let query = "INSERT INTO cms_cotalogo.user (name, business, email, password, access) values ('"
		// 	+ this.name + "', '"
		// 	+ this.business + "', '"
		// 	+ this.email + "', '"
		// 	+ this.password + "', '"
		// 	+ this.access + "')";
		// return db(query);
	};

	this.token = (token) => {
		let query = "UPDATE cms_cotalogo.user SET token='" + token + "' WHERE id='" + this.id + "';";
		return db(query);
	}
};

User.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.user user")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

User.findById = id => {
	let query = `SELECT * FROM cms_cotalogo.user WHERE id='${id}';`;
	return db(query);
};

User.findByToken = token => {
	let query = "SELECT id FROM cms_cotalogo.user WHERE token='" + token + "';";
	return db(query);
};

User.destroyToken = token => {
	let query = "UPDATE cms_cotalogo.user SET token='' WHERE token='" + token + "';";
	return db(query);
};

User.confirmEmail = (id) => {
	let query = "UPDATE cms_cotalogo.user SET status='Active' WHERE id='" + id + "';";
	return db(query);
};

User.findByEmail = email => {
	let query = "SELECT * FROM cms_cotalogo.user WHERE email='" + email + "';";
	return db(query);
};

User.findByBusiness = business => {
	let query = `SELECT * FROM cms_cotalogo.user WHERE business='${business}';`;
	return db(query);
};

module.exports = User;