import { Router } from "express";
import { ComplaintController } from "../controller/ComplaintController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Mantém o endereço usado pelo formulário atual.
router.post(
    "/complaints",
    authMiddleware,
    ComplaintController.create
);

// Endereços da API.
router.get(
    "/api/complaints",
    authMiddleware,
    ComplaintController.list
);

router.get(
    "/api/complaints/:id",
    authMiddleware,
    ComplaintController.details
);

export default router;