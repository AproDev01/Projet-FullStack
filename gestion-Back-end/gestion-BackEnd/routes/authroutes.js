import { Router } from "express";
import { login, register } from "../controller/userController.js";

const authrouter = Router();

authrouter.post("/login", login);
authrouter.post("/register", register);

export const AuthRouter = authrouter;
