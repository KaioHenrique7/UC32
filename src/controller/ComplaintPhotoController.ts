import { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import connection from "../database/connection";

const PHOTO_DIRECTORY = path.resolve(
    "uploads",
    "complaint-photos"
);

export class ComplaintPhotoController {
    static async authorize(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        try {
            const complaint = await connection.complaint.findFirst({
                where: {
                    id,
                    userId: req.session.userId!,
                    deletedAt: null
                },
                select: {
                    id: true
                }
            });

            if (!complaint) {
                return res.status(404).json({
                    message:
                        "Reclamação não encontrada ou você não é o autor."
                });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    }

    static async upload(
        req: Request,
        res: Response
    ) {
        if (!req.file) {
            return res.status(400).json({
                message: "Selecione uma foto."
            });
        }

        const id = Number(req.params.id);
        const filename = `${randomUUID()}.webp`;
        const destination = path.join(
            PHOTO_DIRECTORY,
            filename
        );

        try {
            await mkdir(PHOTO_DIRECTORY, {
                recursive: true
            });

            await writeFile(
                destination,
                req.file.buffer,
                { flag: "wx" }
            );

            const updated =
                await connection.complaint.updateMany({
                    where: {
                        id,
                        userId: req.session.userId!,
                        deletedAt: null
                    },
                    data: {
                        photoPath: filename
                    }
                });

            if (updated.count === 0) {
                await unlink(destination);

                return res.status(404).json({
                    message:
                        "Reclamação não encontrada ou você não é o autor."
                });
            }

            return res.status(201).json({
                message: "Foto anexada com sucesso.",
                photo_url: `/api/complaints/${id}/photo`
            });
        } catch (error) {
            await unlink(destination).catch(() => {});
            console.error(error);

            return res.status(500).json({
                message: "Erro ao salvar foto."
            });
        }
    }

    static async show(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        try {
            const complaint =
                await connection.complaint.findFirst({
                    where: {
                        id,
                        deletedAt: null
                    },
                    select: {
                        photoPath: true
                    }
                });

            const filename = complaint?.photoPath;

            if (
                !filename ||
                !/^[0-9a-f-]{36}\.webp$/.test(filename)
            ) {
                return res.status(404).json({
                    message: "Foto não encontrada."
                });
            }

            res.setHeader("Cache-Control", "private, no-store");
            res.setHeader("X-Content-Type-Options", "nosniff");

            return res.sendFile(
                filename,
                { root: PHOTO_DIRECTORY },
                (error) => {
                    if (error) {
                        next(error);
                    }
                }
            );
        } catch (error) {
            return next(error);
        }
    }
}