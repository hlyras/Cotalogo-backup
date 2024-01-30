const db = require('../../../config/connection');
const lib = require('jarmlib');

const Type = function () {
  this.id;
  this.name;
  this.type;
};

Type.filter = ({ props, inners, params, strict_params, order_params }) => {
  let { query, values } = new lib.Query().select()
    .props(props)
    .table("cms_cotalogo.category_type")
    .inners(inners)
    .params(params)
    .strictParams(strict_params)
    .order(order_params)
    .build();
  return db(query, values);
};

module.exports = Type;