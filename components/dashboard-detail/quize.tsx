'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type Props = {
  questions: {
    question: string
    options: {
      text: string
    }[]
    correctOption: number
  }[]
}
// export function CardStack ({ flashcard }: Props) {

export function Quiz ({ questions }: Props) {
  console.log('quizes from quize: ', questions)

  const [showTotalScore, setShowTotalScore] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = () => {
    console.log('submit')
    if (selectedOption === questions[currentQuestion].correctOption) {
      setScore(prev => prev + 1)
    }
    if (currentQuestion + 1 === questions.length) {
      setShowTotalScore(true)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    console.log('next')
    setCurrentQuestion(prev => prev + 1)
    setSelectedOption(null)
    setShowResult(false)
  }

  return (
    <div data-section='quiz' className=''>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='max-w-2xl mx-auto'
        >
          {showTotalScore ? (
            <Card className='p-6 h-96 justify-center items-center'>
              <div className='w-full h-full flex justify-center items-center flex-col'>
                <p>Your Final Score is</p>
                <p className='text-7xl'>
                  {score}/{questions.length}
                </p>
                <p>
                  {(() => {
                    const percentage = (score / questions.length) * 100
                    if (percentage >= 80) {
                      return 'You are a genius!'
                    } else if (percentage <= 80 && percentage >= 40) {
                      return 'Good effort!'
                    } else {
                      return 'You need to study!'
                    }
                  })()}
                </p>
              </div>
            </Card>
          ) : (
            <Card className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>
                  Question {currentQuestion + 1}
                </h2>
                <span className='text-sm text-muted-foreground'>
                  Score: {score}/{questions.length}
                </span>
              </div>

              <div className='space-y-6'>
                <h3 className='text-lg font-medium'>
                  {questions[currentQuestion].question}
                </h3>

                <RadioGroup
                  value={selectedOption?.toString()}
                  onValueChange={value => setSelectedOption(parseInt(value))}
                  className='space-y-3'
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        disabled={showResult}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className={
                          showResult
                            ? index === questions[currentQuestion].correctOption
                              ? 'text-green-500'
                              : index === selectedOption
                              ? 'text-red-500'
                              : ''
                            : ''
                        }
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {!showResult ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className='w-full'
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={currentQuestion === questions.length - 1}
                    className='w-full'
                  >
                    Next Question
                  </Button>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>

    // <div>
    //     {questions[0].question}
    // </div>
  )
}
