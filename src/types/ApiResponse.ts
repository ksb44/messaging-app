import { Message } from "@/model/User.model"

export interface ApiResponse{
    success:boolean
    message:string
    isAcceptingMessages?: boolean
    messages?:Message[]
}