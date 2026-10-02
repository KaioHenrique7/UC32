import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

export class ComplaintController {
    static async create(req: Request, res: Response) {
        try {
            const userId = req.session.userId!;
            const { title, description } = req.body;

            await ComplaintService.create(userId, title, description);
            res.redirect("/complaints");
        } catch (error: any) {
            res.status(400).send(error.message);
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const userId = req.session.userId!;
            const complaints = await ComplaintService.list(userId);

            res.json(complaints);
        } catch {
            res.status(500).json({
                message: "Erro ao buscar reclamações."
            });
        }
    }

    static async details(req: Request, res: Response) {
        try {
            const userId = req.session.userId!;
            const id = Number(req.params.id);

            const complaint = await ComplaintService.details(id, userId);

            if (!complaint) {
                return res.status(404).json({
                    message: "Reclamação não encontrada."
                });
            }

            res.json(complaint);
        } catch {
            res.status(500).json({
                message: "Erro ao buscar reclamação."
            });
        }
    }
}