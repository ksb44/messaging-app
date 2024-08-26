'use client'

import React, { useEffect, useState } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
function page() {

  const { toast } = useToast()
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)

  const [isSubmitting,setIsSubmitting]=useState(false)

  const debounced = useDebounceCallback(setUsername,300)
  const router=useRouter()

  const form =useForm({resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response= await axios.get(`/api/check-username-unique?username=${username}`)
         setUsernameMessage(response.data.message)
        } catch (error:any) {
          setUsernameMessage(error.message)
        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
    try {
    setIsSubmitting(true)
    const respose =await axios.post<ApiResponse>('/api/sign-up',data)
    toast({
      title: 'Sign up successful',
      description: respose.data.message,
    })
    router.replace(`/verify/${username}`)
  
      setIsSubmitting(false)
    } catch (error:any) {
      setUsernameMessage(error.message)
      toast({
        title: 'Error',
        description: error.message,
        variant:'destructive'
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex justify-center items-center
    min-h-screen shadow-md bg-gray-800'>
      
    <div className='w-full max-w-md p-8 space-y-8 bg-white
    rounded-lg shadow-md'>
      <div className='text-center'>
<h1 className='text-4xl font-extralight tracking-tight
lg:text-5xl mb-6'>Join Message</h1>
<p className='mb-4'>Sign up to start your anonymous messaging</p>
      </div>

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={e=>{field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsername && <Loader2 className='animate-spin'/>}
            <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' :'text-red-500'}`}>
                {usernameMessage}
            </p>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder="email" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="password" {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (<>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
            </>) : 'Signup'
          }
        </Button>
      </form>
    </Form>
    <div className='text-center mt-4'>
  <p>
    Already have an account?{' '}
    <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'>
      Sign in
    </Link>
  </p>
</div>

    </div>
    </div>
  )
}

export default page