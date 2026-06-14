import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/db";
import User from "@/src/lib/models/user";
import { verifyToken } from "@/src/lib/middleware/auth";

export async function POST(request) {
  try {
    const auth = verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();

    const { roomId } = await request.json();
    if (!roomId) {
      return NextResponse.json({ error: "Room Id is required" }, { status: 400 });
    }

    const user = await User.findById(auth.userId);
    user.rooms.push(roomId);
    await user.save();

    return NextResponse.json({ message: "Room added successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
