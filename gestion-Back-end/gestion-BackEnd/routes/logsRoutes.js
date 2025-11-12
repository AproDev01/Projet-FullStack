import { Router } from "express";
import {getAllLogs,add} from "../controller/logsController.js"
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", getAllLogs);
router.post("/", add);
export default router;
