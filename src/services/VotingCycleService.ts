import connection from "../database/connection";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CYCLE_DURATION = 14 * DAY_IN_MS;

// Referência fixa: segunda-feira, no horário de Brasília.
const FIRST_CYCLE_START =
    Date.parse("2026-10-26T00:00:00-03:00");

export class VotingCycleService {
    static async current() {
        const now = Date.now();

        const cycleNumber = Math.floor(
            (now - FIRST_CYCLE_START) / CYCLE_DURATION
        );

        const startsAt = new Date(
            FIRST_CYCLE_START +
            cycleNumber * CYCLE_DURATION
        );

        const endsAt = new Date(
            startsAt.getTime() + CYCLE_DURATION
        );

        return await connection.votingCycle.upsert({
            where: {
                startsAt
            },
            update: {},
            create: {
                startsAt,
                endsAt
            }
        });
    }

    static async history() {
        return await connection.votingCycle.findMany({
            where: {
                endsAt: {
                    lte: new Date()
                }
            },
            orderBy: {
                startsAt: "desc"
            }
        });
    }
}