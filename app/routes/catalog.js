const router = require("express").Router();
const lib = require('jarmlib');

const UserAuth = require("../controller/user/auth");

const catalogController = require("../controller/catalog/main");
const CatalogProduct = require("../controller/catalog/product");
const CatalogTheme = require("../controller/catalog/theme");

router.get('/', lib.route.toHttps, UserAuth.verify, catalogController.index);
router.post('/create', lib.route.toHttps, UserAuth.verify, catalogController.create);
router.post('/filter', lib.route.toHttps, UserAuth.verify, catalogController.filter);
router.get('/id/:id', lib.route.toHttps, UserAuth.verify, catalogController.findById);
// router.delete('/delete/:id', lib.route.toHttps, UserAuth.verify, catalogController.delete);

router.post('/product/insert', lib.route.toHttps, UserAuth.verify, CatalogProduct.insert);
router.post('/product/filter', lib.route.toHttps, UserAuth.verify, CatalogProduct.filter);

router.get('/theme', lib.route.toHttps, UserAuth.verify, CatalogTheme.index);

module.exports = router;