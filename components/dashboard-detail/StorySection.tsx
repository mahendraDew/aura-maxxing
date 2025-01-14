'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface StoryProps {
  story: {
    title: string
    paragraphs: Array<{
      text: string
      image: string
    }>
  }
}

export default function StorySection({ story }: StoryProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left
  const [isPlaying, setIsPlaying] = useState(true)
  const [showPlayAgain, setShowPlayAgain] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev + 1 >= story.paragraphs.length) {
            setIsPlaying(false)
            setShowPlayAgain(true)
            return prev
          }
          return prev + 1
        })
        setDirection((prev) => prev * -1) // Alternate direction
      }, 10000) // Change image every 10 seconds
    }
    return () => clearInterval(timer)
  }, [isPlaying, story.paragraphs.length])

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight
    }
  }, [currentPage])

  const handlePlayAgain = () => {
    setCurrentPage(0)
    setDirection(1)
    setIsPlaying(true)
    setShowPlayAgain(false)
  }

  return (

    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{
                  x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
                  scale: [1, 1.1, 1],
                  transition: { duration: 20, repeat: Infinity }
                }}
                className='absolute inset-0'
              >
                <Image
                  src={story.paragraphs[currentPage].image}
                  alt={`Story illustration ${currentPage + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div 
          ref={textRef}
          className="h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-sm"
            >
              {story.paragraphs[currentPage].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </CardContent>

      {showPlayAgain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <CardContent className='flex flex-col justify-center items-center'>
                <h3 className="text-xl font-bold mb-4">Story Finished</h3>
                <Button onClick={handlePlayAgain}>Play Again</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Card>


  )
}

