const db = require('../../../../config/connection');
const lib = require('jarmlib');

const Category = function () {
	this.id;
	this.name;
	this.type;
	this.scope;
	this.user_id;

	this.save = () => {
		if (!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }
		if (!this.type) { return { err: "Tipo de categoria inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.save(obj, 'cms_cotalogo.category');

		return db(query, values);
	};

	this.update = () => {
		if (!this.id) { return { err: "O id da cor é inválido" }; }

		let obj = lib.convertTo.object(this);
		let { query, values } = lib.Query.update(obj, 'cms_cotalogo.category', 'id');

		return db(query, values);
	};
};

Category.filter = (props, inners, params, strict_params, order_params) => {
	let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.category category")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build();
	return db(query, values);
};

Category.delete = async (category_id) => {
	let query = `DELETE FROM cms_cotalogo.category WHERE id = ?;`;
	return db(query, [category_id]);
};

module.exports = Category;