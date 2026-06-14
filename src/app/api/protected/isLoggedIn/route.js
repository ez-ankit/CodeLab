import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/middleware/auth";

export async function GET(request) {
  const auth = verifyToken(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  return NextResponse.json({ login: true, message: "User Logged In" }, { status: 200 });
}
