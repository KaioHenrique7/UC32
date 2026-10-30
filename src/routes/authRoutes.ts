import { Router } from "express";

import {
    AuthController
} from "../controller/AuthController";

const router = Router();

router.post(
    "/register",
    AuthController.register
);

router.post(
    "/login",
    AuthController.login
);

router.post(
    "/logout",
    AuthController.logout
);

// Link "Sair" do menu faz GET
router.get(
    "/logout",
    AuthController.logoutRedirect
);

router.get(
    "/me",
    AuthController.me
);

export default router;