import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/src/lib/db";
import User from "@/src/lib/models/user";

const passwordValidater = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export async function POST(request) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    if (!username) {
      return NextResponse.json({ message: "Username Required" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ message: "Email Required" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password Required" }, { status: 400 });
    }

    if (!passwordValidater(password)) {
      return NextResponse.json(
        { message: "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with given email Id" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: userData._id, username, email },
      process.env.SECERT_KEY,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
      {
        userId: userData._id,
        username: userData.username,
        email: userData.email,
        AuthToken: token,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "Unable to register user", error: err.message }, { status: 500 });
  }
}
