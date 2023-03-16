const db = require('../../../config/connection');
const lib = require('jarmlib');

const Product = function () {
  this.id = 0;
  this.user_id = 0;
  this.catalog_id = 0;
  this.product_id = 0;
  this.price = 0.00;
  this.status = "";

  this.insert = () => {
    if (!this.user_id) { return { err: "Usuário inválido" }; }
    if (!this.catalog_id) { return { err: "Catálogo inválido" }; }
    if (!this.product_id) { return { err: "Produto inválido" }; }
    if (!this.status) { return { err: "Status inválido" }; }

    let obj = lib.convertTo.object(this);

    let query = lib.Query.save(obj, 'cms_cotalogo.catalog_product');
    return db(query);
  };

  this.update = () => {
    if (!this.id) { return { err: "O id do produto é inválido" }; }

    let obj = lib.convertTo.object(this);
    let query = lib.Query.update(obj, 'cms_cotalogo.catalog_product', 'id');

    return db(query);
  };
};

Product.filter = (props, inners, params, strict_params, order_params) => {
  let query = new lib.Query().select().props(props).table("cms_cotalogo.catalog_product")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
  return db(query);
};

// Catalog.findById = (id) => {
//   let query = `SELECT * FROM cms_cotalogo.catalog_product WHERE id = '${id}'`;
//   return db(query);
// };

module.exports = Product;