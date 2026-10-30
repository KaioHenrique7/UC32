import { PrismaClient } from "@prisma/client";

const globalForPrisma =
    globalThis as unknown as {
        prisma?: PrismaClient;
    };

const connection =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["error", "warn"]
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = connection;
}

export default connection;
