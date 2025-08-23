import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session= await auth()
    // if(!session?.user){
    //     return NextResponse.json({message:"Unauthorized"},{status:401})
    // }
    try {
        const applications= await prisma.application.findMany({where:{jobId:id}});
        if(!applications){
            return NextResponse.json({message:"No applications found for this job"},{status:404})
        }
        return NextResponse.json(applications)
    } catch (error:any) {
        return NextResponse.json({message: error.message? error.message:" Error occured fetching application"},{status:500})
    }
}