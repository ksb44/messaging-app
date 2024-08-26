"use client"

import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth'
import { Button } from './ui/button'
function Navbar() {
    const {data:session}=useSession()
    const user = session?.user

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0' href="#">Messaging</a>
            {
                session ? (
                    <>
                    <span>Welcome,{user?.username || user?.email} </span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button>
                    </>
                ) :(
                    <>
                    <Link href='/sign-in'><Button>Login</Button></Link>
                    </>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar