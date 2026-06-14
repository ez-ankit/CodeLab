import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/middleware/auth";

export async function GET(request) {
  const auth = verifyToken(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.cookies.set("AuthToken", "", { maxAge: 0, path: "/" });

  return response;
}
