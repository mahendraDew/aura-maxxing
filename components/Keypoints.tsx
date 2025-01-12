import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KeyPointsProps {
  points: string[]
}

export function KeyPoints({ points }: KeyPointsProps) {
  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Key Points</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {points.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="list-disc list-inside"
            >
              {point}
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

