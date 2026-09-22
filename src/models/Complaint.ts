import connection from "../database/connection";
import { Complaint } from "../types";

export class ComplaintModel {

    static async create(complaint: Complaint) {
        const [result]: any = await connection.execute(
            `INSERT INTO complaints
            (user_id, title, description)
            VALUES (?, ?, ?)`,
            [
                complaint.user_id,
                complaint.title,
                complaint.description
            ]
        );

        return result.insertId;
    }

    static async findAllByUser(userId: number) {
        const [rows] = await connection.execute(
            `SELECT *
             FROM complaints
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        return rows;
    }

    static async findById(id: number, userId: number) {
        const [rows]: any = await connection.execute(
            `SELECT *
             FROM complaints
             WHERE id = ?
             AND user_id = ?`,
            [id, userId]
        );

        return rows[0] || null;
    }
}
