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
<<<<<<< HEAD

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}
=======
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Usuario nao autenticado."
        });
    }

    return next();
}
>>>>>>> 907732ffd40f4e3c0742ec578d97207411d6a5ff
