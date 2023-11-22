const db = require('../../../config/connection');
const lib = require('jarmlib');

const Variation = function (variation) {
  this.id;
  this.user_id = variation.user_id;
  this.product_id = variation.product_id;
  this.variation_id = variation.variation_id;

  this.save = () => {
    if (!this.user_id) { return { err: "O usuário da variação é inválido" } }
    if (!this.product_id) { return { err: "O produto da variação é inválido" } }
    if (!this.variation_id) { return { err: "O id da variação do produto é inválido" } }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.product_variation');

    return db(query, values);
  }
};

Variation.filter = (props, inners, params, strict_params, order_params) => {
  let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.product_variation product_variation")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build();
  return db(query, values);
};

Variation.delete = (variation_id, product_id) => {
  let query = `DELETE FROM cms_cotalogo.product_variation WHERE variation_id= ? AND product_id= ?;`;
  return db(query, [variation_id, product_id]);
};

module.exports = Variation;