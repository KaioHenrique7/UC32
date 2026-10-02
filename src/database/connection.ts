import { PrismaClient } from "@prisma/client";

/**
 * Mantém uma única instância do Prisma Client durante o processo.
 * Em desenvolvimento, o singleton também evita várias conexões quando o
 * processo é recarregado por ferramentas como ts-node-dev.
 */
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["warn", "error"]
            : ["error"]
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
