import express from "express";
import { register, login, getUsers } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers); // Récupérer tous les utilisateurs

export default router;
