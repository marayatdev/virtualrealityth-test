import { AssetService } from "@/services/asset.service";
import { Request, Response } from "express";

const service = new AssetService();

export class AssetController {
  public getAll = async (req: Request, res: Response) => {
    const assets = await service.getAllAssets();

    res.json(assets);
  };

  public getById = async (req: Request, res: Response) => {
    const asset = await service.getAssetById(req.params.id);

    if (!asset) {
      res.status(404).json({
        message: "Asset not found",
      });
      return;
    }

    res.json(asset);
  };

  public create = async (req: Request, res: Response) => {
    const asset = await service.createAsset(req.body);

    res.status(201).json(asset);
  };
}
