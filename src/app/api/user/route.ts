import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import {v4 as uuidv4} from "uuid"

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
  const formData = await request.formData();
  const type = formData.get('type') as string;
  const name = formData.get('name') as string | null;
  const imageFile = formData.get('image') as File | null;
  console.log(type,name,imageFile);
  if (!['candidate', 'employer'].includes(type)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updateData={
    type:type,
    name: name?.trim() || undefined,
    image: imageFile && ""
  }


  return NextResponse.json("wait")
  const user = await prisma.user.update({
    where: { id: session?.user?.id },
    data: name? { type, name: name.trim() || undefined }:{type},
  });
  return NextResponse.json(user);
}


const saveImage=async(file: File, userId:string)=>{
const uploadDir= join(process.cwd(),"public","profile_pictures");
try {
  await mkdir(uploadDir,{recursive:true})
} catch (error) {
  console.warn('Profile pictures directory already exists or failed to create:', error)
}
const bytes= file.arrayBuffer();
const buffer=Buffer.from(bytes);
const fileExtension=file.name.split(".").pop()?.toLowerCase() || 'jpg'
const filename= `profile-${userId}-${uuidv4()}.${fileExtension}`
const filePath= join(uploadDir, filename)
await writeFile(filePath, buffer);


return `profile_pictures/${filename}`


}
