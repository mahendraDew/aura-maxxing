'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import axios from 'axios'
import { Youtube } from 'lucide-react'

function DashboardContent () {
  const [url, setUrl] = useState('')

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

    //#1 : get the transcription of the yt video
    //#1.1: make a db entry over this yt video and data
    //#2: hit the gemini and get all the details of the cards and functions
    const response = await axios.post('/api/process-video', { url })
    const data = response.data
    console.log('data-fe:', data.transcriptData)

    // if (!data.transcriptData) {
    //   toast('Transcription failed!', {
    //     description: 'Enter only valid public youtube link!'
    //   })
    // }

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
        <h1 className='text-4xl font-bold mb-8'>Dashboard</h1>

        {/* URL Input Section */}
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
          <div className='space-y-4'>
            {[
              "Completed quiz on 'Advanced JavaScript Concepts'",
              "Created flashcards for 'System Design Basics'",
              "Analyzed 'Machine Learning Fundamentals'"
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className='p-4 rounded-lg bg-muted/50'
              >
                {activity}
              </motion.div>
            ))}
          </div>
        </Card> */}
      </motion.div>
    </>
  )
}

export default DashboardContent
