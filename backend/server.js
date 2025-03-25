import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/users", userRoutes);
app.use("/produtos", productRoutes);
app.use("/carrinho", cartRoutes);
app.use("/orders", orderRoutes); // Rota de pedidos

app.get("/", (req, res) => {
    res.send("Servidor está rodando corretamente!");
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
