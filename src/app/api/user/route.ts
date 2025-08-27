import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session= await auth();

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

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type,name }:{type:string,name:string} = await request.json();
  if (!['candidate', 'employer'].includes(type)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  console.log(name);
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: name? { type, name: name.trim() || undefined }:{type},
  });
  return NextResponse.json(user);
}
