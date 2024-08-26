
"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import {  useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
function Page() {
    const router =useRouter()
    const {username} =useParams<{username:string}>()
    const {toast} =useToast()
    const form =useForm({resolver:zodResolver(verifySchema),
      defaultValues:{
        code: '',

      }
      })
      const onSubmit= async(data:any)=>{
        try {
            const response = await axios.post(`/api/verify-code`,{
                username,
                code:data.code
            })
            
            if(response.status ==200)
            {
            toast({
                title: 'Verification Successful',
                description: 'You have successfully verified your account',
            })

             router.replace('/sign-in')
          
          }


        } catch (error:any) {
          console.log(error)
            toast({
              title: 'Error',
              description:'Incorrect code or code expired',
              variant:'destructive'
            })
            router.replace('/sign-in')
          }
      }
  return (
    <div className='flex justify-center items-center
    min-h-screen shadow-md bg-gray-800'>
    
    <div className='w-full max-w-md p-8 space-y-8 bg-white
    rounded-lg shadow-md'>
              <div className='text-center'>
<h1 className='text-4xl font-extralight tracking-tight
lg:text-5xl mb-6'>Verify your Account</h1>
<p className='mb-4'>Enter the verification code sent to your email</p>
      </div>


      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default Page