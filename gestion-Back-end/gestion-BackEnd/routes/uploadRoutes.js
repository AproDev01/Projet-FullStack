import express from "express";
import upload from "../multerConfig.js";
import { uploadFile } from "../controller/etudiantsController.js";

const router = express.Router();

// route pour un seul fichier
router.post("/upload", upload.single("file"), uploadFile);

export default router;