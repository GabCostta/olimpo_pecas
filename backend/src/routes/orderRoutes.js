import express from "express";
import { registerOrder, fetchOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", registerOrder);
router.get("/", fetchOrders);

export default router;