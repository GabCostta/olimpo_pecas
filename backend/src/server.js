import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
<<<<<<< HEAD
=======
import orderRoutes from "./routes/orderRoutes.js";
>>>>>>> teste

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/users", userRoutes);
app.use("/produtos", productRoutes);
app.use("/carrinho", cartRoutes);
<<<<<<< HEAD
=======
app.use("/orders", orderRoutes); // Rota de pedidos

app.get("/", (req, res) => {
    res.send("Servidor está rodando corretamente!");
});

>>>>>>> teste

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
