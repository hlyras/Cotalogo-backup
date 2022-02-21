const router = require("express").Router();
const lib = require('jarmlib');

const passport = require('../../config/passport');

const userController = require("../controller/user");
const productController = require("../controller/product/main");
const categoryController = require("../controller/product/category");
const variationController = require("../controller/product/variation");

router.get('/', lib.route.toHttps, userController.verify, productController.index);
router.post('/save', lib.route.toHttps, userController.verify, productController.save);
router.post('/filter', lib.route.toHttps, userController.verify, productController.filter);
// router.delete('/delete/:id', lib.route.toHttps, userController.verify, productController.delete);

router.get('/category', lib.route.toHttps, userController.verify, categoryController.index);
router.post('/category/save', lib.route.toHttps, userController.authorize, categoryController.save);
router.post('/category/filter', lib.route.toHttps, userController.authorize, categoryController.filter);
router.delete('/category/delete/:id', lib.route.toHttps, userController.authorize, categoryController.delete);

router.get('/variation', lib.route.toHttps, userController.verify, variationController.index);
router.post('/variation/save', lib.route.toHttps, userController.authorize, variationController.save);
router.post('/variation/filter', lib.route.toHttps, userController.authorize, variationController.filter);
router.delete('/variation/delete/:id', lib.route.toHttps, userController.authorize, variationController.delete);

module.exports = router;