
// import { motion } from 'framer-motion'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card } from '@/components/ui/card'
// import { Youtube, BookOpen, Brain, Target } from 'lucide-react'
// import { Youtube } from 'lucide-react'
// import { useState } from 'react'
// import { toast } from 'sonner'
// import axios from 'axios'
import { Navigation } from '@/components/Navigation'
import DashboardContent from '@/components/dashboard/dashboard'
import connectToDatabase from '@/lib/db/mongo/db';
import { VideoModel, VideoNotesModel } from '@/modal/schema';
import { auth } from '@clerk/nextjs/server'


export default async function Dashboard() {
  const {userId } = await auth();

  // make a db req and get all the videonotescontent athat this user has
  await connectToDatabase();

  const notesEntry = await VideoNotesModel.find({
    userId: userId,
  }).select('_id videoId');

  // console.log("noteentry: ", notesEntry)

  const videoIds = notesEntry.map((note) => note.videoId);

  // console.log("videoIds:", videoIds)

  const videos = await VideoModel.find({ _id: { $in: videoIds } }).select('url');

  // console.log("videos:", videos)


  const notesWithVideoURL = notesEntry.map((note) => {
    const video = videos.find((v) => v._id.toString() === note.videoId.toString()); // Match videoId with _id in videos
    return { ...note.toObject(), videoURL: video?.url || null }; // Add videoURL or null if not found
  });

  // console.log("notesWithVideoURL:", notesWithVideoURL);
  
  
  return (
    <div className='min-h-screen p-8'>
      <Navigation />
      <DashboardContent notesEntry={JSON.stringify(notesWithVideoURL)}/>
    </div>
  )
}
