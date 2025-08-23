import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { unlink, writeFile } from "fs/promises";
import { error } from "console";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data= await req.formData()
    const file= data.get("cv")
    if(!file){
        return NextResponse.json({message:"CV not provided"},{status:400})
    }
    let createdApp= null;
    const filename= file.name.replaceAll(" ","_")
    const fullPath= `public/assets/${data.get("userId")}_${id}_${filename}`
    let fileWritten=false
    try {
        const buffer= Buffer.from(await file.arrayBuffer());
        // console.log(fullPath);
        const application={
            description:data.get("coverLetter") as string,
            jobId:id,
            userId:data.get("userId") as string,
            resume:fullPath
        }
        createdApp= await prisma.application.create({data:application})
        await writeFile(path.join(process.cwd(),fullPath ),buffer)
        fileWritten=true
        return NextResponse.json({message:"You have successfully applied for this Job"})
    } catch (error:any) {
        if(createdApp){
            await prisma.application.delete({
            where: { id: createdApp.id }
             });
        }
        if( fileWritten ){
            await unlink(fullPath)
        }
        if(error?.code==="P2002"){
            return NextResponse.json({message:"You can't apply multiple times for same job"},{status:400})
        }
        console.log(error?.message);
        
        return NextResponse.json({ error }, { status: 500 })
    }
}
