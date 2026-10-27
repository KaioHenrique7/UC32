import { Prisma } from "@prisma/client";
import connection from "../database/connection";
import { VotingCycleService } from "./VotingCycleService";

export class VoteService {
    static async create(
        userId: number,
        complaintId: number
    ) {
        if (
            !Number.isSafeInteger(complaintId) ||
            complaintId <= 0
        ) {
            throw new Error(
                "O ID da reclamação deve ser um inteiro positivo."
            );
        }

        const cycle = await VotingCycleService.current();

        try {
            return await connection.$transaction(
                async (transaction) => {
                    // Mantém a reclamação bloqueada durante o voto,
                    // evitando conflito com sua exclusão.
                    await transaction.$queryRaw`
                        SELECT id
                        FROM complaints
                        WHERE id = ${complaintId}
                        FOR UPDATE
                    `;

                    const complaint =
                        await transaction.complaint.findFirst({
                            where: {
                                id: complaintId,
                                cycleId: cycle.id,
                                deletedAt: null
                            },
                            select: {
                                id: true
                            }
                        });

                    if (!complaint) {
                        throw new Error(
                            "Reclamação indisponível para votação."
                        );
                    }

                    const now = new Date();

                    if (
                        now < cycle.startsAt ||
                        now >= cycle.endsAt
                    ) {
                        throw new Error(
                            "Este ciclo foi encerrado. Atualize a página."
                        );
                    }

                    const vote = await transaction.vote.create({
                        data: {
                            userId,
                            complaintId,
                            cycleId: cycle.id
                        },
                        select: {
                            id: true,
                            complaintId: true,
                            cycleId: true,
                            createdAt: true
                        }
                    });

                    return {
                        message: "Voto registrado com sucesso.",
                        vote
                    };
                }
            );
        } catch (error) {
            if (
                error instanceof
                    Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new Error(
                    "Você já votou neste ciclo. O voto não pode ser retirado ou trocado."
                );
            }

            throw error;
        }
    }

    static async current(userId: number) {
        const cycle = await VotingCycleService.current();

        const vote = await connection.vote.findUnique({
            where: {
                userId_cycleId: {
                    userId,
                    cycleId: cycle.id
                }
            },
            select: {
                complaintId: true,
                createdAt: true
            }
        });

        return {
            cycle,
            has_voted: vote !== null,
            vote
        };
    }
}