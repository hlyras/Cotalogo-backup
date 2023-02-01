const router = require("express").Router();
const lib = require('jarmlib');

const passport = require('../../config/passport');

const userController = require("../controller/user/main");
userController.auth = require("../controller/user/auth");
userController.account = require("../controller/user/account");

const homeController = require("../controller/home");

router.get('/', lib.route.toHttps, userController.auth.verify, userController.index);

router.get('/account', lib.route.toHttps, userController.auth.verify, userController.account.index);
router.post('/account/cob', lib.route.toHttps, userController.auth.verify, userController.account.genCob);

router.post('/login', passport.authenticate('local-login', {
	failureRedirect: '/login',
	failureFlash: true
}), homeController.successfulLogin);

router.post('/signup', passport.authenticate('local-signup', {
	failureRedirect: '/signup',
	failureFlash: true
}), homeController.successfulSignup);

// router.get("/logout", lib.route.toHttps, homeController.logout);

router.get("/confirm-email/:token", lib.route.toHttps, userController.auth.confirmEmail);

module.exports = router;