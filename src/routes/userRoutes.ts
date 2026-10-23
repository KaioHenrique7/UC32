
import { Router } from "express";

import {
    UserController
} from "../controller/UserController";

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

router.get(
    "/api/user/me",
    authMiddleware,
    UserController.me
);

export default router;
