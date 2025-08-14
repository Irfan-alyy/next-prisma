import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
//   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "User Not logged in" }, { status: 401 });
  }
  try {
    const applications = await prisma.application.findMany({
      where: { userId: session.user.id }, include:{job:true}
    });
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error }, { status: 500 });
  }
}
