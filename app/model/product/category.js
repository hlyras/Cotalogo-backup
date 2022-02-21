const db = require('../../../config/connection');
const lib = require('jarmlib');

const Category = function(category){
	this.id = category.id;
	this.user_id = 0;
	this.name = category.name;

	this.save = () => {
		if(!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.save(obj, 'cms_cotalogo.category');

    return db(query);
	};

	this.update = () => {
		if(!this.id) { return { err: "O id da cor é inválido" }; }
		if(!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.update(obj, 'cms_cotalogo.category', 'id');

    return db(query);
	};
};

Category.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.category category")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

Category.delete = async (category_id) => {
	let query = "DELETE FROM cms_cotalogo.category WHERE id='"+category_id+"';";
	return db(query);
};

module.exports = Category;