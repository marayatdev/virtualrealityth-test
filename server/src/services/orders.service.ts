import { pool } from "@/config/db";
import { v4 as uuidv4 } from "uuid";

export class OrderService {
  // =========================
  // WALLET SETTLEMENT (FIXED)
  // =========================
  async settleWallet(
    connection: any,
    taker: any,
    maker: any,
    amount: number,
    price: number,
  ) {
    const isBuy = taker.side === "BUY";

    const buyer = isBuy ? taker : maker;
    const seller = isBuy ? maker : taker;

    const [baseAsset, quoteAsset] = taker.asset_pair.split("_");

    const totalCost = amount * price;

    // =========================
    // 🟢 BUYER
    // =========================

    // 1. release THB (unlock + spend)
    await connection.execute(
      `
  UPDATE wallets
  SET locked_balance = locked_balance - ?
  WHERE user_id = ?
  AND asset_id = (SELECT id FROM assets WHERE symbol = ?)
`,
      [totalCost, buyer.user_id, quoteAsset],
    );

    // 2. receive BTC
    await connection.execute(
      `
  UPDATE wallets
  SET available_balance = available_balance + ?
  WHERE user_id = ?
  AND asset_id = (SELECT id FROM assets WHERE symbol = ?)
`,
      [amount, buyer.user_id, baseAsset],
    );

    // =========================
    // 🔴 SELLER
    // =========================

    // 1. release BTC lock
    await connection.execute(
      `
    UPDATE wallets
    SET locked_balance = locked_balance - ?
    WHERE user_id = ?
    AND asset_id = (SELECT id FROM assets WHERE symbol = ?)
    `,
      [
        amount,
        seller.user_id,
        baseAsset, // ❗ correct
      ],
    );

    // 2. receive THB
    await connection.execute(
      `
    UPDATE wallets
    SET available_balance = available_balance + ?
    WHERE user_id = ?
    AND asset_id = (SELECT id FROM assets WHERE symbol = ?)
    `,
      [totalCost, seller.user_id, quoteAsset],
    );
  }

  // =========================
  // EXECUTE TRADE (FIXED)
  // =========================
  async executeTrade(
    connection: any,
    takerOrder: any,
    makerOrder: any,
    amount: number,
    price: number,
  ) {
    const tradeId = uuidv4();

    const buyOrder = takerOrder.side === "BUY" ? takerOrder : makerOrder;
    const sellOrder = takerOrder.side === "SELL" ? takerOrder : makerOrder;

    // 1. insert trade
    await connection.execute(
      `
      INSERT INTO trades (
        id, buy_order_id, sell_order_id,
        price, amount, fee
      )
      VALUES (?, ?, ?, ?, ?, 0)
      `,
      [tradeId, buyOrder.id, sellOrder.id, price, amount],
    );

    // 2. update orders (FIXED remaining logic)
    await connection.execute(
      `
      UPDATE orders
      SET filled_amount = filled_amount + ?,
          status = CASE
            WHEN filled_amount + ? >= original_amount THEN 'FILLED'
            ELSE 'PARTIAL'
          END
      WHERE id = ?
      `,
      [amount, amount, takerOrder.id],
    );

    await connection.execute(
      `
      UPDATE orders
      SET filled_amount = filled_amount + ?,
          status = CASE
            WHEN filled_amount + ? >= original_amount THEN 'FILLED'
            ELSE 'PARTIAL'
          END
      WHERE id = ?
      `,
      [amount, amount, makerOrder.id],
    );

    // 3. wallet settlement
    await this.settleWallet(connection, takerOrder, makerOrder, amount, price);

    return tradeId;
  }

  // =========================
  // MATCH ORDER (FIXED)
  // =========================
  async matchOrder(connection: any, order: any) {
    const isBuy = order.side === "BUY";
    const oppositeSide = isBuy ? "SELL" : "BUY";
    const priceCondition = isBuy ? "<=" : ">=";

    const [matches]: any = await connection.execute(
      `
      SELECT *
      FROM orders
      WHERE asset_pair = ?
      AND side = ?
      AND status IN ('OPEN','PARTIAL')
      AND price ${priceCondition} ?
      ORDER BY price ${isBuy ? "ASC" : "DESC"}, created_at ASC
      LIMIT 1
      FOR UPDATE
      `,
      [order.asset_pair, oppositeSide, order.price],
    );

    const match = matches[0];

    if (!match) {
      return { matched: false };
    }

    // FIXED remaining calculation
    const takerRemaining = order.original_amount - (order.filled_amount || 0);
    const makerRemaining = match.original_amount - (match.filled_amount || 0);

    const tradeAmount = Math.min(takerRemaining, makerRemaining);

    await this.executeTrade(connection, order, match, tradeAmount, match.price);

    return { matched: true };
  }

  // =========================
  // CREATE ORDER (FIXED)
  // =========================
  async createOrder(
    userId: string,
    assetPair: string,
    side: "BUY" | "SELL",
    price: number,
    amount: number,
  ) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [baseAsset, quoteAsset] = assetPair.split("_");

      const assetSymbol = side === "BUY" ? quoteAsset : baseAsset;

      // lock wallet
      const [walletRows]: any = await connection.execute(
        `
        SELECT *
        FROM wallets
        WHERE user_id = ?
        AND asset_id = (SELECT id FROM assets WHERE symbol = ?)
        FOR UPDATE
        `,
        [userId, assetSymbol],
      );

      const wallet = walletRows[0];

      if (!wallet) throw new Error("Wallet not found");

      const cost = side === "BUY" ? price * amount : amount;

      if (Number(wallet.available_balance) < cost) {
        throw new Error("Insufficient balance");
      }

      // move to locked
      await connection.execute(
        `
        UPDATE wallets
        SET available_balance = available_balance - ?,
            locked_balance = locked_balance + ?
        WHERE id = ?
        `,
        [cost, cost, wallet.id],
      );

      const orderId = uuidv4();

      const order = {
        id: orderId,
        user_id: userId,
        asset_pair: assetPair,
        side,
        price,
        original_amount: amount,
        filled_amount: 0,
      };

      await connection.execute(
        `
        INSERT INTO orders (
          id, user_id, asset_pair, side,
          price, original_amount, filled_amount, status
        )
        VALUES (?, ?, ?, ?, ?, ?, 0, 'OPEN')
        `,
        [
          order.id,
          order.user_id,
          order.asset_pair,
          order.side,
          order.price,
          order.original_amount,
        ],
      );

      const result = await this.matchOrder(connection, order);

      await connection.commit();

      return {
        message: "Order created",
        orderId,
        matched: result?.matched || false,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}
