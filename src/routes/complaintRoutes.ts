import { Router } from "express";
import { ComplaintController } from "../controller/ComplaintController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
    "/complaints",
    authMiddleware,
    ComplaintController.create
);

router.get(
    "/complaints",
    authMiddleware,
    ComplaintController.list
);

router.get(
    "/complaints/:id",
    authMiddleware,
    ComplaintController.details
);

export default router;