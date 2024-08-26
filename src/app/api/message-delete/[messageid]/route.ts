import { db } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
export async function DELETE(request:Request,{params}:{params:{messageid:string}}

){
    
    
const messageId = params.messageid
await db()

const session=await getServerSession(authOptions)
const user =session?.user

if(!session || !session.user){
    return Response.json({
        success:false,
        message:'Not Authenticated'

    },{
        status:401
    })
}

try {
  const updateResult=  await UserModel.updateOne({
        _id:user?._id},{
            $pull:{messages:{_id:messageId}}
        }
    )

    if(updateResult.modifiedCount ==0){
        return Response.json({
            success:false,
            message:'Message not found'
            },{
                status:404
                })

        
    }
    return Response.json({
        success:true,
        message:'Message Deleted'

    },{
        status:200
    })
} catch (error) {
    return Response.json({
        success:false,
        message:'Error in deleting messages'

    },{
        status:500
    })
}
}