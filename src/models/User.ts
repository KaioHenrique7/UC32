import connection from "../database/connection";
import { User } from "../types";

export class UserModel {
    static async create(user: User): Promise<number> {
        const createdUser = await connection.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            },
            select: { id: true }
        });

        return createdUser.id;
    }

    static async findByEmail(email: string) {
        return connection.user.findUnique({
            where: { email }
        });
    }

    static async findById(id: number) {
        const user = await connection.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.createdAt
        };
    }
}
