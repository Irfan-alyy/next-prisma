import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


interface Params{ 
  page?: string | undefined
  pageSize?: string | undefined
}

export async function GET(req:NextRequest){
  const session = await auth();
  const params= req.nextUrl.searchParams
  const page= params.get("page")
  const pageSize=params.get("pageSize")
  console.log(page,pageSize);
    // console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User Not logged in" },
      { status: 401 }
    );
  }
  try {
    let jobs;
    if (session.user.type === "admin") {
      jobs = await prisma.job.findMany({
        skip:
          page && pageSize
            ? (parseInt(page as string)-1 ) * parseInt(pageSize as string)
            : 0,
        take: pageSize ? parseInt(pageSize) : undefined,
      });
    } else {
      jobs = await prisma.job.findMany({
        where: { postedById: session.user.id },
        skip:
          page && pageSize
            ? parseInt(page as string) * parseInt(pageSize as string)
            : 0,
        take: pageSize ? parseInt(pageSize) : undefined,
      });
    }
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error: unknown) {
    console.log(
      error.message ? error.message : "Error occure during fetching jobs"
    );
    return NextResponse.json(error, { status: 500 });
  }
}
