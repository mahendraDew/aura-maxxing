'use client'

import { motion } from 'framer-motion'
import { MoveRight } from 'lucide-react'
import { useState } from 'react'

interface CardProps {
  front: string
  back: string
  index: number
  onSwipe: (direction: 'left' | 'right') => void
}

export function Card({ front, back, index, onSwipe }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleDragEnd = (event: DragEvent, info: { offset: { x: number }, velocity: { x: number } }) => {
    if (info.offset.x > 100) {
      onSwipe('right')
    } else if (info.offset.x < -100) {
      onSwipe('left')
    }
  }

  return (
    <div className="w-64 sm:w-72 md:w-96 lg:w-[43rem] h-96 [perspective:1000px]  border rounded-lg">
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d] cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 1.1 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onDoubleClick={() => setIsFlipped(!isFlipped)}
      >
        <div>
        </div>
        <div className="w-full h-full absolute backface-hidden bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-gray-900/10 flex items-center justify-center p-4">
          <p className='absolute top-1 left-1 font-semibold text-gray-500'>
            #{index}
          </p>
          <p className="text-xl font-semibold text-center">{front}</p>
        </div>
          
        <div className="w-full h-full absolute backface-hidden bg-white dark:bg-zinc-900 rounded-lg shadow-md dark:shadow-gray-900/10 flex items-center justify-center p-4 [transform:rotateY(180deg)]">
          <p className='absolute top-1 left-1 font-semibold text-gray-500'>
            #{index}
          </p>
          <p className="text-lg font-light text-center flex gap-1 "> <MoveRight className='w-6 h-6' /> {back}</p>
        </div>
      </motion.div>
    </div>
  )
}

