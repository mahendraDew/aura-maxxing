'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Youtube, BookOpen, Brain, Target } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

export default function Dashboard () {
  return (
    <div className='min-h-screen p-8'>
      <Navigation />
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
            <Input placeholder='Paste YouTube URL here...' className='flex-1' />
            <Button>
              <Youtube className='mr-2 h-4 w-4' />
              Analyze
            </Button>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
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
          ))}
        </div>

        {/* Recent Activity */}
        <Card className='p-6 backdrop-blur-sm bg-card/50'>
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
        </Card>
      </motion.div>
    </div>
  )
}
