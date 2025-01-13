import {DashboardDetailContent} from '@/components/dashboard-detail/DashboardDetailContent'
import { auth, clerkClient } from '@clerk/nextjs/server'
// import { auth, User } from '@clerk/nextjs/server'
import React from 'react'

export default async function DashboardDetail () {
  const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    // console.log('user:', userId)

    const userData  = {
      imageUrl: user.imageUrl,
      fullname: user.fullName,
      email: user.emailAddresses[0].emailAddress,
      
    }
    console.log('user data: ', userData)


  return (
    <div>
      <DashboardDetailContent userData={userData}/>
    </div>
  )
}
