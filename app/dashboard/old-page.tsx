'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KeyPoints } from '@/components/Keypoints'
import { Quiz } from '@/components/Quiz'
import { ProjectRecommendations } from '@/components/ProjectRecommendations'
import { StoryTelling } from '@/components/Storytelling'
import { Flashcards } from '@/components/Flashcards'

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating API call to process the URL
    const response = await fetch('/api/process-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    const data = await response.json()
    setContent(data)
  }

  return (
    <div className="min-h-screen p-4">
      <motion.h1 
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AURA Maxxing Dashboard
      </motion.h1>
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-gray-900 mb-8">
          <CardHeader>
            <CardTitle>Enter YouTube URL</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <Input 
                type="url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="bg-gray-800 text-white"
              />
              <Button type="submit" variant="outline">Generate Learning Content</Button>
            </form>
          </CardContent>
        </Card>

        {content && (
          <Tabs defaultValue="key-points" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="key-points">Key Points</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
            </TabsList>
            <TabsContent value="key-points">
              <KeyPoints points={content.keyPoints} />
            </TabsContent>
            <TabsContent value="flashcards">
              <Flashcards cards={content.flashcards} />
            </TabsContent>
            <TabsContent value="quiz">
              <Quiz questions={content.quiz} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectRecommendations projects={content.projects} />
            </TabsContent>
            <TabsContent value="story">
              <StoryTelling story={content.story} />
            </TabsContent>
          </Tabs>
        )}
      </motion.div>
    </div>
  )
}

