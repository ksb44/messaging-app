'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User.model"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
 
type MessageCardProps={
    message:Message,
    onMessageDelete:(messageId:any)=>void
}
function MessageCard({message,onMessageDelete}:MessageCardProps) {
    const {toast}= useToast()
    const handleDeleteConfirm=async()=>{
        const response =await axios.delete<ApiResponse>(`/api/message-delete/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id)
    }
  return (
    <div>
        
        <Card>
  <CardHeader className="flex items-center justify-between">
    <div className="flex-1">
      <div className="flex items-center">
        <CardTitle className="flex-1">{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="ml-4" variant="destructive">
              <X className="w-6 h-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CardDescription className="pt-5">
        {new Date(message.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })}
      </CardDescription>
    </div>
  </CardHeader>
  <CardContent>
    {/* Card content goes here */}
  </CardContent>
</Card>



    </div>
  )
}

export default MessageCard