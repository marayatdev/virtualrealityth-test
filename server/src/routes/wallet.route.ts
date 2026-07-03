import { WalletController } from "@/controllers/wallet.controller";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();
const walletController = new WalletController();

router.get("/", authMiddleware, walletController.getAllWallets);
router.get("/:assetId", authMiddleware, walletController.getWalletById);

router.post("/deposit", authMiddleware, walletController.deposit);
router.post("/withdraw", authMiddleware, walletController.withdraw);

export default router;
