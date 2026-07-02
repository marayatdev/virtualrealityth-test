import { Router } from "express";
import { AssetController } from "@/controllers/asset.controller";

const router = Router();
const assetController = new AssetController();

router.get("/", assetController.getAll);
router.get("/:id", assetController.getById);
router.post("/", assetController.create);

export default router;
