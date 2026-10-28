import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
        fields: 5,
        parts: 6
    }
}).single("photo");

export function complaintPhotoUpload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    upload(req, res, (error: unknown) => {
        if (error) {
            const tooLarge =
                error instanceof multer.MulterError &&
                error.code === "LIMIT_FILE_SIZE";

            res.status(tooLarge ? 413 : 400).json({
                message: tooLarge
                    ? "A foto deve ter no máximo 5 MB."
                    : "Envie somente uma foto no campo photo."
            });

            return;
        }

        void processPhoto(req, res, next);
    });
}

async function processPhoto(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.file) {
        res.status(400).json({
            message: "Selecione uma foto."
        });

        return;
    }

    try {
        const options = {
            limitInputPixels: 25_000_000,
            failOn: "warning" as const
        };

        const metadata = await sharp(
            req.file.buffer,
            options
        ).metadata();

        const allowedFormats = ["jpeg", "png", "webp"];

        if (
            !metadata.format ||
            !allowedFormats.includes(metadata.format) ||
            (metadata.pages ?? 1) > 1
        ) {
            res.status(400).json({
                message:
                    "Envie uma imagem estática JPEG, PNG ou WebP."
            });

            return;
        }

        const buffer = await sharp(req.file.buffer, options)
            .rotate()
            .resize({
                width: 1600,
                height: 1600,
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toBuffer();

        req.file.buffer = buffer;
        req.file.mimetype = "image/webp";
        req.file.size = buffer.length;
    } catch {
        res.status(400).json({
            message:
                "Imagem inválida, danificada ou com dimensões excessivas."
        });

        return;
    }

    next();
}