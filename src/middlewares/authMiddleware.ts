import {
    Request,
    Response,
    NextFunction
} from "express";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Usuario nao autenticado."
        });
    }

    return next();
}