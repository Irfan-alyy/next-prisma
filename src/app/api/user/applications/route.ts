import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  //   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User Not logged in" },
      { status: 401 }
    );
  }
  try {
    let applications;
    if (session.user.type === "admin") {
      applications = await prisma.application.findMany({
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
      });
    } else {
      applications = await prisma.application.findMany({
        where: { userId: session.user.id },
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
      });
    }
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error: unknown) {
    console.log(
      error.message
        ? error.message
        : "Error occure during fetching applications"
    );
    return NextResponse.json({ error }, { status: 500 });
  }
}
