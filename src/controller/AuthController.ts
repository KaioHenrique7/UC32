import {
    Request,
    Response
} from "express";

import { AuthService } from "../services/AuthService";

export class AuthController {

    static async register(
        req: Request,
        res: Response
    ) {
        try {
            const name =
                String(req.body.name).trim();

            const email =
                String(req.body.email)
                    .trim()
                    .toLowerCase();

            const password =
                String(req.body.password);

            const userId =
                await AuthService.register(
                    name,
                    email,
                    password
                );

            return res.status(201).json({
                message:
                    "Usuário criado com sucesso.",
                userId
            });

        } catch (error: any) {
            return res.status(400).json({
                message:
                    error.message ||
                    "Erro ao cadastrar usuário."
            });
        }
    }

    static async login(
        req: Request,
        res: Response
    ) {
        try {
            const email =
                String(req.body.email)
                    .trim()
                    .toLowerCase();

            const password =
                String(req.body.password);

            const user =
                await AuthService.login(
                    email,
                    password
                );

            req.session.userId =
                user.id;

            return res.json({
                message:
                    "Login realizado com sucesso.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error: any) {
            // Tratamento de erro no login
            return res.status(401).json({
                message:
                    error.message ||
                    "Erro ao realizar login."
            });
        }
    }

    static async me(
        req: Request,
        res: Response
    ) {
        if (!req.session.userId) {
            return res.status(401).json({
                message:
                    "Usuário não autenticado."
            });
        }

        return res.json({
            userId:
                req.session.userId
        });
    }
}