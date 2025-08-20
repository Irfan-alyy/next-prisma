import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
//   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "User not logged in" }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error:any) {
    console.log(error.message? error.message : "Error occure during fetching user data");
    return NextResponse.json({ error }, { status: 500 });
  }
}
