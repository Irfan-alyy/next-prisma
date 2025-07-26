import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
import jwt from "jsonwebtoken";
import authenticate from "@/lib/authenticate";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = authenticate(req);
  if (authResult && !authResult.userId) return authResult;
  const { id: blogId } = await params;
  const blogs = await prisma.blog.findUnique({ where: { id: blogId } });
  return NextResponse.json(blogs);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = authenticate(req);
  if (authResult && !authResult.userId) return authResult;
  const { id: blogId } = await params;
  const data = await req.json();
  if (!data.title || !data.description) {
    return NextResponse.json(
      "Title and Description required for creating blog"
    );
  }
  const result = await prisma.blog.update({
    where: {
      id: blogId,
    },
    data: {
      title: data.title,
      description: data.description,
    },
  });
  return NextResponse.json({
    message: "Blog updated Successfully",
    blog: result,
  });
}

export async function DELETE(_req:NextRequest, {params}:{params:Promise<{id:string}>}){
    const {id:blogId}= await params
    try {
        const result= await prisma.blog.delete({where:{
            id:blogId
        }})
        return NextResponse.json({message:"Blog Deleted", result})
        
    } catch (error) {
        return NextResponse.json(error)
    }
        
    
}
