import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const data= await req.json();
    // console.log(data);
    try {
        const result= await prisma.job.create({data})
        return NextResponse.json({message:"Job created successfully", result},{status:201})
    } catch (error) {
        return NextResponse.json({message:"Error occured while creating job", error},{status:500})    
    }  
}
