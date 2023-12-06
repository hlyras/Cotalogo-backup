import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.mjs';

import User from '../controller/user.mjs';

import Category from '../controller/category/main.mjs';
import CategoryVariation from '../controller/category/variation.mjs';

router.get('/', toHttps, User.verify, Category.index);
router.post('/save', toHttps, User.authorize, Category.save);
router.put('/update', toHttps, User.authorize, Category.update);
router.post('/filter', toHttps, User.authorize, Category.filter);
router.delete('/delete/:id', toHttps, User.authorize, Category.delete);

router.post('/variation/save', toHttps, User.authorize, CategoryVariation.save);
router.post('/variation/filter', toHttps, User.authorize, CategoryVariation.filter);
router.delete('/variation/delete/:id', toHttps, User.authorize, CategoryVariation.delete);

export default router;