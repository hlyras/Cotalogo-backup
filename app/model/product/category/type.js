const db = require('../../../../config/connection');
const lib = require('jarmlib');

const Type = function () {
  this.id = "";
  this.name = "";
  this.type = "";
};

Type.filter = (props, inners, params, strict_params, order_params) => {
  let query = new lib.Query().select().props(props).table("cms_cotalogo.Type")
    .inners(inners).params(params).strictParams(strict_params).order(order_params).build().query;
  return db(query);
};

module.exports = Type;