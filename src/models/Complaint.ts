import connection from "../database/connection";
import { Complaint } from "../types";

function toComplaintShape(complaint: {
    id: number;
    userId: number;
    title: string;
    description: string;
    status: "aberta" | "em_analise" | "resolvida";
    createdAt: Date;
}) {
    return {
        id: complaint.id,
        user_id: complaint.userId,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        created_at: complaint.createdAt
    };
}

export class ComplaintModel {
    static async create(complaint: Complaint): Promise<number> {
        const createdComplaint = await connection.complaint.create({
            data: {
                userId: complaint.user_id,
                title: complaint.title,
                description: complaint.description
            },
            select: { id: true }
        });

        return createdComplaint.id;
    }

    static async findAllByUser(userId: number) {
        const complaints = await connection.complaint.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        return complaints.map(toComplaintShape);
    }

    static async findById(id: number, userId: number) {
        const complaint = await connection.complaint.findFirst({
            where: { id, userId }
        });

        return complaint ? toComplaintShape(complaint) : null;
    }
}
