'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import axios from 'axios'
import { Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader'

const loadingStates = [
  { text: 'Summoning the AI gods...' },
  { text: 'Spilling the tea on your data...' },
  { text: 'Flexing those neural nets...' },
  { text: 'Cooking up flashcards—stay tuned!' },
  { text: 'Serving quizzes, hot and fresh...' },
  { text: 'Plotting projects like a mastermind...' },
  { text: 'Crafting a story to vibe with...' },
  { text: 'Lowkey turning yt vids into gold...' },
  { text: 'Adding a pinch of Gen Z magic...' },
  { text: 'Manifesting educational vibes...' },
  { text: 'Drafting some ✨ aesthetic ✨ notes...' },
  { text: 'Unleashing the AI drip...' },
  { text: "It's giving... insightful vibes..." },
  { text: 'Brainstorming like a big-brained baddie...' },
  { text: 'Glow-up mode for your learning content...' },
  { text: 'Channeling main character energy...' },
  { text: 'No cap, making it lit...' },
  { text: 'On a learning grind...' },
  { text: 'AI flexing harder than ever...' },
  { text: 'Snatching transcripts, building insights...' }
]

type NoteType = {
  _id: string
  videoId: string
  videoURL: string
}

type Props = {
  notesEntry: string
}

function DashboardContent ({ notesEntry }: Props) {
  // const NotesData: NotesDataType = JSON.parse(serializedData)

  const notesEntryData: NoteType[] = JSON.parse(notesEntry)

  console.log('mill gya yrr notesEntryVala Data: ', notesEntryData)

  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter() // Initialize the useRouter hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateYouTubeURL(url)) {
      console.log('Valid YouTube URL')
    } else {
      toast('Invalid link!', {
        description: 'Enter only youtube link!'
      })
      return
    }

    try {
      setLoading(true)

      //#1 : get the transcription of the yt video
      //#1.1: make a db entry over this yt video and data
      //#2: hit the gemini and get all the details of  the cards and functions
      const response = await axios.post('/api/process-video', { url })
      if (response.status === 500) {
        toast('Transcript not found !', {
          description: 'This yt video doesnt have a transcript!'
        })
      }
      const data = response.data
      console.log('data-fe:', data)

      if (data.notesDataId) {
        // Redirect to /dashboard/[id]
        toast('Redirecting to the Notes page...', {
          description: 'You will be redirected to your Notes page shortly.'
        })
        router.push(`/dashboard/${data.notesDataId}`)
        setLoading(false)
      } else {
        toast('Failed to generate Text!', {
          description: 'The response did not include a notesDataId!'
        })
        setLoading(false)
      }

      // if (!data.transcriptData) {
      //   toast('Transcription failed!', {
      //     description: 'Enter only valid public youtube link!'
      //   })
      // }

      setLoading(false)
    } catch (error) {
      console.log('Error aa gya bhai....', error)
      toast('Transcript not found !', {
        description: 'This yt video doesnt have a transcript!'
      })
      setLoading(false)
    }
  }

  const validateYouTubeURL = (url: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[a-zA-Z0-9_-]{11}(&.*)?$/
    return regex.test(url)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto mt-10'
      >
        <Loader
          loadingStates={loadingStates}
          loading={loading}
          duration={2000}
        />

        <h1 className='text-4xl font-bold mb-8'>Dashboard</h1>
        {loading ? (
          <div>loading...</div>
        ) : (
          // {/* URL Input Section */}
          <Card className='p-6 mb-8 backdrop-blur-sm bg-card/50'>
            <h2 className='text-2xl font-semibold mb-4'>Start Learning</h2>
            <div className='flex gap-4 flex-col md:flex-row'>
              <form
                onSubmit={handleSubmit}
                className='flex gap-4 flex-col md:flex-row w-full'
              >
                <Input
                  type='url'
                  placeholder='https://www.youtube.com/watch?v=...'
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className='flex-1'
                />
                <Button type='submit'>
                  <Youtube className='mr-2 h-4 w-4' />
                  Analyze
                </Button>
              </form>
            </div>
          </Card>
        )}
        {/* Stats Overview */}
        {/* <div className='grid md:grid-cols-3 gap-6 mb-8'>
          {[
            { icon: BookOpen, title: 'Videos Analyzed', value: '12' },
            { icon: Brain, title: 'Flashcards Created', value: '248' },
            { icon: Target, title: 'Quizzes Completed', value: '36' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className='p-6 backdrop-blur-sm bg-card/50'>
                <div className='flex items-center gap-4'>
                  <stat.icon className='h-8 w-8 text-primary' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      {stat.title}
                    </p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          // ))}
        </div> */}

        {/* Recent Activity */}
        {/* <Card className='p-6 backdrop-blur-sm bg-card/50'>
          <h2 className='text-2xl font-semibold mb-4'>Recent Activity</h2>
          <div className='space-y-4 flex gap-2'>
            {notesEntryData.map((note, index) => (
              <Link href={`/dashboard/${note._id}`}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className='p-4 rounded-lg bg-muted/50'
                >
                  {note.videoURL}
                </motion.div>
              </Link>
            ))}
          </div>
        </Card> */}

        <Card className='p-6 backdrop-blur-sm bg-card/50'>
          <h2 className='text-2xl font-semibold mb-4'>Recent Activity</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {notesEntryData.length === 0 && <div>
              <p>You dont have any data yet</p>
              </div>}
            {notesEntryData.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='p-4 rounded-lg bg-muted/50 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer'
                onClick={() =>
                  (window.location.href = `/dashboard/${note._id}`)
                }
              >
                {/* Video Section */}
                <div className='relative w-full h-36 mb-4 rounded-lg overflow-hidden'>
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      note.videoURL.split('v=')[1]
                    }`}
                    title='YouTube video'
                    className='absolute top-0 left-0 w-full h-full'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Information */}
                <div className='text-muted-foreground'>
                  <p className='text-lg font-medium truncate'>
                    Open up your notes
                  </p>
                  <p className='text-xs'> VideoId: {note.videoId}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </>
  )
}

export default DashboardContent
