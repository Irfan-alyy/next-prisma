import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  //   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User Not logged in" },
      { status: 401 }
    );
  }
  const params = req.nextUrl.searchParams;
  const page = params.get("page");
  const pageSize = params.get("pageSize");
  const status = params.get("type");
  console.log(page, pageSize);
  let statusFilter={};
  if (status?.toLowerCase() === "pending") {
    statusFilter = {
      OR: [
        { status: { contains: "REVIEW", mode: "insensitive" } },
        { status: { contains: "PENDING", mode: "insensitive" } },
      ],
    };
  } 
  else if(status==="all" || !status){
   statusFilter={
    status:{contains:""}
   }
  }
  else {
    statusFilter = {
      status: {
        equals: status as string,
        mode: "insensitive",
      },
    };
  }

  try {
    let applications;
    let count;
    if (session.user.type === "admin") {
      count = await prisma.application.count({
        where: {
          ...statusFilter,
        },
      });
      applications = await prisma.application.findMany({
        where: {
          ...statusFilter
        },
        select: {
          id: true,
          appliedAt: true,
          description: true,
          resume: true,
          status: true,
          job: {
            select: {
              company: true,
              id: true,
              title: true,
            },
          },
          applicant: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        skip:
          page && pageSize
            ? (parseInt(page as string) - 1) * parseInt(pageSize as string)
            : 0,
        take: pageSize ? parseInt(pageSize) : undefined,
      });
    } else {
      count = await prisma.application.count({
        where: {
          userId: session.user.id,
          status: {
            contains:
              status === "all"
                ? ""
                : status == "pending"
                ? "REVIEW PENDING"
                : status == "accepted"
                ? "ACCEPTED"
                : "REJECTED",
          },
        },
      });
      applications = await prisma.application.findMany({
        where: {
          userId: session.user.id,
          status: {
            contains:
              status === "all"
                ? ""
                : status == "pending"
                ? "PENDING REVIEW"
                : status == "accepted"
                ? "ACCEPTED"
                : "REJECTED",
          },
        },
        select: {
          id: true,
          appliedAt: true,
          description: true,
          resume: true,
          status: true,
          job: {
            select: {
              company: true,
              id: true,
              title: true,
            },
          },
          applicant: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        skip:
          page && pageSize
            ? (parseInt(page as string) - 1) * parseInt(pageSize as string)
            : 0,
        take: pageSize ? parseInt(pageSize) : undefined,
      });
    }
    return NextResponse.json(
      {
        applications,
        totalPages: Math.ceil(count / parseInt(pageSize as string)),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if(error instanceof Error){
      console.log(
        error.message
        ? error.message
        : "Error occure during fetching applications"
      );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
