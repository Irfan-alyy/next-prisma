import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
import bcrypt from "bcryptjs";



// export async function GET(){
//     const users= await prisma.user.findMany({omit:{password:true}})
//     return NextResponse.json(users)
// }

export async function POST(req:NextRequest) {
  const data = await req.json();
  if (!data.username || !data.email || !data.password) {
    return NextResponse.json("All Feilds required to create a Account");
  }
  try {
    let hashedPassword= await  bcrypt.hash(data.password, 10)
    const user= await prisma.user.findFirst({where:{
      OR:[
        {email:data.email},
        {username:data.username}
      ]
    }})
    if(user){
      return NextResponse.json(`User already exists`)
    }
      const result = await prisma.user.create({
        data: {...data, password:hashedPassword
        },select:{
        id:true, email:true, username:true
        }
      });
    return NextResponse.json({message:"User accounte created", user:result});
  } catch (err) {
    console.error(err)
    return NextResponse.json({message:"Error occured creating user", err})
  }

}
