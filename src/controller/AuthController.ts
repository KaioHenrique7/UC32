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

            const {
                name,
                email,
                password
            } = req.body;

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

            const {
                email,
                password
            } = req.body;

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

            return res.status(401).json({
                message:
                    error.message ||
                    "Erro ao realizar login."
            });
        }
    }

    static logout(
        req: Request,
        res: Response
    ) {

        req.session.destroy((error) => {

            if (error) {

                return res.status(500).json({
                    message:
                        "Erro ao sair da conta."
                });
            }

            return res.json({
                message:
                    "Logout realizado com sucesso."
            });
        });
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