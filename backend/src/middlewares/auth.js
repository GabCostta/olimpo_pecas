import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const autenticar = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ mensagem: "Acesso negado! Nenhum token fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: "Token inválido!" });
  }
};

export default autenticar;
