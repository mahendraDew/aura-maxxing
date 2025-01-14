import { DashboardDetailContent } from '@/components/dashboard-detail/DashboardDetailContent'
import connectToDatabase from '@/lib/db/mongo/db'
import { VideoNotes, VideoNotesModel } from '@/modal/schema'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
// import { auth, User } from '@clerk/nextjs/server'
import React from 'react'

export default async function DashboardDetail ({params}: {params: Promise<{ id: string }>}) {
  const notesDataId = (await params).id
  const { userId } = await auth()

  //make a db req to seee if this notesDataId is present and with the 'userId' as userId


  if (!userId) {
    redirect('/dashboard') 
  }
  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  const userData = {
    imageUrl: user.imageUrl,
    fullname: user.fullName,
    email: user.emailAddresses[0].emailAddress
  }


  await connectToDatabase()
  const notesEntry: VideoNotes | null = await VideoNotesModel.findOne({
    _id: notesDataId,
    userId: userId,
  })

  if (!notesEntry) {
    redirect('/dashboard') 
  }

  const notecontent = {
    revisedNotes: notesEntry.revisedNotes,
    flashcards: notesEntry.flashcards,
    quizzes: notesEntry.quizzes,
    projectList: notesEntry.projectList,
    storytelling: notesEntry.storytelling
  }

  // const notecontent = {
  //     revisedNotes: `
  //       - AI processes video content to extract key information
  //       - Creates personalized learning paths based on user preferences
  //       - Generates interactive quizzes for knowledge assessment
  //       - Provides project recommendations with detailed steps
  //       - Uses natural language processing for better understanding
  //       - Adapts difficulty based on user performance
  //       - Tracks progress and suggests improvements
  //       - Integrates with various learning platforms
  //     `,
  //     flashcards: [
  //       { id: 1, front: "What is AURA?", back: "An AI-powered learning platform that maximizes your potential" },
  //       { id: 2, front: "Key Features?", back: "Video summaries, flashcards, quizzes, and project recommendations" },
  //       { id: 3, front: "How does it work?", back: "Drop a YouTube link and AI processes the content for learning" }
  //     ],
  //     quizzes: [
  //       {
  //         question: "What is the main purpose of AURA?",
  //         options: [
  //           { text: "Entertainment" },
  //           { text: "Social networking" },
  //           { text: "Learning enhancement" },
  //           { text: "Gaming" }
  //         ],
  //         correctOption: 2
  //       },
  //       {
  //         question: "Which feature helps with memory retention?",
  //         options: [
  //           { text: "Video player" },
  //           { text: "Flashcards" },
  //           { text: "Chat system" },
  //           { text: "Profile page" }
  //         ],
  //         correctOption: 1
  //       }
  //     ],
  //     projectList: [
  //       {
  //         category: "Web Development",
  //         title: "Build a Portfolio Website",
  //         description: "Create a personal portfolio to showcase your work",
  //         steps: [
  //           { context: "Setup", description: "Initialize project with Next.js" },
  //           { context: "Design", description: "Create wireframes and mockups" }
  //         ]
  //       }
  //     ],
  //     storytelling: {
  //       title: "The Journey of Learning",
  //       paragraphs: [
  //         { 
  //           text: "Embark on a journey of discovery",
  //           prompt: "A beautiful mountain landscape at sunrise"
  //         },
  //         {
  //           text: "Transform knowledge into power",
  //           prompt: "A glowing orb of energy floating in space"
  //         }
  //       ]
  //     }
  //   }
    
  


  return (
    <div>
      {/* <TestComponent  serializedData={JSON.stringify(notecontent)}   userData={userData}/> */}
      {/* <DashboardDetailContent userData={userData} notesEntry={notecontent} /> */}
      <DashboardDetailContent userData={userData} serializedData={JSON.stringify(notecontent)}  />
      {/* <DashboardComponent userData={userData} notesEntry={notecontent} /> */}
      {/* <DashboardDetailContent userData={userData} /> */}
      {/* <DashboardDetailContent userData={userData} notesDataId={notesDataId}/> */}
    </div>
  )
}
