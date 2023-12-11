const router = require("express").Router();
const lib = require('jarmlib');

const passport = require('../../config/passport');

const User = require("../controller/user/main");
const UserAuth = require("../controller/user/auth");
const UserAccount = require("../controller/user/account");

const homeController = require("../controller/home");

router.get('/', lib.route.toHttps, UserAuth.verify, User.index);

router.get('/account', lib.route.toHttps, UserAuth.verify, UserAccount.index);
router.post('/account/cob', lib.route.toHttps, UserAuth.verify, UserAccount.genCob);
router.post('/account/webhooks(/pix)?', lib.route.toHttps, UserAuth.verify, UserAccount.webhooks);

router.get("/login", lib.route.toHttps, homeController.login);
router.get("/signup", lib.route.toHttps, homeController.signup);

router.post('/login', lib.route.toHttps, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login' }));
router.post('/signup', lib.route.toHttps, UserAuth.signup);

router.get("/logout", lib.route.toHttps, UserAuth.logout);

router.get("/confirm-email/:token", lib.route.toHttps, UserAuth.confirmEmail);

module.exports = router;