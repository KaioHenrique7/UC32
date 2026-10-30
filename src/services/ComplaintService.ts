import { ComplaintModel } from "../models/Complaint";
import { ComplaintStatus } from "../types";

const validStatuses: ComplaintStatus[] = [
    "aberta",
    "em_analise",
    "resolvida"
];

export class ComplaintService {
    static async create(
        userId: number,
        title: string,
        description: string
    ) {
        if (
            !title ||
            !title.trim() ||
            !description ||
            !description.trim()
        ) {
            throw new Error(
                "Título e descrição são obrigatórios."
            );
        }

        return ComplaintModel.create({
            user_id: userId,
            title: title.trim(),
            description: description.trim()
        });
    }

    static async listByUser(
        userId: number
    ) {
        return ComplaintModel.findAllByUser(
            userId
        );
    }

    static async findById(
        id: number,
        userId: number
    ) {
        const complaint =
            await ComplaintModel.findById(
                id,
                userId
            );

        if (!complaint) {
            throw new Error(
                "Reclamação não encontrada."
            );
        }

        return complaint;
    }

    static async updateStatus(
        id: number,
        userId: number,
        status: string
    ) {
        if (
            !validStatuses.includes(
                status as ComplaintStatus
            )
        ) {
            throw new Error(
                "Status inválido."
            );
        }

        await this.findById(id, userId);

        return ComplaintModel.updateStatus(
            id,
            userId,
            status as ComplaintStatus
        );
    }

    static async remove(
        id: number,
        userId: number
    ) {
        await this.findById(id, userId);

        await ComplaintModel.delete(
            id,
            userId
        );
    }
}
