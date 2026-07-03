import { OrderService } from "@/services/orders.service";
import { getUserIdFromToken } from "@/utils/jwt";
import { Request, Response } from "express";

export class OrderController {
  private OrderService: OrderService;
  constructor() {
    this.OrderService = new OrderService();
  }

  public createOrder = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.accessToken;
      const { assetPair, side, price, amount } = req.body;

      if (!token) {
        res.status(401).json({ message: "No access token" });
        return;
      }
      const userId = getUserIdFromToken(token);

      const result = await this.OrderService.createOrder(
        userId,
        assetPair,
        side,
        Number(price),
        Number(amount),
      );

      res.json(result);
      return;
    } catch (err: any) {
      res.status(400).json({
        message: err.message,
      });
      return;
    }
  };
}
