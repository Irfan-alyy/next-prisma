import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./lib/prisma";

export const {auth, handlers, signIn, signOut}=NextAuth({
    session:{
        strategy:"jwt"
    },
    providers:[Github, Google],
    adapter:PrismaAdapter(prisma),
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id= user.id,
                token.name=user.name
            }
            return token
        },
        async session({session,token}) {
            if(session.user){
                session.user.id= token.id
                session.user.name= token.name
            }
            return session
        }
    }
})