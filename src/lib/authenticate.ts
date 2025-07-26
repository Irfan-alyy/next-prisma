import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET as string;


export default function authenticate(req:NextRequest){
    const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }
  const token = authHeader.startsWith("Bearer")
    ? authHeader.replace("Bearer ", "")
    : authHeader;
  if (!token) {
    return NextResponse.json(
      { error: "Invalid token format" },
      { status: 401 }
    );
  }
  try {
      const decoded=jwt.verify(token, JWT_SECRET)
      return decoded
  } catch (err) {
      return NextResponse.json({message:"Invalid token or token expired",err})
  }
}