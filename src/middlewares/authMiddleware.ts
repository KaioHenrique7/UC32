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
        const isApiRequest =
            req.originalUrl.startsWith("/api/");

        const wantsHtml =
            req.accepts(["html", "json"]) === "html";

        if (!isApiRequest && wantsHtml) {
            return res.redirect("/login");
        }

        return res.status(401).json({
            message: "Usuario nao autenticado."
        });
    }

    return next();
}