const router = require("express").Router();
const lib = require('jarmlib');

const userController = require("../controller/user");
const catalogController = require("../controller/catalog/main");

router.get('/', lib.route.toHttps, userController.verify, catalogController.index);
router.post('/create', lib.route.toHttps, userController.verify, catalogController.create);
router.post('/filter', lib.route.toHttps, userController.verify, catalogController.filter);
router.get('/id/:id', lib.route.toHttps, userController.verify, catalogController.findById);
// router.delete('/delete/:id', lib.route.toHttps, userController.verify, catalogController.delete);

module.exports = router;