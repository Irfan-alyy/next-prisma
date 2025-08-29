import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import NodeMailer from "next-auth/providers/nodemailer"
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Github, Google, NodeMailer({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
    })],
    pages:{
     signIn:"/auth/signin",
     verifyRequest: '/auth/verify-request',
     error: '/auth/error',
    },
    session: {
        strategy: "jwt",
        maxAge: 24*60*60*1000,
    },
    callbacks:{
        async jwt({token,user}) {
            if(user){
                token.id= user.id,
                token.name=user.name
            }
            return token
        },
        async session 
        ({session, token}) {
            if (token?.sub) {
                // Fetch fresh user data from database
                const dbUser = await prisma.user.findUnique({
                  where: { id: token.sub }
                });
                if (dbUser) {
                  session.user = {
                    ...session.user,
                    id: dbUser.id,
                    type: dbUser.type,
                    name:dbUser.name,
                    image:dbUser.image
                  };
                }
            }
            return session
            
        }

    }
  
})