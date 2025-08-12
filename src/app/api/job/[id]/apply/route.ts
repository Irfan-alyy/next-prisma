import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data= await req.formData()
    const file= data.get("cv")
    if(!file){
        return NextResponse.json({message:"CV not provided"},{status:400})
    }
    try {
        const buffer= Buffer.from(await file.arrayBuffer());
        const filename= file.name.replaceAll(" ","_")
        await writeFile(path.join(process.cwd(), "public/assets/"+`${data.get("userId")}_${filename}`),buffer)
        const fullPath= `public/assets/_${data.get("userId")}_${filename}`
        console.log(fullPath);
        const application={
            description:data.get("coverLetter") as string,
            jobId:id,
            userId:data.get("userId") as string,
            resume:fullPath
        }
        const result= await prisma.application.create({data:application})
        return NextResponse.json(result)
    } catch (error) {
        if(error?.code==="P2002"){
            return NextResponse.json({message:"You can't apply multiple times for same job"},{status:400})
        }
        return NextResponse.json({ error }, { status: 500 })
    }
}