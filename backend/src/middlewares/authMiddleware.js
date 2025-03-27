import admin from "firebase-admin";
import { prisma } from "../prismaClient.js";

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK)),
});

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
        res.status(403).json({ message: "Token inválido ou erro na autenticação" });
    }
};
