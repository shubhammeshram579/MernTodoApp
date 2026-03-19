import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All task routes are protected
router.use(protect);

router.post("/create",createTask)
router.get("/getAlltask",getTasks)
router.put("/updated-task/:id",updateTask)
router.delete("/delete-task/:id",deleteTask)


export default router;
