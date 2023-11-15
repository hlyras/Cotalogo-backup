const db = require('../../../../config/connection');
const lib = require('jarmlib');

const Variation = function (variation) {
	this.id = parseInt(variation.id);
	this.user_id = 0;
	this.category_id = parseInt(variation.category_id);
	this.name = variation.name;

	this.save = () => {
		if (!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.save(obj, 'cms_cotalogo.category_variation');

		return db(query, values);
	};

	this.update = () => {
		if (!this.id) { return { err: "O id da cor é inválido" }; }
		if (!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.update(obj, 'cms_cotalogo.category_variation', 'id');

		return db(query, values);
	};
};

Variation.filter = (props, inners, params, strict_params, order_params) => {
	let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.category_variation")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build();
	return db(query, values);
};

Variation.delete = async (variation_id) => {
	let query = `DELETE FROM cms_cotalogo.category_variation WHERE id = ?;`;
	return db(query, [variation_id]);
};

Variation.deleteByCategoryId = async (category_id) => {
	let query = `DELETE FROM cms_cotalogo.category_variation WHERE category_id = ?;`;
	return db(query, [category_id]);
};

module.exports = Variation;