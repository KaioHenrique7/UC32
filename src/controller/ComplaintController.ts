import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

export class ComplaintController {
    static async create(
        req: Request,
        res: Response
    ) {
        try {
            const userId = req.session.userId!;

            const { title, description } = req.body;

            await ComplaintService.create(
                userId,
                title,
                description
            );

            return res.redirect("/complaints");
        } catch (error: any) {
            return res.status(400).send(error.message);
        }
    }
}