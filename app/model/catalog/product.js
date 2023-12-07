import db from '../../../config/connection.js';
import lib from '../../lib/main.js';

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

Product.filter = (props, inners, params, strict_params, order_params) => {
  let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.catalog_product")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build();
  return db(query, values);
};

export default Product;