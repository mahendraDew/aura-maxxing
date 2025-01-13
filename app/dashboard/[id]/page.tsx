import { DashboardDetailContent } from '@/components/dashboard-detail/DashboardDetailContent'
import connectToDatabase from '@/lib/db/mongo/db'
import { VideoNotesModel } from '@/modal/schema'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
// import { auth, User } from '@clerk/nextjs/server'
import React from 'react'

export default async function DashboardDetail ({params}: {params: Promise<{ id: string }>}) {
  const notesDataId = (await params).id
  const { userId } = await auth()

  //make a db req to seee if this notesDataId is present and with the 'userId' as userId


  if (!userId) {
    redirect('/dashboard') // Redirect to dashboard if user is not authenticated
  }
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const userData = {
    imageUrl: user.imageUrl,
    fullname: user.fullName,
    email: user.emailAddresses[0].emailAddress
  }
  // console.log('user data: ', userData)

  await connectToDatabase()
  const notesEntry = await VideoNotesModel.findOne({
    _id: notesDataId,
    userId: userId,
  })

  if (!notesEntry) {
    redirect('/dashboard') // Redirect if the entry doesn't exist or doesn't belong to the user
  }


  
  console.log("noteEntry: ", notesEntry);

  const notecontent = {
    revisedNotes: notesEntry.revisedNotes,
    flashcards: notesEntry.flashcards,
    projectList: notesEntry.projectList,
    storytelling: notesEntry.storytelling
  }


  return (
    <div>
      <DashboardDetailContent userData={userData} notesEntry={notecontent} />
    </div>
  )
}
