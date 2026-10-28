import { Router } from "express";

import { ComplaintController } from "../controller/ComplaintController";
import { VoteController } from "../controller/VoteController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { HistoryController } from "../controller/HistoryController";
import { ComplaintPhotoController } from "../controller/ComplaintPhotoController";
import { complaintPhotoUpload } from "../middlewares/complaintPhotoUpload";

const router = Router();

router.post(
    "/api/complaints",
    authMiddleware,
    ComplaintController.create
);

router.post(
    "/complaints",
    authMiddleware,
    ComplaintController.create
);

router.get(
    "/api/complaints",
    authMiddleware,
    ComplaintController.list
);

router.get(
    "/api/complaints/:id",
    authMiddleware,
    ComplaintController.details
);

router.post(
    "/api/complaints/:id/vote",
    authMiddleware,
    VoteController.create
);

router.get(
    "/api/votes/current",
    authMiddleware,
    VoteController.current
);

router.put(
    "/api/complaints/:id",
    authMiddleware,
    ComplaintController.update
);

router.delete(
    "/api/complaints/:id",
    authMiddleware,
    ComplaintController.remove
);

router.get(
    "/api/history/cycles",
    authMiddleware,
    HistoryController.cycles
);

router.get(
    "/api/history/cycles/:cycleId/complaints",
    authMiddleware,
    HistoryController.complaints
);

router.get(
    "/api/history/legacy",
    authMiddleware,
    HistoryController.legacy
);

router.post(
    "/api/complaints/:id/photo",
    authMiddleware,
    ComplaintPhotoController.authorize,
    complaintPhotoUpload,
    ComplaintPhotoController.upload
);

router.get(
    "/api/complaints/:id/photo",
    authMiddleware,
    ComplaintPhotoController.show
);

export default router;