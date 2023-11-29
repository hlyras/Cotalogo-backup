const { DataTypes, Op } = require('sequelize');
const sequelize = require('../../config/connection');
const lib = require('jarmlib');

const User = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	business: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: DataTypes.STRING,
	access: DataTypes.STRING,
	balance: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 0.00
	},
	token: DataTypes.STRING,
}, {
	tableName: 'user',
	timestamps: false,
});

User.filter = async function (props, inners, conditions, order) {
	console.log('props:', props, 'inners:', inners, 'conditions:', conditions, 'order:', order);
	let query = lib.Select({ props, inners, conditions, order }, Op);
	return await User.findAll({ raw: true, query }); s
};

setTimeout(async () => {
	let conditions = [];
	lib.Query.fill({ field: 'id', operator: 'in', value: [1, 2], Op }, conditions);
	// lib.Query.fill({ field: 'name', operator: 'like', value: 'John' }, conditions);
	// lib.Query.fill({ field: 'age', operator: 'strict', value: 25 }, conditions);
	// lib.Query.fill({ field: 'birth', operator: 'between', value: [1980, 2000] }, conditions);
	// lib.Query.fill({ field: 'height', operator: 'greater', value: 170 }, conditions);

	let users = await User.filter([], [], conditions, []);
	console.log(users);
}, 1000);

module.exports = User;

// const db = require('../../config/connection');
// const lib = require('jarmlib');
// const bcrypt = require('bcrypt-nodejs');

// const User = function (user) {
// 	this.id;
// 	this.email = user.email;
// 	this.business = user.business;
// 	this.password = user.password;
// 	this.name = user.name;
// 	this.access = '30days';
// 	this.balance = 0;
// 	this.token = "";

// 	this.save = () => {
// 		if (!this.business || this.business.length < 1 || lib.string.hasForbidden(user.business)) { return { err: "O nome da empresa é inválido!" }; }
// 		if (!lib.validateEmail(this.email)) { return { err: "Email inválido!" }; }
// 		if (!this.password) { return { err: "Senha inválida!" }; }
// 		if (this.password.length < 8) { return { err: "A senha deve conter mais de 8 caracteres." }; }

// 		this.password = bcrypt.hashSync(this.password, null, null);

// 		let obj = lib.convertTo.object(this);
// 		let { query, values } = lib.Query.save(obj, 'cms_cotalogo.user');

// 		return db(query, values);
// 	};

// 	this.token = (token) => {
// 		let query = `UPDATE cms_cotalogo.user SET token = ? WHERE id = ?;`;
// 		return db(query, [token, this.id]);
// 	}
// };

// User.filter = (props, inners, params, strict_params, order_params) => {
// 	let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.user user")
// 		.inners(inners).params(params).strictParams(strict_params).order(order_params).build();
// 	return db(query, values);
// };

// User.findById = id => {
// 	let query = `SELECT * FROM cms_cotalogo.user WHERE id = ?;`;
// 	return db(query, [id]);
// };

// User.findByToken = token => {
// 	let query = `SELECT id FROM cms_cotalogo.user WHERE token = ?;`;
// 	return db(query, [token]);
// };

// User.destroyToken = token => {
// 	let query = `UPDATE cms_cotalogo.user SET token = ? WHERE token = ?;`;
// 	return db(query, [null, token]);
// };

// User.confirmEmail = (id) => {
// 	let query = `UPDATE cms_cotalogo.user SET status = ? WHERE id = ?;`;
// 	return db(query, ['Active', id]);
// };

// User.findByEmail = email => {
// 	let query = `SELECT * FROM cms_cotalogo.user WHERE email = ?;`;
// 	return db(query, [email]);
// };

// User.findByBusiness = business => {
// 	let query = `SELECT * FROM cms_cotalogo.user WHERE business = ?`;
// 	return db(query, [business]);
// };

// module.exports = User;


// setTimeout(async () => {
// let props = ['id', 'business', 'email'];
// let inners = [];
// inners = [{ model: Profile, required: true, where: { status: 'active' } }], //true inner || false left

// let conditions = [];

// lib.Query.fill({ field: 'id', strict: 3 }, conditions);
// lib.Query.fill({ field: 'email', like: 'ufc' }, conditions);
// lib.Query.fill({ field: 'id', greater: 1 }, conditions);
// lib.Query.fill({ field: 'id', less: 5 }, conditions);
// lib.Query.fill({ field: 'id', between: [1, 5] }, conditions);

// console.log(conditions);

// const query = lib.Select({
// 	props,
// 	inners,
// 	conditions,
// 	order: [['id', 'DESC']],
// 	limit: 10,
// }, Op);

// const users = await User.findAll(query);

// users.forEach(user => {
// 	console.log(user);
// });

// const params = {
// 	business: { value: 'ufc', comparisonType: 'strict' },
// 	id: { value: [1, 10], comparisonType: 'between' },
// };

// const props = ['id', 'business', 'email'];

// const inners = [
// 	{ model: Address, required: true },
// 	{ model: Order, required: false },
// ];

// const orderBy = ['name', 'ASC'];
// const limit = 10;
// const users = await genericSearchAdvanced(params, props, [], orderBy, limit);
// }, 500);