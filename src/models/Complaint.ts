import connection from "../database/connection";
import { Complaint } from "../types";

type ComplaintInput = Complaint & {
    cycleId?: number;
    isAnonymous?: boolean;
    photoPath?: string | null;
};

const publicInclude = {
    user: {
        select: {
            name: true
        }
    },
    _count: {
        select: {
            votes: true
        }
    }
} as const;

type ComplaintRecord = {
    id: number;
    userId: number;
    cycleId: number | null;
    title: string;
    description: string;
    status: "aberta" | "em_analise" | "resolvida";
    isAnonymous: boolean;
    photoPath: string | null;
    createdAt: Date;
    user: {
        name: string;
    };
    _count: {
        votes: number;
    };
};

function toComplaintShape(
    complaint: ComplaintRecord,
    viewerId: number
) {
    return {
        id: complaint.id,
        cycle_id: complaint.cycleId,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        is_anonymous: complaint.isAnonymous,
        author_name: complaint.isAnonymous
            ? "Anônimo"
            : complaint.user.name,
        is_owner: complaint.userId === viewerId,
        photo_path: complaint.photoPath,
        votes_count: complaint._count.votes,
        created_at: complaint.createdAt
    };
}

export class ComplaintModel {
    static async create(
        complaint: ComplaintInput
    ): Promise<number> {
        const created = await connection.complaint.create({
            data: {
                userId: complaint.user_id,
                title: complaint.title,
                description: complaint.description,
                cycleId: complaint.cycleId,
                isAnonymous: complaint.isAnonymous ?? false,
                photoPath: complaint.photoPath ?? null
            },
            select: {
                id: true
            }
        });

        return created.id;
    }

    static async findAllByUser(userId: number) {
        const complaints = await connection.complaint.findMany({
            where: {
                userId,
                deletedAt: null
            },
            include: publicInclude,
            orderBy: {
                createdAt: "desc"
            }
        });

        return complaints.map((complaint) =>
            toComplaintShape(complaint, userId)
        );
    }

    static async findAllByCycle(
        cycleId: number,
        viewerId: number
    ) {
        const complaints = await connection.complaint.findMany({
            where: {
                cycleId,
                deletedAt: null
            },
            include: publicInclude,
            orderBy: [
                {
                    votes: {
                        _count: "desc"
                    }
                },
                {
                    createdAt: "desc"
                },
                {
                    id: "desc"
                }
            ]
        });

        return complaints.map((complaint) =>
            toComplaintShape(complaint, viewerId)
        );
    }

    static async findById(
        id: number,
        viewerId: number
    ) {
        const complaint = await connection.complaint.findFirst({
            where: {
                id,
                deletedAt: null
            },
            include: publicInclude
        });

        return complaint
            ? toComplaintShape(complaint, viewerId)
            : null;
    }

    static async updateByAuthor(
        id: number,
        userId: number,
        data: {
            title: string;
            description: string;
            isAnonymous: boolean;
        }
    ) {
        const result = await connection.complaint.updateMany({
            where: {
                id,
                userId,
                deletedAt: null
            },
            data: {
                title: data.title,
                description: data.description,
                isAnonymous: data.isAnonymous
            }
        });

        return result.count > 0;
    }

    static async deleteByAuthor(
        id: number,
        userId: number
    ) {
        const result = await connection.complaint.updateMany({
            where: {
                id,
                userId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return result.count > 0;
    }
}