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
    const jobs = await prisma.job.findMany({
      where: { postedById: session.user.id },
    });
    console.log(jobs);
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error }, { status: 500 });
  }
}
