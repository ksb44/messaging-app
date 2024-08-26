import { db } from "@/lib/db";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User.model";


export async function POST(request:Request){
 

    await db()



    try {

        
         const {username,email,password}= await request.json()

        const existingUserVerifiedByUsername =await UserModel.findOne({username,isVerified:true})


    if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username already exists"
        },{status:400})
    }

    const existingUserByEmail= await  UserModel.findOne({email})
    const verifyCode =Math.floor(100000+Math.random()*90000).toString()
    if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({
                success:false,
                messsage:"User Already exist with email"
              },{status:500})
        }
        else {
            const hashedPassword= await bcrypt.hash(password,10)
            existingUserByEmail.password=hashedPassword
            existingUserByEmail.verifyCode=verifyCode
            existingUserByEmail.verifyCodeExpiry= new Date(Date.now() +3600000)
            await existingUserByEmail.save()
        }
    }
    else {

        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() +1)

    const newUser = new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages:[]

        })
        
      await  newUser.save()
    }

  const emailResponse=  await sendVerificationEmail(email,username,verifyCode)

  if(!emailResponse.success){
    return Response.json({
    success:false,
    messsage:emailResponse.message
  },{status:500})
}
return Response.json({
    success:true,
    messsage:"User registered succesfully verify your email"
  },{status:200})

    } catch (error) {
        console.error('error registering user',error)
        return Response.json({
            success:false,
            message:'Error registering user'
        })
    }
}