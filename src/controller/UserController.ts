
import {
    Request,
    Response
} from "express";

import {
    UserModel
} from "../models/User";

export class UserController {

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

        const user =
            await UserModel.findById(
                req.session.userId
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "Usuário não encontrado."
            });
        }

        return res.json(user);
    }
}
