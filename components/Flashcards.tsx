'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FlashcardsProps {
  cards: { question: string; answer: string }[]
}

export function Flashcards({ cards }: FlashcardsProps) {
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length)
    setShowAnswer(false)
  }

  return (
    <Card className="bg-gray-900">
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4"
          >
            <h3 className="text-xl font-bold mb-2">
              {showAnswer ? 'Answer' : 'Question'}
            </h3>
            <p className="text-lg">
              {showAnswer ? cards[currentCard].answer : cards[currentCard].question}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </Button>
          <Button variant="outline" onClick={nextCard}>Next Card</Button>
        </div>
      </CardContent>
    </Card>
  )
}

