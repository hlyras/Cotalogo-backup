const db = require('../../../config/connection');
const lib = require('jarmlib');

const Product = function (product) {
	this.id = 0;
	this.user_id = 0;
	this.reference_id = 0;
	this.code = "";
	this.name = "";
	this.description = "";

	this.save = () => {
		if (!this.code) { return { err: "Código inválido" }; }
		if (!this.name || this.name.length < 2 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);

		let query = lib.Query.save(obj, 'cms_cotalogo.product');
		return db(query);
	};

	this.update = () => {
		if (!this.id) { return { err: "O id do produto é inválido" }; }
		if (!this.code) { return { err: "Código inválido" }; }
		if (!this.name || this.name.length < 2 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.update(obj, 'cms_cotalogo.product', 'id');

		return db(query);
	};
};

Product.findById = async (id) => {
	let query = "SELECT * FROM cms_cotalogo.product WHERE id='" + id + "';";
	return db(query);
};

Product.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.product product")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

Product.variation = function (variation) {
	this.id;
	this.user_id = variation.user_id;
	this.product_id = variation.product_id;
	this.variation_id = variation.variation_id;

	this.save = () => {
		let obj = lib.convertTo.object(this);
		let query = lib.Query.save(obj, 'cms_cotalogo.product_variation');
		return db(query);
	}
};

Product.variation.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.product_variation product_variation")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

Product.variation.delete = (variation_id, product_id) => {
	let query = `DELETE FROM cms_cotalogo.product_variation WHERE variation_id='${variation_id}' AND product_id='${product_id}';`;
	return db(query);
};

// Product.variation.deleteByCategoryId = async (category_id) => {
// 	let query = `DELETE cms_cotalogo.product_variation, cms_cotalogo. FROM cms_cotalogo.product_variation WHERE category_id='${category_id}';`;
// 	return db(query);
// };

// DELETE cms_cotalogo.variation, cms_cotalogo.product_variation
// FROM variation 
// INNER JOIN cms_cotalogo.product_variation ON variation.id = product_variation.variation_id
// WHERE category_id=2;

module.exports = Product;