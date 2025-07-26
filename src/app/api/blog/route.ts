import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
import jwt from "jsonwebtoken";
import authenticate from "@/lib/authenticate";
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req:NextRequest) {
 const authResult= authenticate(req)
  if(authResult && !authResult.userId ) return authResult;
  const blogs = await prisma.blog.findMany({});
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const authResult= authenticate(req)
  if(authResult && !authResult.userId ) return authResult;
  const decoded = authResult
  console.log(decoded.userId);
  const data = await req.json();
  const blog = { ...data, auhtorId: decoded.userId };
  console.log(blog);
  if (!data.title || !data.description) {
    return NextResponse.json(
      "Title and Description required for creating blog"
    );
  }

  try {
    const existingBlog= await prisma.blog.findFirst({where:{
        title:data.title, description:data.description
    }})

    if(existingBlog){
        return NextResponse.json("Blog already exist with same title and description")
    }

    const result = await prisma.blog.create({
      data: { ...data, authorId: decoded.userId },
    });
    return NextResponse.json({
      message: "Blog created successfully",
      blog: result,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error occured creating blog", err },{status:400});
  }
}
