import connection from "../database/connection";
import { User } from "../types";

export class UserModel {

    static async create(user: User) {
        const [result]: any = await connection.execute(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [user.name, user.email, user.password]
        );

        return result.insertId;
    }

    static async findByEmail(email: string) {
        const [rows]: any = await connection.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        return rows[0] || null;
    }

    static async findById(id: number) {
        const [rows]: any = await connection.execute(
            `SELECT id, name, email, created_at
             FROM users
             WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    }
}
