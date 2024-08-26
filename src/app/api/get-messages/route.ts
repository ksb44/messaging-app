import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { db } from "@/lib/db";
import {User} from 'next-auth'
import  mongoose  from "mongoose";
import UserModel from "@/model/User.model";


export async function GET(request:Request){
    await db()
    const session = await getServerSession( authOptions);
    const user= session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{status:401})
    }

     const userId =new mongoose.Types.ObjectId(user?._id)
   
    try {
        
        const user = await UserModel.aggregate([

            {
                $match:{
                    _id:userId
                },
    
            },
            {
                $unwind:'$messages',

            },

            {
                $sort:{'messages.createdAt':-1}
            },
            {
                $group:{
                    _id:'$_id',
                    messages:{$push:'$messages'},

                }
            }
        ])
        if(!user || user.length==0){
            return Response.json({
                success:false,
                message:"No messages yet"
            },{status:401})
        }


        return Response.json({
            success:true,
            message:user[0].messages
        },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error is getting message status"
        },{status:500})  
    }
}