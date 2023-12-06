import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.mjs';

import homeController from '../controller/home.mjs';

import UserRouter from './user.mjs';
import ProductRouter from './product.mjs';
import CategoryRouter from './category.mjs';
import CatalogRouter from './catalog.mjs';

router.get("/", toHttps, homeController.index);

router.use("/user", UserRouter);
router.use("/product", ProductRouter);
router.use("/category", CategoryRouter);
router.use("/catalog", CatalogRouter);

export default router;