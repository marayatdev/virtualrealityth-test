import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
}

export const getUserIdFromToken = (token: string): string => {
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET || "bovhoeivfoebwfvbeifpwbqe",
  ) as JwtPayload;

  if (!payload?.id) {
    throw new Error("Unauthorized");
  }

  return payload.id;
};
