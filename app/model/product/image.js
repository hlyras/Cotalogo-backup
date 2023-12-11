const db = require('../../../config/connection');

const Image = function () {
  this.id = 0;
  this.user_id;
  this.product_id;
  this.etag;
  this.url;
  this.keycode;

  this.save = () => {
    if (!this.user_id) { return { err: "Imagem sem usuário válido" }; };
    if (!this.product_id) { return { err: "Imagem sem usuário válido" }; };
    if (!this.etag) { return { err: "Imagem sem etag válido" }; };
    if (!this.url) { return { err: "Imagem sem url válido" }; };
    if (!this.keycode) { return { err: "Imagem sem keycode válido" }; };

    let obj = lib.convertTo.object(this);
    let { query, values } = lib.Query.save(obj, 'cms_cotalogo.product_image');

    return db(query, values);
  };
};

Image.findById = async (id) => {
  let query = `SELECT * FROM cms_cotalogo.product_image WHERE id = ?;`;
  return db(query, [id]);
};

Image.findByProductId = async (product_id) => {
  let query = `SELECT * FROM cms_cotalogo.product_image WHERE product_id = ?;`;
  return db(query, [product_id]);
};

Image.delete = (id) => {
  let query = `DELETE FROM cms_cotalogo.product_image WHERE id = ?;`;
  return db(query, [id]);
};

Image.deleteByProductId = (product_id) => {
  let query = `DELETE FROM cms_cotalogo.product_image WHERE product_id = ?;`;
  return db(query, [product_id]);
};

module.exports = Image;