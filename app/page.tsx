'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Aura Maxxing
      </motion.h1>
      <motion.p 
        className="text-xl mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Your AI-powered learning companion. Drop a YouTube link and start learning smarter.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link href="/dashboard">
          <Button variant="outline">Get Started</Button>
        </Link>
      </motion.div>
    </div>
  )
}

