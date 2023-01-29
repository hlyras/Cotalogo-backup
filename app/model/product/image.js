const db = require('../../../config/connection');

const Image = function () {
  this.id = 0;
  this.product_id;
  this.etag;
  this.url;
  this.keycode;

  this.save = () => {
    let query = `INSERT INTO cms_cotalogo.product_image (product_id, etag, url, keycode) VALUES (${this.product_id},'${this.etag}','${this.url}','${this.keycode}');`;
    return db(query);
  };
};

Image.findById = async (id) => {
  let query = "SELECT * FROM cms_cotalogo.product_image WHERE id='" + id + "';";
  return db(query);
};

Image.list = (product_id) => {
  let query = `SELECT * FROM cms_cotalogo.product_image WHERE product_id=${product_id};`;
  return db(query);
};

Image.delete = (id) => {
  let query = `DELETE FROM cms_cotalogo.product_image WHERE id=${id};`;
  return db(query);
};

Image.deleteByProductId = (product_id) => {
  let query = `DELETE FROM cms_cotalogo.product_image WHERE product_id=${product_id};`;
  return db(query);
};

module.exports = Image;