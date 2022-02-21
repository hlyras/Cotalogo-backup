const db = require('../../../config/connection');
const lib = require('jarmlib');

const Variation = function(variation){
	this.id = parseInt(variation.id);
	this.user_id = 0;
	this.category_id = parseInt(variation.category_id);
	this.name = variation.name;

	this.save = () => {
		if(!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.save(obj, 'cms_cotalogo.variation');

    return db(query);
	};

	this.update = () => {
		if(!this.id) { return { err: "O id da cor é inválido" }; }
		if(!this.name || this.name.length < 1 || this.name.length > 100) { return { err: "Nome inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.update(obj, 'cms_cotalogo.variation', 'id');

    return db(query);
	};
};

Variation.filter = (props, inners, params, strict_params, order_params) => {
	let query = new lib.Query().select().props(props).table("cms_cotalogo.variation variation")
		.inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
	return db(query);
};

Variation.delete = async (variation_id) => {
	let query = "DELETE FROM cms_cotalogo.variation WHERE id='"+variation_id+"';";
	return db(query);
};

module.exports = Variation;