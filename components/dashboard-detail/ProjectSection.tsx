'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dot } from 'lucide-react'

interface ProjectProps {
 projectList: {
   category: string
   title: string
   description: string
   steps: {
     context: string
     description: string
   }[]
 }[]
}


export default function ProjectSection({ projectList }: ProjectProps) {
 const categories = [...new Set(projectList.map(project => project.category))]

 return (
   <div className='space-y-6'>
     <h2 className='text-2xl md:text-3xl font-bold mb-6'>
       Project Recommendations
     </h2>
     <Tabs defaultValue={categories[0]} className="w-full">
       <TabsList>
         {categories.map((category, index) => (
           <TabsTrigger key={index} value={category}>{category}</TabsTrigger>
         ))}
       </TabsList>
       {categories.map((category, index) => (
         <TabsContent key={index} value={category}>
           <div className="space-y-4">
             {projectList.filter(project => project.category === category).map((project, projectIndex) => (
               <Card key={projectIndex}>
                 <CardHeader>
                   <CardTitle className='text-2xl'>{project.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <p className="mb-5 flex gap-1"> <Dot /> {project.description}</p>
                   <Accordion type="single" collapsible className="w-full">
                   <p className='text-sm font-light text-gray-600 dark:text-gray-400'>
                    Steps to approach this project :
                    </p> 
                    <div className='px-5'>

                     {project.steps.map((step, stepIndex) => (
                         <AccordionItem key={stepIndex} value={`step-${stepIndex}`}>
                         <AccordionTrigger>{step.context}</AccordionTrigger>
                         <AccordionContent>
                           <p>{step.description}</p>
                         </AccordionContent>
                       </AccordionItem>
                     ))}
                     </div>
                   </Accordion>
                 </CardContent>
               </Card>
             ))}
           </div>
         </TabsContent>
       ))}
     </Tabs>
   </div>
 )
}

