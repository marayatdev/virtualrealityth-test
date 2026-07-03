import { AssetService } from "@/services/asset.service";
import { TransferService } from "@/services/transfers.service";
import { getUserIdFromToken } from "@/utils/jwt";
import { logger } from "@/utils/logger";
import { Request, Response } from "express";

export class TransferController {
  private TransferService: TransferService;
  constructor() {
    this.TransferService = new TransferService();
  }

  public transfer = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }

      const senderId = getUserIdFromToken(token);

      const { receiverEmail, assetId, amount } = req.body;

      console.log("Transfer request:", {
        senderId,
        receiverEmail,
        assetId,
        amount,
      });

      if (!receiverEmail || !assetId || amount === undefined) {
        res.status(400).json({
          message: "receiverEmail, assetId and amount are required",
        });
        return;
      }

      if (Number(amount) <= 0) {
        res.status(400).json({
          message: "Amount must be greater than 0",
        });
        return;
      }

      const result = await this.TransferService.transfer(
        senderId,
        receiverEmail,
        assetId,
        Number(amount),
      );

      res.status(200).json(result);
      return;
    } catch (err: any) {
      logger.error(err);
      res.status(400).json({
        message: err.message,
      });
      return;
    }
  };
}
