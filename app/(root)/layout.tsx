import Header from '@/components/header'
import { auth } from '@/lib/betterAuth/auth'
import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'



const layout = async({children}:{children: React.ReactNode}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if(!session?.user){
    redirect('/sign-in');
  }

  const user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,

  }
  return (
    <main className='min-h-screen text-gray-400'>
        {/* HEADER */}
        <Header user = { user } />
        <div className='container py-10'>
            {children}
        </div>
    </main>
  )
}

export default layout