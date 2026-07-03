import { AssetService } from "@/services/asset.service";
import { Request, Response } from "express";

export class AssetController {
  private AssetService: AssetService;
  constructor() {
    this.AssetService = new AssetService();
  }
  public getAll = async (req: Request, res: Response) => {
    const assets = await this.AssetService.getAllAssets();

    res.json(assets);
  };

  public getById = async (req: Request, res: Response) => {
    const asset = await this.AssetService.getAssetById(req.params.id);

    if (!asset) {
      res.status(404).json({
        message: "Asset not found",
      });
      return;
    }

    res.json(asset);
  };

  public create = async (req: Request, res: Response) => {
    const asset = await this.AssetService.createAsset(req.body);

    res.status(201).json(asset);
  };
}
