const db = require('../../../config/connection');
const lib = require('jarmlib');

const Catalog = function () {
  this.id = 0;
  this.user_id = 0;
  this.url = "";

  this.create = () => {
    if (!this.user_id) { return { err: "Usuário inválido" }; }
    if (!this.url || this.url.length < 1 || this.url.length > 30) { return { err: "URL inválida" }; }

    let obj = lib.convertTo.object(this);

    let query = lib.Query.save(obj, 'cms_cotalogo.catalog');
    return db(query);
  };

  this.update = () => {
    if (!this.id) { return { err: "O id do produto é inválido" }; }
    if (!this.user_id) { return { err: "Usuário inválido" }; }
    if (!this.url || this.url.length < 2 || this.url.length > 30) { return { err: "URL inválida" }; }

    let obj = lib.convertTo.object(this);
    let query = lib.Query.update(obj, 'cms_cotalogo.catalog', 'id');

    return db(query);
  };
};

Catalog.filter = (props, inners, params, strict_params, order_params) => {
  let query = new lib.Query().select().props(props).table("cms_cotalogo.catalog")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
  return db(query);
};

Catalog.findById = (id) => {
  let query = `SELECT * FROM cms_cotalogo.catalog WHERE id = '${id}'`;
  return db(query);
};

// Product.variation = function (variation) {
//   this.id;
//   this.user_id = variation.user_id;
//   this.product_id = variation.product_id;
//   this.variation_id = variation.variation_id;

//   this.save = () => {
//     let obj = lib.convertTo.object(this);
//     let query = lib.Query.save(obj, 'cms_cotalogo.product_variation');
//     return db(query);
//   }
// };

// Product.variation.filter = (props, inners, params, strict_params, order_params) => {
//   let query = new lib.Query().select().props(props).table("cms_cotalogo.product_variation product_variation")
//     .inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
//   return db(query);
// };

// Product.variation.delete = (variation_id, product_id) => {
//   let query = `DELETE FROM cms_cotalogo.product_variation WHERE variation_id='${variation_id}' AND product_id='${product_id}';`;
//   return db(query);
// };

// Product.variation.deleteByCategoryId = async (category_id) => {
// 	let query = `DELETE cms_cotalogo.product_variation, cms_cotalogo. FROM cms_cotalogo.product_variation WHERE category_id='${category_id}';`;
// 	return db(query);
// };

// DELETE cms_cotalogo.variation, cms_cotalogo.product_variation
// FROM variation 
// INNER JOIN cms_cotalogo.product_variation ON variation.id = product_variation.variation_id
// WHERE category_id=2;

module.exports = Catalog;