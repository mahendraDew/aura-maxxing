
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

export default function Dashboard() {
  return (
    <div className='min-h-screen p-8'>
      <Navigation />
      <DashboardContent />
    </div>
  )
}
