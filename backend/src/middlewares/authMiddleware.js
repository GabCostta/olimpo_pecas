import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUserId = decodedToken.uid;

        let user = await prisma.user.findUnique({
            where: { firebaseId: firebaseUserId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseId: firebaseUserId,
                    email: decodedToken.email || "email@desconhecido.com",
                    name: decodedToken.name || "Usuário Desconhecido",
                },
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res
            .status(403)
            .json({ message: "Token inválido ou erro na autenticação" });
    }
};

export const adminMiddleware = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acesso negado" });
    }
    next();
};

export const userMiddleware = async (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(403).json({ message: "Acesso negado" });
    }
    next();
};