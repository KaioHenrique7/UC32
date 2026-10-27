import { ComplaintModel } from "../models/Complaint";
import { VotingCycleService } from "./VotingCycleService";

export class ComplaintService {
    static async create(
        userId: number,
        title: string,
        description: string,
        isAnonymous: boolean = false
    ) {
        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            !title.trim() ||
            !description.trim()
        ) {
            throw new Error(
                "Título e descrição são obrigatórios."
            );
        }

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (cleanTitle.length > 150) {
            throw new Error(
                "O título deve ter no máximo 150 caracteres."
            );
        }

        if (typeof isAnonymous !== "boolean") {
            throw new Error(
                "A opção de anonimato deve ser verdadeira ou falsa."
            );
        }

        const cycle = await VotingCycleService.current();

        return await ComplaintModel.create({
            user_id: userId,
            title: cleanTitle,
            description: cleanDescription,
            cycleId: cycle.id,
            isAnonymous
        });
    }

    static async list(userId: number) {
        const cycle = await VotingCycleService.current();

        return await ComplaintModel.findAllByCycle(
            cycle.id,
            userId
        );
    }

    static async details(
        id: number,
        userId: number
    ) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new Error(
                "O ID da reclamação deve ser um inteiro positivo."
            );
        }

        return await ComplaintModel.findById(id, userId);
    }

    static async update(
        id: number,
        userId: number,
        title: string,
        description: string,
        isAnonymous: boolean
    ) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new Error(
                "O ID da reclamação deve ser um inteiro positivo."
            );
        }

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            !title.trim() ||
            !description.trim()
        ) {
            throw new Error(
                "Título e descrição são obrigatórios."
            );
        }

        if (title.trim().length > 150) {
            throw new Error(
                "O título deve ter no máximo 150 caracteres."
            );
        }

        if (typeof isAnonymous !== "boolean") {
            throw new Error(
                "A opção de anonimato deve ser verdadeira ou falsa."
            );
        }

        return await ComplaintModel.updateByAuthor(
            id,
            userId,
            {
                title: title.trim(),
                description: description.trim(),
                isAnonymous
            }
        );
    }

    static async remove(
        id: number,
        userId: number
    ) {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new Error(
                "O ID da reclamação deve ser um inteiro positivo."
            );
        }

        return await ComplaintModel.deleteByAuthor(
            id,
            userId
        );
    }
}