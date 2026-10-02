import { ComplaintModel } from "../models/Complaint";

export class ComplaintService {
    static async create(
        userId: number,
        title: string,
        description: string
    ) {
        if (!title || !description) {
            throw new Error("Título e descrição são obrigatórios.");
        }

        return await ComplaintModel.create({
            user_id: userId,
            title,
            description
        });
    }

    static async list(userId: number) {
        return await ComplaintModel.findAllByUser(userId);
    }

    static async details(id: number, userId: number) {
        return await ComplaintModel.findById(id, userId);
    }
}