import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  //   console.log(session);
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "User Not logged in" },
      { status: 401 }
    );
  }
    if (session?.user?.type!=="admin") {
    return NextResponse.json(
      { message: "Not authorized to access" },
      { status: 401 }
    );
  }
  const params = req.nextUrl.searchParams;
  const page = parseInt(params.get("page") as string);
  const pageSize = parseInt(params.get("pageSize") as string);
  const type= params.get("type")
  console.log("usertype", type);
  
  try {
    let users;
    let count=0;
    let where={
    };
    if(type){
        where={
            type:type
        }
    }
    if(type==="all"){
        where={}
    }

    count= await prisma.user.count()
    users= await prisma.user.findMany({
        where:{ AND:[
            where,
           { type:{not:"admin"}}
        ]
        },
        skip:(page-1) * pageSize,
        take:pageSize
    })
    return NextResponse.json(
      {
        users,
        totalPages: Math.ceil(count / pageSize),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if(error instanceof Error){
      console.log(
        error.message
        ? error.message
        : "Error occure during fetching applications"
      );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
