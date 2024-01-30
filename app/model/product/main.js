const db = require('../../../config/connection');
const lib = require('jarmlib');

const Product = function (product) {
	this.id;
	this.user_id;
	this.code;
	this.name;
	this.description;

	this.create = () => {
		if (!this.code) { return { err: "Código inválido" }; }
		if (!this.name || this.name.length < 2 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.save(obj, 'cms_cotalogo.product');

		return db(query, values);
	};

	this.update = () => {
		if (!this.id) { return { err: "O id do produto é inválido" }; }
		if (!this.code) { return { err: "Código inválido" }; }
		if (!this.name || this.name.length < 2 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.update(obj, 'cms_cotalogo.product', 'id');

		return db(query, values);
	};
};

Product.findById = async (id) => {
	let query = `SELECT * FROM cms_cotalogo.product WHERE id = ?;`;
	return db(query, [id]);
};

Product.filter = ({ props, inners, params, strict_params, order_params }) => {
	let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.product product")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build();
	return db(query, values);
};

module.exports = Product;