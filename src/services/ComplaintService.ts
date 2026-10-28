
import { ComplaintModel } from "../models/Complaint";
import { VotingCycleService } from "./VotingCycleService";

export class ComplaintService {
    static async create(
        userId: number,
        title: string,
        description: string,
        isAnonymous: boolean = false
    ) {
        if (!title || !title.trim()) {
            throw new Error("O título é obrigatório.");
        }

        if (!description || !description.trim()) {
            throw new Error("A descrição é obrigatória.");
        }

        if (title.trim().length > 150) {
            throw new Error(
                "O título deve ter no máximo 150 caracteres."
            );
        }

        return await ComplaintModel.create({
            user_id: userId,
            title: title.trim(),
            description: description.trim()
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
}
