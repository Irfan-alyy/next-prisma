import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { tree } from "next/dist/build/templates/app-page";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  // if(!session?.user){
  //     return NextResponse.json({message:"Unauthorized"},{status:401})
  // }
  try {
    const applications = await prisma.application.findMany({
      where: { jobId: id, OR:[{status:"PENDING"},{status:"REVIEW"}] },
      select: {
        id:true,
        appliedAt: true,
        resume: true,
        description:true,
        status: true,
        userId: true,
        applicant: {
          select: {
            name: true,
            email: true
          },
        },
      },
    });
    if (!applications) {
      return NextResponse.json(
        { message: "No applications found for this job" },
        { status: 404 }
      );
    }
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message
          ? error.message
          : " Error occured fetching application",
      },
      { status: 500 }
    );
  }
}


export async function PUT(req:NextRequest){
  const {appId,status}= await req.json()
  console.log(appId,status);
  
  try {
    const result= await prisma.application.update({where:{id:appId},data:{status:status}})
    console.log("after update of application",result);
    return NextResponse.json({message:"updated successfullu",result},{status:200})
  } catch (error:any) {
    return NextResponse.json({message:"error updating application",error: error.message? error.message : error},{status:500})
    
  }

}