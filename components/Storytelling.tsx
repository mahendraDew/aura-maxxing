'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StoryTellingProps {
  story: {
    text: string
    image: string
  }[]
}

export function StoryTelling({ story }: StoryTellingProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Simulating Beatoven API for dramatic background music
    const audioElement = new Audio('/dramatic-music.mp3')
    setAudio(audioElement)
    audioElement.loop = true
    audioElement.play()

    return () => {
      audioElement.pause()
      audioElement.currentTime = 0
    }
  }, [])

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % story.length)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + story.length) % story.length)
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Engaging Story</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <img
              src={story[currentPage].image}
              alt={`Story illustration ${currentPage + 1}`}
              className="w-full h-64 object-cover mb-4 rounded-md"
            />
            <p className="text-lg mb-4">{story[currentPage].text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={prevPage}>Previous</Button>
          <Button variant="outline" onClick={nextPage}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}

