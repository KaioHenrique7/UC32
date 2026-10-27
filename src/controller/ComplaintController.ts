import { Request, Response } from "express";
import { ComplaintService } from "../services/ComplaintService";

export class ComplaintController {
    static async create(
        req: Request,
        res: Response
    ) {
        const {
            title,
            description,
            isAnonymous
        } = req.body ?? {};

        // Formulários enviam texto; JSON pode enviar booleanos.
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

        let complaintId: number;

        try {
            complaintId = await ComplaintService.create(
                req.session.userId!,
                title,
                description,
                anonymous
            );
        } catch (error) {
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

        if (req.path.startsWith("/api/")) {
            return res.status(201).json({
                message: "Reclamação criada com sucesso.",
                id: complaintId
            });
        }

        return res.redirect(303, "/complaints");
    }

    static async list(
        req: Request,
        res: Response
    ) {
        try {
            const complaints =
                await ComplaintService.list(
                    req.session.userId!
                );

            return res.json(complaints);
        } catch (error) {
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
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message:
                    "O ID da reclamação deve ser um inteiro positivo."
            });
        }

        try {
            const complaint =
                await ComplaintService.details(
                    id,
                    req.session.userId!
                );

            if (!complaint) {
                return res.status(404).json({
                    message: "Reclamação não encontrada."
                });
            }

            return res.json(complaint);
        } catch (error) {
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
                req.session.userId!,
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
        } catch (error) {
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
                req.session.userId!
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
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao excluir reclamação."
            });
        }
    }
}