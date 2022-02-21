const router = require("express").Router();
const lib = require('jarmlib');

const passport = require('../../config/passport');

const userController = require("../controller/user");
const homeController = require("../controller/home");

router.get('/', lib.route.toHttps, userController.verify, userController.index);

router.post('/login', passport.authenticate('local-login', { 
	failureRedirect: '/login',
	failureFlash: true
}), homeController.successfulLogin);

router.post('/signup', passport.authenticate('local-signup', { 
	failureRedirect: '/signup',
	failureFlash: true
}), homeController.successfulSignup);

router.get("/logout", lib.route.toHttps, homeController.logout);

router.get("/confirm-email/:token", lib.route.toHttps, userController.confirmEmail);

router.get('/list', lib.route.toHttps, userController.list);
router.post('/show', lib.route.toHttps, userController.show);
router.put('/updateInfo', lib.route.toHttps, userController.updateInfo);
router.put('/updatePassword', lib.route.toHttps, userController.updatePassword);

module.exports = router;