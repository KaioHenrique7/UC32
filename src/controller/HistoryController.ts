import { Request, Response } from "express";
import connection from "../database/connection";
import { ComplaintModel } from "../models/Complaint";
import { VotingCycleService } from "../services/VotingCycleService";

export class HistoryController {
    static async cycles(
        req: Request,
        res: Response
    ) {
        try {
            const cycles = await VotingCycleService.history();

            return res.json(cycles);
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao consultar os ciclos anteriores."
            });
        }
    }

    static async complaints(
        req: Request,
        res: Response
    ) {
        const cycleId = Number(req.params.cycleId);

        if (!Number.isSafeInteger(cycleId) || cycleId <= 0) {
            return res.status(400).json({
                message: "Ciclo inválido."
            });
        }

        try {
            const cycle = await connection.votingCycle.findUnique({
                where: {
                    id: cycleId
                }
            });

            if (!cycle || cycle.endsAt > new Date()) {
                return res.status(404).json({
                    message: "Ciclo encerrado não encontrado."
                });
            }

            const complaints =
                await ComplaintModel.findAllByCycle(
                    cycleId,
                    req.session.userId!
                );

            return res.json({
                cycle,
                complaints
            });
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao consultar o histórico."
            });
        }
    }

    static async legacy(
        req: Request,
        res: Response
    ) {
        try {
            const complaints = await connection.complaint.findMany({
                where: {
                    cycleId: null,
                    deletedAt: null
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    isAnonymous: true,
                    photoPath: true,
                    createdAt: true,
                    userId: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            return res.json(
                complaints.map((complaint) => ({
                    id: complaint.id,
                    cycle_id: null,
                    title: complaint.title,
                    description: complaint.description,
                    status: complaint.status,
                    is_anonymous: complaint.isAnonymous,
                    author_name: complaint.isAnonymous
                        ? "Anônimo"
                        : complaint.user.name,
                    is_owner:
                        complaint.userId === req.session.userId,
                        photo_path: complaint.photoPath
                        ? `/api/complaints/${complaint.id}/photo`
                        : null,
                    created_at: complaint.createdAt
                }))
            );
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao consultar reclamações antigas."
            });
        }
    }
}