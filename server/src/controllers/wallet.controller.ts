import { Request, Response } from "express";
import { logger } from "@/utils/logger";
import { WalletService } from "@/services/wallets.service";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "@/utils/jwt";
export class WalletController {
  private WalletService: WalletService;

  constructor() {
    this.WalletService = new WalletService();
  }

  public getAllWallets = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }

      const userId = getUserIdFromToken(token);

      const wallets = await this.WalletService.getAllWallets(userId);

      res.json(wallets);
      return;
    } catch (err) {
      logger.error("Get all wallets failed:", err);
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }
  };

  public getWalletById = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;
      const assetId = req.params.assetId;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }

      const userId = getUserIdFromToken(token);

      const wallet = await this.WalletService.getWalletByAssetId(
        userId,
        assetId,
      );
      res.json(wallet);
      return;
    } catch (err) {
      logger.error("Get wallet by ID failed:", err);
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }
  };

  public deposit = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;
      const { assetId, amount } = req.body;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }

      const userId = getUserIdFromToken(token);

      logger.info(
        `Deposit request: userId=${userId}, assetId=${assetId}, amount=${amount}`,
      );

      const result = await this.WalletService.deposit(userId, assetId, amount);

      res.json(result);
      return;
    } catch (err) {
      logger.error("Deposit failed:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  public withdraw = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;
      const { assetId, amount, address } = req.body;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }

      const userId = getUserIdFromToken(token);

      const result = await this.WalletService.withdraw(
        userId,
        assetId,
        amount,
        address,
      );

      res.json(result);
      return;
    } catch (err) {
      logger.error("Withdraw failed:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };
}
