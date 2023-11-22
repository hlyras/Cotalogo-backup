const router = require("express").Router();
const lib = require('jarmlib');

const userController = require("../controller/user");

const catalogController = require("../controller/catalog/main");
catalogController.product = require("../controller/catalog/product");
catalogController.theme = require("../controller/catalog/theme");

router.get('/', lib.route.toHttps, userController.verify, catalogController.index);
router.post('/create', lib.route.toHttps, userController.verify, catalogController.create);
router.post('/filter', lib.route.toHttps, userController.verify, catalogController.filter);
router.get('/id/:id', lib.route.toHttps, userController.verify, catalogController.findById);
// router.delete('/delete/:id', lib.route.toHttps, userController.verify, catalogController.delete);

router.post('/product/insert', lib.route.toHttps, userController.verify, catalogController.product.insert);
router.post('/product/filter', lib.route.toHttps, userController.verify, catalogController.product.filter);

router.get('/theme', lib.route.toHttps, userController.verify, catalogController.theme.index);

module.exports = router;