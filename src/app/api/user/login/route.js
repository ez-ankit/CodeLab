import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/src/lib/db";
import User from "@/src/lib/models/user";

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email Required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password Required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Authentication failed: Wrong Password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email },
      process.env.SECERT_KEY,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        AuthToken: token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Unable to authenticate user", error: err.message }, { status: 500 });
  }
}
