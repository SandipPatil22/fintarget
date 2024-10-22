import { Router } from "express";
import { queueTask } from "../controllers/task.controller.js";
const router = Router();

router.post("/task", queueTask);

export default router;
