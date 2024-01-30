const db = require('../../../config/connection');
const lib = require('jarmlib');

const Product = function () {
  this.id;
  this.user_id;
  this.catalog_id;
  this.product_id;
  this.price;
  this.status;

  this.create = () => {
    if (!this.user_id) { return { err: "Usuário inválido" }; }
    if (!this.catalog_id) { return { err: "Catálogo inválido" }; }
    if (!this.product_id) { return { err: "Produto inválido" }; }
    if (!this.status) { return { err: "Status inválido" }; }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.catalog_product');

    return db(query, values);
  };

  this.update = () => {
    if (!this.id) { return { err: "O id do produto é inválido" }; }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.update(obj, 'cms_cotalogo.catalog_product', 'id');

    return db(query, values);
  };
};

Product.filter = (options) => {
  let { query, values } = new lib.Query().select()
    .props(options.props)
    .table("cms_cotalogo.catalog_product")
    .inners(options.inners)
    .params(options.params)
    .strictParams(options.strict_params)
    .order(options.order_params)
    .build();
  return db(query, values);
};

module.exports = Product;