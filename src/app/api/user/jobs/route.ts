import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
//   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "User Not logged in" }, { status: 401 });
  }
  try {
    const jobs = await prisma.job.findMany({
      where: { postedById: session.user.id },
    });
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error:unknown) {
    console.log(error.message? error.message : "Error occure during fetching jobs");
    return NextResponse.json({ error }, { status: 500 });
  }
}
