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

    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.catalog');
    return db(query, values);
  };

  this.update = () => {
    if (!this.id) { return { err: "O id do produto é inválido" }; }
    if (!this.user_id) { return { err: "Usuário inválido" }; }
    if (!this.url || this.url.length < 2 || this.url.length > 30) { return { err: "URL inválida" }; }

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.update(obj, 'cms_cotalogo.catalog', 'id');

    return db(query, values);
  };
};

Catalog.filter = (props, inners, params, strict_params, order_params) => {
  let { query, values } = new lib.Query().select().props(props).table("cms_cotalogo.catalog")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build();
  return db(query, values);
};

Catalog.findById = (id) => {
  let query = `SELECT * FROM cms_cotalogo.catalog WHERE id = ?`;
  return db(query, [id]);
};

module.exports = Catalog;