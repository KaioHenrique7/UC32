import { Router } from "express";

import {
    authMiddleware
} from "../middlewares/authMiddleware";

const router = Router();

router.get(
    "/api/private",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "Usuario autenticado.",
            userId: req.session.userId
        });
    }
);

export default router;