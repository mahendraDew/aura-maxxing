'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface QuizProps {
  questions: {
    question: string
    options: string[]
    correctOption: number
  }[]
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h3>
          <RadioGroup
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            value={selectedAnswer?.toString()}
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {showResult && (
            <p className="mt-4 font-bold">
              {selectedAnswer === questions[currentQuestion].correctOption
                ? 'Correct!'
                : 'Incorrect. Try again!'}
            </p>
          )}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleSubmit} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
            <Button variant="outline" onClick={nextQuestion}>
              Next Question
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

