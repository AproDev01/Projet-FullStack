import { Router } from "express";
import {
  addEtudiant,
  deleteEtudiant,
  getAllEtudinats,
  getEtudinatById,
  updateEtudiant,
} from "../controller/etudiantsController.js";
const monrouter = Router();

monrouter.get("/", getAllEtudinats);

monrouter.get("/:id", getEtudinatById);
/*Routes protégées : nécessitent un token
monrouter.post("", verifyToken, addEtudiant);
monrouter.put("/:id", verifyToken, updateEtudiant);
monrouter.delete("/:id", verifyToken, deleteEtudiant);*/

monrouter.post("", addEtudiant);

monrouter.put("/:id", updateEtudiant);

monrouter.delete("/:id", deleteEtudiant);

export const MonRouteur = monrouter;
