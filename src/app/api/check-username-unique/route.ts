import { db } from "@/lib/db";
import UserModel from "@/model/User.model";
import { signUpSchema, usernameValidation } from "@/schemas/signUpSchema";

import {z} from 'zod'

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){

   
    await db()

    try {
        const {searchParams} =new URL(request.url)
        // console.log(request.url,searchParams)
        const queryParam= {
            username: searchParams.get('username')
        }
        
        const result = UsernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameErrors=result.error.format().username?._errors 
            || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0 ? usernameErrors.join(', '):
                'Invalid query parameter'
            },{status:400})
        }
        const {username} =result.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'username is already taken'
            })


        }

        return Response.json({
            success:true,
            message:'username is unique'
        },{status:200})

    } catch (error) {
        console.log("Error checking username",error)
        return Response.json({
            success:false,
            message:"error checking username"
        },{status:500})
    }
}