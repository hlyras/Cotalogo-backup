const db = require('../../../config/connection');
const lib = require('jarmlib');

const Variation = function () {
	this.id;
	this.user_id;
	this.category_id;
	this.name;

	this.create = () => {
		if (!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }
		if (!this.user_id) { return { err: "Usuário inválido" }; }
		if (!this.category_id) { return { err: "categoria inválida" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.save(obj, 'cms_cotalogo.category_variation');

		return db(query, values);
	};

	this.update = () => {
		if (!this.id) { return { err: "O id da variação é inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.update(obj, 'cms_cotalogo.category_variation', 'id');

		return db(query, values);
	};
};

Variation.filter = ({ props, inners, params, strict_params, order_params }) => {
	let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.category_variation")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build();
	return db(query, values);
};

Variation.delete = async (id) => {
	let query = `DELETE FROM cms_cotalogo.category_variation WHERE id = ?;`;
	return db(query, [id]);
};

Variation.deleteByCategoryId = async (category_id) => {
	let query = `DELETE FROM cms_cotalogo.category_variation WHERE category_id = ?;`;
	return db(query, [category_id]);
};

module.exports = Variation;