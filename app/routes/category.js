const router = require("express").Router();
const lib = require('jarmlib');

const userController = require("../controller/user");

const categoryController = require("../controller/category/main");
categoryController.variation = require("../controller/category/variation");

router.get('/', lib.route.toHttps, userController.verify, categoryController.index);
router.post('/save', lib.route.toHttps, userController.authorize, categoryController.save);
router.put('/update', lib.route.toHttps, userController.authorize, categoryController.update);
router.post('/filter', lib.route.toHttps, userController.authorize, categoryController.filter);
router.delete('/delete/:id', lib.route.toHttps, userController.authorize, categoryController.delete);

router.post('/variation/save', lib.route.toHttps, userController.authorize, categoryController.variation.save);
router.post('/variation/filter', lib.route.toHttps, userController.authorize, categoryController.variation.filter);
router.delete('/variation/delete/:id', lib.route.toHttps, userController.authorize, categoryController.variation.delete);

module.exports = router;