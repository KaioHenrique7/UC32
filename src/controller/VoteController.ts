import { Request, Response } from "express";
import { VoteService } from "../services/VoteService";

export class VoteController {
    static async create(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const complaintId = Number(req.params.id);

        if (
            !Number.isSafeInteger(complaintId) ||
            complaintId <= 0
        ) {
            return res.status(400).json({
                message:
                    "O ID da reclamação deve ser um inteiro positivo."
            });
        }

        try {
            const result = await VoteService.create(
                userId,
                complaintId
            );

            return res.status(201).json(result);
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "";

            if (
                message ===
                "Você já votou neste ciclo. O voto não pode ser retirado ou trocado."
            ) {
                return res.status(409).json({ message });
            }

            if (
                message ===
                "Reclamação indisponível para votação."
            ) {
                return res.status(404).json({ message });
            }

            if (
                message ===
                "Este ciclo foi encerrado. Atualize a página."
            ) {
                return res.status(409).json({ message });
            }

            console.error(error);

            return res.status(500).json({
                message: "Erro ao registrar voto."
            });
        }
    }

    static async current(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        try {
            const result = await VoteService.current(userId);

            return res.json(result);
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao consultar seu voto."
            });
        }
    }
}