import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AuthSuccess {
  userId: string;
  username: string;
  email: string;
}

interface AuthError {
  error: string;
  status: number;
}

export type AuthResult = AuthSuccess | AuthError;

export function verifyToken(request: NextRequest): AuthResult {
  const token = request.cookies.get("AuthToken")?.value;

  if (!token) {
    return { error: "Access denied", status: 401 };
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.SECERT_KEY as string
    ) as {
      userId: string;
      username: string;
      email: string;
    };
    return {
      userId: decode.userId,
      username: decode.username,
      email: decode.email,
    };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
}
