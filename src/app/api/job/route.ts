import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const data = req.json()
    console.log(data);
    try {
        // const result= await prisma.job.create({data})
        return NextResponse.json(data)

    } catch (error) {
        return NextResponse.json(data,{status:500})
    }
    
}