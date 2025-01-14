'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Card } from './Card'

// const initialCards = [
//   { id: 1, front: 'Card 1', back: 'This is the back of Card 1' },
//   { id: 2, front: 'Card 2', back: 'This is the back of Card 2' },
//   { id: 4, front: 'Card 4', back: 'This is the back of Card 4' },
//   { id: 5, front: 'Card 5', back: 'This is the back of Card 5' },
//   { id: 6, front: 'Card 6', back: 'This is the back of Card 6' },
//   { id: 7, front: 'Card 7', back: 'This is the back of Card 7' },
//   { id: 8, front: 'Card 8', back: 'This is the back of Card 8' }
// ]

interface Props {
  flashcard: {
    id: number
    front: string
    back: string
  }[]
}

export function CardStack ({ flashcard }: Props) {
  // console.log('flashcard string: ', flashcard)

  // const flashcards = parseFlashcards(flashcard)

  // console.log("flashcardddd:", flashcards);
  // const [cards, setCards] = useState(initialCards)

  const [cards, setCards] = useState<
    { id: number; front: string; back: string }[]
  >(flashcard)

  // useEffect(() => {
  // Parse flashcards on mount when `flashcardString` is available
  // const parsedFlashcards = parseFlashcards(flashcardString)
  // console.log('Parsed Flashcards:', parsedFlashcards) // Log the parsed flashcards

  // setCards(parsedFlashcards || [])
  // }, [flashcardString])

  // console.log("flashcardddd:", cards);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setCards(prevCards => {
        const newCards = [...prevCards]
        const [first, ...rest] = newCards
        return [...rest, first]
      })
    }
  }

  return (
    <div className='relative w-full  flex justify-center items-center m-10'>
      <AnimatePresence>
        { cards.map((card) => (
          <motion.div
            key={card.id}
            className='absolute  w-fit '
            initial={{ scale: 1 }}
            animate={{ scale: 1 * 1.05 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              front={card.front}
              back={card.back}
              index={card.id}
              onSwipe={handleSwipe}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
