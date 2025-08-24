import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const session = await auth();
//   // if(!session?.user){
//   //     return NextResponse.json({message:"Unauthorized"},{status:401})
//   // }
//   try {
//     const applications = await prisma.application.findMany({
//       where: { jobId: id, OR:[{status:"PENDING"},{status:"REVIEW"}] },
//       select: {
//         id:true,
//         appliedAt: true,
//         resume: true,
//         description:true,
//         status: true,
//         userId: true,
//         applicant: {
//           select: {
//             name: true,
//             email: true
//           },
//         },
//       },
//     });
//     if (!applications) {
//       return NextResponse.json(
//         { message: "No applications found for this job" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(applications);
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         message: error.message
//           ? error.message
//           : " Error occured fetching application",
//       },
//       { status: 500 }
//     );
//   }
// }


// export async function PUT(req:NextRequest){
//   const {appId,status}= await req.json()
//   console.log(appId,status);
  
//   try {
//     const result= await prisma.application.update({where:{id:appId},data:{status:status}})
//     console.log("after update of application",result);
//     return NextResponse.json({message:"updated successfullu",result},{status:200})
//   } catch (error:any) {
//     return NextResponse.json({message:"error updating application",error: error.message? error.message : error},{status:500})
    
//   }

// }

import { sendEmail } from '@/lib/email';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: { job: true , applicant:true},
    });
    if (!application || (application.userId !== session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized or application not found' }, { status: 403 });
    }
    return NextResponse.json({
      type: 'application',
      id: application.id,
      jobTitle: application.job.title,
      company: application.job.company,
      name: application.applicant.name,
      email: application.applicant.email,
      coverLetter: application.description,
      cvUrl: application.resume,
      appliedAt: application.appliedAt,
      status: application.status,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  // if (!session?.user?.id) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const data = await request.json();
    const application = await prisma.application.findUnique({
      where: { id: data.appId },
      include: { job: true, applicant: true },
    });
    // if (!application || application.job.postedById !== session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized or application not found' }, { status: 403 });
    // }
    
    const updatedApplication = await prisma.application.update({
      where: { id:data.appId },
      data: {
        status: data.status,
      },
    });

    try {
      await sendEmail(
        application.applicant.email,
        `Application Status Update for ${application.job.title}`,
        `Dear ${application.applicant.name},\n\nYour application for ${application.job.title} at ${application.job.company} has been ${data.status.toLowerCase()}.\n\nThank you for applying!\n\nBest regards,\nJobBoard Team`
      );
    } catch (error) {
      console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}