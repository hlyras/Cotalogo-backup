const db = require('../../../config/connection');
const lib = require('jarmlib');

const Product = function(product){
	this.id;
	this.user_id = product.user_id;
	this.code = product.code;
	this.name = product.name;
	this.description = product.description;

	this.save = () => {
		if(!this.name || this.name.length < 2 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
			
		let query = lib.Query.save(obj, 'cms_cotalogo.product');
    return db(query);
	};
};

Product.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.product product")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

Product.variation = function(variation) {
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

module.exports = Product;