import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document  {
    content:string
    createdAt:Date
}


const MessageSchema :Schema<Message>=new mongoose.Schema({
    content:{type:String,required:true},
    createdAt:{type:Date,required:true,default:Date.now}

})

export interface User extends Document {
   username:string
   email:string
   password:string
   verifyCode:string
   verifyCodeExpiry:Date
   isAcceptingMessage:boolean
   isVerified:boolean
   messages:Message[]
}
const UserSchema :Schema<User>=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'Please enter a valid email address']
    },
    password:{
        type:String,
        required:true,
        minlength:[6,'Please provide a minimum length']
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:true
    },   
        messages:[MessageSchema]
    })

    const MessageModel = mongoose.models.messages as mongoose.Model<Message> || mongoose.model<Message>('messages',MessageSchema)



    const UserModel=mongoose.models.users as mongoose.Model<User> || mongoose.model<User>('users',UserSchema)

    export default UserModel