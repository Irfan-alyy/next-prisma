import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // console.log(id);
  try {
    const data = await prisma.job.findUnique({
      where: { id },
      include: { postedBy: true },
    });
    if (data) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.job.delete({ where: { id } });
    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error?.code === "P2025")
        return NextResponse.json(
          { message: `No job found with id '${id}'`, error },
          { status: 404 }
        );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  try {
    await prisma.job.update({ where: { id }, data });
    return NextResponse.json({ message: "Job Updated successfully" });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error?.code === "P2025")
        return NextResponse.json(
          { message: `No job found with ${id} id`, error },
          { status: 404 }
        );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
