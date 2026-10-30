import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

export class ComplaintController {
    static async list(
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

            const complaints =
                await ComplaintService.listByUser(userId);

            return res.json({
                complaints
            });
        } catch (error) {
            console.error(
                "Erro ao listar reclamações:",
                error
            );

            return res.status(500).json({
                error: "Erro ao buscar reclamações."
            });
        }
    }

    static async create(
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

            const {
                title,
                description
            } = req.body;

            const complaintId =
                await ComplaintService.create(
                    userId,
                    title,
                    description
                );

            return res.status(201).json({
                message: "Reclamação criada com sucesso.",
                id: complaintId
            });
        } catch (error) {
            console.error(
                "Erro ao criar reclamação:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao criar reclamação.";

            return res.status(400).json({
                error: message
            });
        }
    }

    static async show(
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

            const complaintId =
                Number(req.params.id);

            if (Number.isNaN(complaintId)) {
                return res.status(400).json({
                    error: "ID da reclamação inválido."
                });
            }

            const complaint =
                await ComplaintService.findById(
                    complaintId,
                    userId
                );

            return res.json({
                complaint
            });
        } catch (error) {
            console.error(
                "Erro ao buscar reclamação:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Reclamação não encontrada.";

            return res.status(404).json({
                error: message
            });
        }
    }

    static async updateStatus(
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

            const complaintId =
                Number(req.params.id);

            if (Number.isNaN(complaintId)) {
                return res.status(400).json({
                    error: "ID da reclamação inválido."
                });
            }

            const {
                status
            } = req.body;

            const complaint =
                await ComplaintService.updateStatus(
                    complaintId,
                    userId,
                    status
                );

            return res.json({
                message: "Status atualizado com sucesso.",
                complaint
            });
        } catch (error) {
            console.error(
                "Erro ao atualizar status:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar status.";

            return res.status(400).json({
                error: message
            });
        }
    }

    static async remove(
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

            const complaintId =
                Number(req.params.id);

            if (Number.isNaN(complaintId)) {
                return res.status(400).json({
                    error: "ID da reclamação inválido."
                });
            }

            await ComplaintService.remove(
                complaintId,
                userId
            );

            return res.status(204).send();
        } catch (error) {
            console.error(
                "Erro ao excluir reclamação:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir reclamação.";

            return res.status(404).json({
                error: message
            });
        }
    }
}
