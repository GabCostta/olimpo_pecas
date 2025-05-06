import express from "express";
import CartController from "../controllers/CartController.js";

const router = express.Router();

router.post("/", CartController.addItem);
router.get("/:userId", CartController.getUserCart);
router.put("/:id", CartController.updateItem);
router.delete("/:id", CartController.removeItem);

export default router;