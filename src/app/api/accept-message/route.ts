import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { db } from "@/lib/db";
import UserModel from "@/model/User.model";
import {User} from 'next-auth'


export async function POST(request:Request){

    await db()

    const session = await getServerSession(authOptions)
    const user = session?.user 
    
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }
        const userId =user?._id
        const {acceptMessages} =await request.json()

   try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage:acceptMessages}, {new:true})
    if(!updatedUser){
        return Response.json({
            success:false,
            message:"Not able to update the status of user"
        },{status:401})

    }
    return Response.json({
        success:true,
        message:"Message status updated successfully",
        data:updatedUser
    },{status:200})
   } catch (error) {
    console.log('failed to update user status to accept messages')
    return Response.json({
        success:false,
        message:"failed to update user status to accept messages"
    },{status:500})
   }
}


export async function GET(request:Request){

    try {
        const session = await getServerSession(authOptions)
        const user = session?.user 
        
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not authenticated"
            },{status:401})
        }
            const userId =user?._id
    
         const foundUser =  await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:401})
    
        }
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error is getting message status"
        },{status:500})  
    }
}
