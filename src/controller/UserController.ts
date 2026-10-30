import { Request, Response } from "express";
import { UserModel } from "../models/User";

export class UserController {
    static async profile(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({
                    error: "Usuário não autenticado."
                });
            }

            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    error: "Usuário não encontrado."
                });
            }

            return res.json({
                user
            });
        } catch (error) {
            console.error(
                "Erro ao buscar perfil:",
                error
            );

            return res.status(500).json({
                error: "Erro ao buscar perfil do usuário."
            });
        }
    }
}
