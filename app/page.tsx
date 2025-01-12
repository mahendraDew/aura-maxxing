'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Youtube,
  Brain,
  FlaskConical,
  Target,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import { Spotlight } from '@/components/ui/Spotlight'
import { ModernCard } from '@/components/moderncard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import ModeToggle from '@/components/mode-toggle'

const faqs = [
  {
    question: 'How does AURA MAXXing work?',
    answer:
      'AURA MAXXing uses advanced AI to analyze YouTube videos and generate learning materials such as key points, flashcards, quizzes, and project recommendations. Simply paste a YouTube URL, and our system will do the rest!'
  },
  {
    question: 'Is AURA MAXXing free to use?',
    answer:
      'We offer a free tier with limited features. For full access to all features, we have affordable subscription plans available.'
  },
  {
    question: 'Can I use AURA MAXXing for any YouTube video?',
    answer:
      "Yes, AURA MAXXing works with any publicly available YouTube video. However, the quality of the generated content may vary depending on the video's educational value and clarity."
  }
]

export default function Home () {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <main className='min-h-screen'>
      {/* Hero Section */}
<div className='fixed right-5 top-5 z-40'>
  <ModeToggle />
</div>
      <section className='relative h-screen flex items-center justify-center overflow-hidden'>
        <Spotlight
          className='-top-40 left-0 md:left-60 md:-top-20'
          fill='#696969'
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-background z-0" /> */}
        <div className='container mx-auto px-4 z-10'>
          <motion.div
            initial='initial'
            animate='animate'
            variants={fadeIn}
            className='text-center'
          >
            <h1 className='text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50'>
              AURA Maxxing
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-muted-foreground'>
              Level up your knowledge game with AI-powered learning
            </p>
            <div className='flex gap-4 justify-center'>
              <Link href='/dashboard'>
                <Button size='lg' className='group'>
                  Get Started
                  <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
              <Link href='/signin'>
                <Button size='lg' variant='outline'>
                  Signin
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 flex justify-center items-center'>
        <ModernCard className='max-w-7xl'>
          <div className='container mx-auto px-4'>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-center mb-16'
            >
              <h2 className='text-4xl font-bold mb-4 text-gray-100'>How It Works</h2>
              <p className='text-muted-foreground text-lg'>
                Transform any YouTube video into a personalized learning
                experience
              </p>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {[
                {
                  icon: Youtube,
                  title: 'Drop a Link',
                  description: 'Share any YouTube video you want to learn from'
                },
                {
                  icon: Brain,
                  title: 'AI Analysis',
                  description:
                    'Our AI breaks down the content into digestible pieces'
                },
                {
                  icon: FlaskConical,
                  title: 'Generate Resources',
                  description:
                    'Get flashcards, summaries, and quizzes automatically'
                },
                {
                  icon: Target,
                  title: 'Track Progress',
                  description: 'Monitor your learning journey and improve'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className='p-6 rounded-lg backdrop-blur-sm bg-card/50 hover:bg-card/80 transition-colors'
                >
                  <feature.icon className='w-12 h-12 mb-4 text-primary' />
                  <h3 className='text-xl font-semibold mb-2 text-gray-300'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ModernCard>
      </section>

      {/* FAQ Section */}
      <section className='py-12 sm:py-16 px-4'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12'>
          Frequently Asked Questions
        </h2>
        <div className='max-w-3xl mx-auto'>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='text-center max-w-3xl mx-auto'
          >
            <Rocket className='w-16 h-16 mx-auto mb-6 text-primary' />
            <h2 className='text-4xl font-bold mb-4'>
              Ready to Maxx Your Aura?
            </h2>
            <p className='text-muted-foreground text-lg mb-8'>
              Join thousands of learners who are already maximizing their
              potential with AURA Maxxing
            </p>
            <Link href='/dashboard'>
              <Button size='lg' className='group'>
                Start Learning Now
                <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className='bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 py-4'>
        <div className='container mx-auto text-center'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} AURA Maxxing. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
