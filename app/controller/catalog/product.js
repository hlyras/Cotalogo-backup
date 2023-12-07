import Product from '../../model/product/main.js';

import Catalog from '../../model/catalog/main.js';
import CatalogProduct from '../../model/catalog/product.js';

import lib from '../../lib/main.js';

const productController = {};

productController.insert = async (req, res) => {
  const product = new CatalogProduct();
  product.user_id = req.user.id;
  product.catalog_id = req.body.catalog_id;
  product.product_id = req.body.product_id;
  product.price = req.body.price;
  product.status = req.body.status;

  try {
    let catalog_user_id = (await Catalog.findById(product.catalog_id))[0].user_id;
    if (req.user.id != catalog_user_id) { return res.send({ unauthorized: "Você não tem permissão para utilizar este catálogo." }); }

    let product_user_id = (await Product.findById(product.product_id))[0].user_id;
    if (req.user.id != product_user_id) { return res.send({ unauthorized: "Você não tem permissão para utilizar este produto." }); }

    let strict_params = { keys: [], values: [] };
    lib.Query.fillParam('catalog_product.product_id', product.product_id, strict_params);
    lib.Query.fillParam('catalog_product.catalog_id', product.catalog_id, strict_params);
    let catalog_products = await CatalogProduct.filter([], [], [], strict_params, []);
    if (catalog_products.length) { return res.send({ msg: "Você já incluiu este produto neste catálogo." }); }

    let response = await product.insert();
    if (response.err) { return res.send({ msg: "Ocorreu um erro ao inserir o produto." }); }

    res.send({ done: "Produto incluído com sucesso!" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao filtrar os catálogos" })
  }
};

productController.filter = async (req, res) => {
  try {
    let props = ["catalog_product.*", "product.code", "product.name"];
    let inners = [
      ["cms_cotalogo.product", "catalog_product.product_id", "product.id"]
    ];
    let params = { keys: [], values: [] };
    let strict_params = { keys: [], values: [] };

    lib.Query.fillParam('catalog_product.user_id', req.user.user_id, strict_params);
    lib.Query.fillParam('catalog_product.catalog_id', req.body.catalog_id, strict_params);
    lib.Query.fillParam('product.name', req.body.name, params);
    lib.Query.fillParam('product.code', req.body.code, params);
    lib.Query.fillParam('catalog_product.status', req.body.status, strict_params);

    let order = [["product.code", "ASC"]];

    let products = await CatalogProduct.filter(props, inners, params, strict_params, order);

    res.send({ products });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao filtrar os catálogos" })
  }
};

export default productController;