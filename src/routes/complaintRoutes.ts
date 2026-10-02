import { Router } from "express";
import { ComplaintController } from "../controller/ComplaintController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/complaints", ComplaintController.create);
router.get("/complaints", ComplaintController.list);
router.get("/complaints/:id", ComplaintController.details);

export default router;