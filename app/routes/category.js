import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import UserAuth from '../controller/user/auth.js';

import Category from '../controller/category/main.js';
import CategoryVariation from '../controller/category/variation.js';

router.get('/', toHttps, UserAuth.verify, Category.index);
router.post('/save', toHttps, UserAuth.authorize, Category.save);
router.put('/update', toHttps, UserAuth.authorize, Category.update);
router.post('/filter', toHttps, UserAuth.authorize, Category.filter);
router.delete('/delete/:id', toHttps, UserAuth.authorize, Category.delete);

router.post('/variation/save', toHttps, UserAuth.authorize, CategoryVariation.save);
router.post('/variation/filter', toHttps, UserAuth.authorize, CategoryVariation.filter);
router.delete('/variation/delete/:id', toHttps, UserAuth.authorize, CategoryVariation.delete);

export default router;