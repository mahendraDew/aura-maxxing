import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface ProjectRecommendationsProps {
  projects: {
    title: string
    description: string
    steps: string[]
  }[]
}

export function ProjectRecommendations({ projects }: ProjectRecommendationsProps) {
  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Project Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AccordionItem value={`project-${index}`}>
                <AccordionTrigger>{project.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">{project.description}</p>
                  <ol className="list-decimal list-inside">
                    {project.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="mb-2">{step}</li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

