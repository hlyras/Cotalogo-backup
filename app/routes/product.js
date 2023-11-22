const router = require("express").Router();
const lib = require('jarmlib');
const multer = require('../middleware/multer');

const userController = require("../controller/user");

const productController = require("../controller/product/main");
productController.image = require("../controller/product/image");

router.get('/', lib.route.toHttps, userController.verify, productController.index);
router.post('/save', lib.route.toHttps, userController.verify, multer.any('files'), productController.save);
router.post('/filter', lib.route.toHttps, userController.verify, productController.filter);
router.get('/id/:id', lib.route.toHttps, userController.verify, productController.findById);
// router.delete('/delete/:id', lib.route.toHttps, userController.verify, productController.delete);
router.delete('/image/id/:id', lib.route.toHttps, userController.authorize, productController.image.delete);

module.exports = router;