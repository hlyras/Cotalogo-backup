const router = require("express").Router();
const lib = require('jarmlib');
const multer = require('../middleware/multer');

const UserAuth = require("../controller/user/auth");

const Product = require("../controller/product/main");
const ProductImage = require("../controller/product/image");

router.get('/', lib.route.toHttps, UserAuth.verify, Product.index);
router.post('/create', lib.route.toHttps, UserAuth.verify, multer.any('files'), Product.create);
router.post('/filter', lib.route.toHttps, UserAuth.verify, Product.filter);
router.get('/id/:id', lib.route.toHttps, UserAuth.verify, Product.findById);
// router.delete('/delete/:id', lib.route.toHttps, UserAuth.verify, Product.delete);
router.delete('/image/id/:id', lib.route.toHttps, UserAuth.authorize, ProductImage.delete);

module.exports = router;