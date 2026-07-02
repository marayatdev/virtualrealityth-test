export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: "FIAT" | "CRYPTO";
  precision_places: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAsset {
  symbol: string;
  name: string;
  type: "FIAT" | "CRYPTO";
  precision_places?: number;
}
