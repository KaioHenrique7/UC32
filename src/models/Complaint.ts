import connection from "../database/connection";
import {
    Complaint,
    ComplaintStatus
} from "../types";

type ComplaintDatabase = {
    id: number;
    userId: number;
    title: string;
    description: string;
    status:
        | "aberta"
        | "em_analise"
        | "resolvida";
    createdAt: Date;
};

function toComplaintShape(
    complaint: ComplaintDatabase
) {
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
    static async create(
        complaint: Complaint
    ): Promise<number> {
        const createdComplaint =
            await connection.complaint.create({
                data: {
                    userId: complaint.user_id,
                    title: complaint.title,
                    description: complaint.description
                },
                select: {
                    id: true
                }
            });

        return createdComplaint.id;
    }

    static async findAllByUser(
        userId: number
    ) {
        const complaints =
            await connection.complaint.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

        return complaints.map(
            toComplaintShape
        );
    }

    static async findById(
        id: number,
        userId: number
    ) {
        const complaint =
            await connection.complaint.findFirst({
                where: {
                    id,
                    userId
                }
            });

        if (!complaint) {
            return null;
        }

        return toComplaintShape(complaint);
    }

    static async updateStatus(
        id: number,
        userId: number,
        status: ComplaintStatus
    ) {
        await connection.complaint.updateMany({
            where: {
                id,
                userId
            },
            data: {
                status
            }
        });

        const updatedComplaint =
            await connection.complaint.findFirst({
                where: {
                    id,
                    userId
                }
            });

        if (!updatedComplaint) {
            return null;
        }

        return toComplaintShape(
            updatedComplaint
        );
    }

    static async delete(
        id: number,
        userId: number
    ) {
        await connection.complaint.deleteMany({
            where: {
                id,
                userId
            }
        });
    }
}
