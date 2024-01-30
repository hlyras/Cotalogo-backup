const router = require("express").Router();
const lib = require('jarmlib');

const UserAuth = require("../controller/user/auth");

const Category = require("../controller/category/main");
const CategoryType = require("../controller/category/type");
const CategoryVariation = require("../controller/category/variation");

router.get('/', lib.route.toHttps, UserAuth.verify, Category.index);
router.post('/create', lib.route.toHttps, UserAuth.authorize, Category.create);
router.put('/update', lib.route.toHttps, UserAuth.authorize, Category.update);
router.post('/filter', lib.route.toHttps, UserAuth.authorize, Category.filter);
router.delete('/delete/:id', lib.route.toHttps, UserAuth.authorize, Category.delete);

router.post('/type/filter', lib.route.toHttps, UserAuth.authorize, CategoryType.filter);

router.post('/variation/create', lib.route.toHttps, UserAuth.authorize, CategoryVariation.create);
router.post('/variation/filter', lib.route.toHttps, UserAuth.authorize, CategoryVariation.filter);
router.delete('/variation/delete/:id', lib.route.toHttps, UserAuth.authorize, CategoryVariation.delete);

module.exports = router;