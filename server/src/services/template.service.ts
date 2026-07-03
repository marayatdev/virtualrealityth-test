// import { pool } from "@/config/db";
// import { CreateAsset } from "@/models/asset.model";
// import { v4 as uuid } from "uuid";

// export class AssetService {
//   async getAllAssets() {
//     const [rows] = await pool.query(`SELECT * FROM assets`);

//     return rows;
//   }

//   async getAssetById(id: string) {
//     const [rows]: any = await pool.query(`SELECT * FROM assets WHERE id = ?`, [
//       id,
//     ]);

//     return rows[0];
//   }
// }
