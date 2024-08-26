import { db } from "@/lib/db";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request:Request){
    await db()

    const {username,content} =await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user is not accepting message"
                },{status:403})
                
        }
        const newMessage ={content,createdAt:new Date()} 
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"message sent succesfully"
            },{status:200})

    } catch (error) {
        return Response.json({
            success:false,
            message:"Error in sending message"
        },{status:500})
    }
}