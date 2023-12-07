import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import passport from '../../config/passport.js';

import User from '../controller/user/main.js'
import UserAuth from '../controller/user/auth.js'
import UserAccount from '../controller/user/account.js'

import homeController from '../controller/home.js'

router.get('/', toHttps, UserAuth.verify, User.index);

router.get('/account', toHttps, UserAuth.verify, UserAccount.index);
router.post('/account/cob', toHttps, UserAuth.verify, UserAccount.genCob);
router.post('/account/webhooks(/pix)?', toHttps, UserAuth.verify, UserAccount.webhooks);

router.get("/login", toHttps, homeController.login);
router.get("/signup", toHttps, homeController.signup);

router.post('/login', toHttps, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/login' }));
router.post('/signup', toHttps, UserAuth.signup);

router.get("/logout", toHttps, UserAuth.logout);

router.get("/confirm-email/:token", toHttps, UserAuth.confirmEmail);

export default router;