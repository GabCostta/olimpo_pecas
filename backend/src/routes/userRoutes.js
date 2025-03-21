import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.post("/registrar", registrar);

export default router;
