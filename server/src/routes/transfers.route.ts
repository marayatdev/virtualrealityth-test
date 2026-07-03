import { Router } from "express";
import { TransferController } from "@/controllers/transfers.controller";

const router = Router();
const transferController = new TransferController();

router.post("/", transferController.transfer);

export default router;
