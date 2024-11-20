import express from "express";

import uploadController from "../controllers/upload.controller";
import productsController from "../controllers/products.controller";
import categoriesController from "../controllers/categories.controller";
import orderController from '../controllers/order.controller';
import authController from "../controllers/auth.controller";

import uploadMiddleware from "../middlewares/upload.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import rbacMiddleware from "../middlewares/rbac.middleware";

const router = express.Router();

// Auth
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);

router.post(
  "/auth/me",
  [authMiddleware, rbacMiddleware(["admin", "user"])],
  authController.me
);

router.put("/auth/update-profile", authMiddleware, authController.profile);

const admin = [authMiddleware, rbacMiddleware(["admin"])];

// CRUD Categories
router.get("/categories", categoriesController.findAll);
router.post("/categories", admin, categoriesController.create);
router.get("/categories/:id", categoriesController.findOne);
router.put("/categories/:id", admin, categoriesController.update);
router.delete("/categories/:id", admin, categoriesController.delete);

router.get("/products", productsController.findAll);
router.post("/products", productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", admin, productsController.update);
router.delete("/products/:id", admin, productsController.delete);

router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);



// Route to create an order
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders/:id', authMiddleware, orderController.getOrderDetail);
router.get('/orders', authMiddleware, orderController.getOrders);

export default router;
