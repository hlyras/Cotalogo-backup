const router = require("express").Router();
const lib = require('jarmlib');

const multer = require('../middleware/multer');

const userController = require("../controller/user");
const productController = require("../controller/product/main");
productController.image = require("../controller/product/image");
const categoryController = require("../controller/product/category");
const variationController = require("../controller/product/variation");

router.get('/', lib.route.toHttps, userController.verify, productController.index);
router.post('/save', lib.route.toHttps, userController.verify, multer.any('files'), productController.save);
router.post('/filter', lib.route.toHttps, userController.verify, productController.filter);
router.get('/id/:id', lib.route.toHttps, userController.verify, productController.findById);
// router.delete('/delete/:id', lib.route.toHttps, userController.verify, productController.delete);
router.delete('/image/id/:id', lib.route.toHttps, userController.authorize, productController.image.delete);

router.get('/category', lib.route.toHttps, userController.verify, categoryController.index);
router.post('/category/save', lib.route.toHttps, userController.authorize, categoryController.save);
router.post('/category/filter', lib.route.toHttps, userController.authorize, categoryController.filter);
router.delete('/category/delete/:id', lib.route.toHttps, userController.authorize, categoryController.delete);

router.post('/variation/save', lib.route.toHttps, userController.authorize, variationController.save);
router.post('/variation/filter', lib.route.toHttps, userController.authorize, variationController.filter);
router.delete('/variation/delete/:id', lib.route.toHttps, userController.authorize, variationController.delete);

module.exports = router;