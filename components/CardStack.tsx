'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Card } from './Card'

const initialCards = [
  { id: 1, front: 'Card 1', back: 'This is the back of Card 1' },
  { id: 2, front: 'Card 2', back: 'This is the back of Card 2' },
  { id: 4, front: 'Card 4', back: 'This is the back of Card 4' },
  { id: 5, front: 'Card 5', back: 'This is the back of Card 5' },
  { id: 6, front: 'Card 6', back: 'This is the back of Card 6' },
  { id: 7, front: 'Card 7', back: 'This is the back of Card 7' },
  { id: 8, front: 'Card 8', back: 'This is the back of Card 8' },
]

function parseFlashcards(flashcardString: string) {
    const flashcardPattern = /\*\*Flashcard (\d+)\*\*\n\n\* \*\*Front:\*\* (.+?)\n\* \*\*Back:\*\* (.+?)\n/g
    const flashcards = []
  
    let match
    while ((match = flashcardPattern.exec(flashcardString)) !== null) {
      const id = parseInt(match[1], 10)
      const front = match[2].trim()
      const back = match[3].trim()
  
      flashcards.push({ id, front, back })
    }
  
    return flashcards
  }

  interface Props {
    flashcardString: string
  }
  
export function CardStack( {flashcardString}: Props) {
    const flashcards = parseFlashcards(flashcardString);
  const [cards, setCards] = useState(flashcards)

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setCards((prevCards) => {
        const newCards = [...prevCards]
        const [first, ...rest] = newCards
        return [...rest, first]
      })
    }
  }

  return (
    <div className="relative w-full  flex justify-center items-center m-10">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute  w-fit "
            initial={{ scale: 1 }}
            animate={{ scale: 1 * 1.05 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card front={card.front} back={card.back} index={card.id} onSwipe={handleSwipe} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

