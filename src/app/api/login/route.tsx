import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.email || !data.password) {
    return NextResponse.json("All Feilds required to create a Account");
  }
  try {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    let isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!user || !isPasswordCorrect) {
      return NextResponse.json(`Invalid credentials`, { status: 401 });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return NextResponse.json({ message: "User logedIn Successfully", token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error occured creating user", err });
  }
}
