const router = require("express").Router();
const lib = require('jarmlib');

const homeController = require("../controller/home");

router.get("/", lib.route.toHttps, homeController.index);

router.get("/login", lib.route.toHttps, homeController.login);
router.get("/signup", lib.route.toHttps, homeController.signup);

router.use("/user", require("./user"));
router.use("/product", require("./product"));
router.use("/category", require("./category"));
router.use("/catalog", require("./catalog"));

module.exports = router;