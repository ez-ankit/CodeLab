import jwt from "jsonwebtoken";

export function verifyToken(request) {
  const token = request.cookies.get("AuthToken")?.value;

  if (!token) {
    return { error: "Access denied", status: 401 };
  }

  try {
    const decode = jwt.verify(token, process.env.SECERT_KEY);
    return { userId: decode.userId, username: decode.username, email: decode.email };
  } catch {
    return { error: "Invalid token", status: 401 };
  }
}
