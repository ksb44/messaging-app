
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import { db } from "@/lib/db";
import UserModel from "@/model/User.model";
import { NextAuthOptions } from "next-auth";


export const authOptions:NextAuthOptions={

    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials:{

                email:{label:'Email',type:'text'},
                password:{label:'Password',type:'password'}

            },
            async authorize(credentials:any):Promise<any>{
                await db();

                try {
                    
                const user = await UserModel.findOne({
                    
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })

                if (!user) {
                    throw new Error('No user found with the given email');
                }
                if(!user.isVerified){
                    throw new Error('User is not verified. Please verify your account');
                }

        
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error('Invalid password');
                }

               
                return {
                    _id: user._id,
                    email: user.email,
                    isVerified: user.isVerified,
                    username: user.username,
                  };                    
                } catch (error:any) {
                    throw new Error(error)
                }
               
            }

        })
    ],
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{

            async session({ session,token }) {

                if(token){
                    session.user._id=token._id
                    session.user.isVerified=token.isVerified
                    session.user.isAcceptingMessages=token.isAcceptingMessages
                    session.user.username=token.username
                }
              return session
            },
            async jwt({ token, user}) {
                if(user){
                    token._id=user._id?.toString()
                    token.isVerified=user.isVerified;
                    token.isAcceptingMessages=user.isAcceptingMessages
                    token.username=user.username
                }
              return token
            } 
    }
}
