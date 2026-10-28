
import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

export class ComplaintController {
    static async create(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            if (req.path.startsWith("/api/")) {
                return res.status(401).json({
                    message: "Usuário não autenticado."
                });
            }

            return res.redirect("/login");
        }

        const {
            title,
            description,
            isAnonymous
        } = req.body ?? {};

        const validAnonymousValues = [
            undefined,
            true,
            false,
            "true",
            "false",
            "on"
        ];

        if (!validAnonymousValues.includes(isAnonymous)) {
            return res.status(400).json({
                message: "Opção de anonimato inválida."
            });
        }

        const anonymous =
            isAnonymous === true ||
            isAnonymous === "true" ||
            isAnonymous === "on";

        try {
            const complaintId = await ComplaintService.create(
                Number(userId),
                title,
                description,
                anonymous
            );

            if (req.path.startsWith("/api/")) {
                return res.status(201).json({
                    message: "Reclamação criada com sucesso.",
                    id: complaintId
                });
            }

            return res.redirect(303, "/complaints");
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "";

            const validationMessages = [
                "Título e descrição são obrigatórios.",
                "O título deve ter no máximo 150 caracteres.",
                "A opção de anonimato deve ser verdadeira ou falsa."
            ];

            if (validationMessages.includes(message)) {
                return res.status(400).json({ message });
            }

            console.error(error);

            return res.status(500).json({
                message: "Erro ao criar reclamação."
            });
        }
    }

    static async list(
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
            const complaints = await ComplaintService.list(
                Number(userId)
            );

            return res.json(complaints);
        } catch (error: unknown) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar reclamações."
            });
        }
    }

    static async details(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "O ID da reclamação deve ser um inteiro positivo."
            });
        }

        try {
            const complaint = await ComplaintService.details(
                id,
                Number(userId)
            );

            if (!complaint) {
                return res.status(404).json({
                    message: "Reclamação não encontrada."
                });
            }

            return res.json(complaint);
        } catch (error: unknown) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao buscar reclamação."
            });
        }
    }

    static async update(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const id = Number(req.params.id);

        const validationMessages = [
            "O ID da reclamação deve ser um inteiro positivo.",
            "Título e descrição são obrigatórios.",
            "O título deve ter no máximo 150 caracteres.",
            "A opção de anonimato deve ser verdadeira ou falsa."
        ];

        try {
            const {
                title,
                description,
                isAnonymous
            } = req.body ?? {};

            const updated = await ComplaintService.update(
                id,
                Number(userId),
                title,
                description,
                isAnonymous
            );

            if (!updated) {
                return res.status(404).json({
                    message:
                        "Reclamação não encontrada ou você não é o autor."
                });
            }

            return res.json({
                message: "Reclamação atualizada com sucesso."
            });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "";

            if (validationMessages.includes(message)) {
                return res.status(400).json({ message });
            }

            console.error(error);

            return res.status(500).json({
                message: "Erro ao atualizar reclamação."
            });
        }
    }

    static async remove(
        req: Request,
        res: Response
    ) {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "O ID da reclamação deve ser um inteiro positivo."
            });
        }

        try {
            const removed = await ComplaintService.remove(
                id,
                Number(userId)
            );

            if (!removed) {
                return res.status(404).json({
                    message:
                        "Reclamação não encontrada ou você não é o autor."
                });
            }

            return res.json({
                message: "Reclamação excluída com sucesso."
            });
        } catch (error: unknown) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao excluir reclamação."
            });
        }
    }
}
