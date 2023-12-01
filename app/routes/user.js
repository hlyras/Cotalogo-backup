const router = require("express").Router();
const lib = require('jarmlib');

const passport = require('../../config/passport').default;

const userController = require("../controller/user/main");
// userController.auth = require("../controller/user/auth");
// userController.account = require("../controller/user/account");

const homeController = require("../controller/home");

// router.get('/', lib.route.toHttps, userController.auth.verify, userController.index);

// router.get('/account', lib.route.toHttps, userController.auth.verify, userController.account.index);
// router.post('/account/cob', lib.route.toHttps, userController.auth.verify, userController.account.genCob);
// router.post('/account/webhooks(/pix)?', lib.route.toHttps, userController.auth.verify, userController.account.webhooks);

router.get("/login", lib.route.toHttps, homeController.login);
router.get("/signup", lib.route.toHttps, homeController.signup);

router.post('/login', lib.route.toHttps, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
// router.post('/signup', lib.route.toHttps, userController.auth.signup);

// router.get("/logout", lib.route.toHttps, userController.auth.logout);

// router.get("/confirm-email/:token", lib.route.toHttps, userController.auth.confirmEmail);

module.exports = router;