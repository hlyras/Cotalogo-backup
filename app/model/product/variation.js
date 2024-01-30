const db = require('../../../config/connection');
const lib = require('jarmlib');

const Variation = function () {
  this.id;
  this.user_id;
  this.product_id;
  this.variation_id;

  this.create = () => {
    if (!this.user_id) { return { err: "O usuário da variação é inválido" } }
    if (!this.product_id) { return { err: "O produto da variação é inválido" } }
    if (!this.variation_id) { return { err: "O id da variação do produto é inválido" } }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.product_variation');

    return db(query, values);
  }
};

Variation.filter = (options) => {
  let { query, values } = new lib.Query().select()
    .props(options.props)
    .table("cms_cotalogo.product_variation product_variation")
    .inners(options.inners)
    .params(options.params)
    .strictParams(options.strict_params)
    .order(options.order_params)
    .build();
  return db(query, values);
};

Variation.delete = (variation_id, product_id) => {
  let query = `DELETE FROM cms_cotalogo.product_variation WHERE variation_id= ? AND product_id= ?;`;
  return db(query, [variation_id, product_id]);
};

Variation.deleteByProduct = (product_id) => {
  let query = `DELETE FROM cms_cotalogo.product_variation WHERE product_id = ?;`;
  return db(query, [product_id]);
};

module.exports = Variation;