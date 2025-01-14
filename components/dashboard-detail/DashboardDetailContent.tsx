'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  BookOpen,
  BrainCircuit,
  Clapperboard,
  LogOut,
  Menu,
  FileStack,
  ChevronLeft,
  Info,
  MoveRight
} from 'lucide-react'
import Link from 'next/link'
import ModeToggle from '@/components/ui/ModeToggle'
import Image from 'next/image'
import { SignOutButton } from '@clerk/nextjs'
import RevisionNotes from '../RevisionNotes'
import { CardStack } from '../CardStack'
import { Quiz } from './quize'
// import { Quiz } from './quize'
// import { NotesContent } from '@/modal/schema'
type Mode = 'notes' | 'flashcards' | 'quiz' | 'story'

export interface NotesContent {
  revisedNotes: string
  flashcards: {
    id: number
    front: string
    back: string
  }[]
  quizzes: {
    question: string
    options: { text: string }[]
    correctOption: number // Index of the correct option
  }[]
  projectList: {
    category: string
    title: string
    description: string
    steps: { context: string; description: string }[]
  }[]
  storytelling: {
    title: string
    paragraphs: { text: string; prompt: string }[]
  }
}

interface Props {
  userData: {
    imageUrl: string

    fullname: string | null

    email: string
  }
  // notesEntry: {
  //   revisedNotes: string;
  //   flashcards: {
  //     id: number
  //     front:String
  //     back: String
  //    }[];
  //   quizzes: {
  //     question: string;
  //     options: { text: string }[];
  //     correctOption: number; // Index of the correct option
  //   }[];
  //   projectList: {
  //     category: string;
  //     title: string;
  //     description: string;
  //     steps: { context: string; description: string }[];
  //   }[];
  //   storytelling: {
  //     title: string;
  //     paragraphs: { text: string; prompt: string }[];
  //   };
  // }
  serializedData: string
}

type NotesDataType = {
  revisedNotes: string
  flashcards: Array<{
    id: number
    front: string
    back: string
  }>
  quizzes: Array<{
    question: string
    options: {
      text: string
    }[]
    correctOption: number
  }>
  projectList: Array<{
    category: string
    title: string
    description: string
    steps: string[]
  }>
  storytelling: {
    title: string
    paragraphs: Array<{
      text: string
      image: string
    }>
  }
}

// export const DashboardDetailContent = ({ userData, notesEntry }: Props) => {
export const DashboardDetailContent = ({ userData, serializedData }: Props) => {
  // console.log("serialized data: ", serializedData)
  const NotesData: NotesDataType = JSON.parse(serializedData)

  // console.log(NotesData);

  const [selectedMode, setSelectedMode] = useState<Mode>('notes')
  // const [currentCard, setCurrentCard] = useState(0)
  // const [currentQuiz, setCurrentQuiz] = useState(0)
  // const [score, setScore] = useState(0)

  const sidebarItems = [
    { icon: BookOpen, label: 'Revise Notes', mode: 'notes' },
    { icon: FileStack, label: 'Flash Cards', mode: 'flashcards' },
    { icon: BrainCircuit, label: 'Quiz', mode: 'quiz' },
    { icon: Clapperboard, label: 'Story Mode', mode: 'story' }
  ]

  const Sidebar = ({ className = '' }) => (
    <div
      className={`flex flex-col  w-full h-full max-h-screen
    ${className}`}
    >
      <div className='flex justify-between items-center gap-2 '>
        <Link href='/dashboard'>
          <Button variant='outline' className='rounded-full p-3'>
            <ChevronLeft className='w-4 h-4' />
          </Button>
        </Link>
        <ModeToggle />
      </div>
      <div className='flex-1 mt-10'>
        {sidebarItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedMode === item.mode ? 'secondary' : 'ghost'}
              className='w-full justify-start mb-2'
              onClick={() => setSelectedMode(item.mode as Mode)}
            >
              <item.icon className='mr-2 h-4 w-4' />
              {item.label}
            </Button>
          </motion.div>
        ))}
      </div>

      <Separator className='my-4' />
      <div className='flex items-center gap-4 p-2'>
        <Avatar>
          <AvatarImage src={userData.imageUrl} />
          <AvatarFallback>
            {userData.fullname?.split('')[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <p className='text-sm font-medium'>{userData.fullname}</p>
          <p className='text-xs text-muted-foreground'>{userData.email}</p>
        </div>

        <SignOutButton redirectUrl='/'>
          <div className=' cursor-pointer'>
            <LogOut className='w-5 h-5 opacity-75 hover:opacity-100' />
          </div>
        </SignOutButton>
      </div>
    </div>
  )

  return (
    <div className='flex h-screen'>
      {/* Desktop Sidebar */}
      <div className='hidden md:block w-64 border-r bg-card/50 backdrop-blur-sm p-4'>
        <Sidebar />
      </div>

      {/* Mobile Header with Menu */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex items-center gap-3 p-4'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64 p-4'>
              <SheetHeader></SheetHeader>
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className='text-lg font-semibold'>
            {sidebarItems.find(item => item.mode === selectedMode)?.label}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-y-auto md:p-8 p-4 md:pt-8 pt-20'>
        <AnimatePresence mode='wait'>
          {selectedMode === 'notes' && (
            <motion.div
              key='notes'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='space-y-4'
            >
              <h2 className='text-3xl font-bold mb-6 hidden md:block'>
                Revision Notes
              </h2>
              {/* {notesEntry.revisedNotes} */}
              <RevisionNotes content={NotesData.revisedNotes} />
              {/* {notesEntry.revisedNotes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='flex items-start gap-2'
                >
                  <ChevronRight className='h-4 w-4 mt-1 text-primary flex-shrink-0' />
                  <p className='text-sm md:text-base'>{note}</p>
                </motion.div>
              ))} */}
            </motion.div>
          )}

          {selectedMode === 'flashcards' && (
            // <motion.div
            //   key='flashcards'
            //   initial={{ opacity: 0 }}
            //   animate={{ opacity: 1 }}
            //   exit={{ opacity: 0 }}
            //   className='h-[500px] flex items-center justify-center px-4'
            // >
            //   <motion.div
            //     key={currentCard}
            //     initial={{ rotateY: 0 }}
            //     whileHover={{ scale: 1.02 }}
            //     className='relative w-full max-w-[400px] h-[300px] cursor-pointer'
            //     drag='x'
            //     dragConstraints={{ left: 0, right: 0 }}
            //     onDragEnd={(e, { offset, velocity }) => {
            //       if (offset.x > 100 || velocity.x > 500) {
            //         setCurrentCard(prev => (prev + 1) % flashcards.length)
            //       }
            //     }}
            //   >
            <>
              {/* <Card className='absolute inset-0 p-4 md:p-8 flex items-center justify-center text-center backdrop-blur-sm bg-card/50'>
                  <div>
                    <p className='text-lg md:text-xl mb-4'>
                      {flashcards[currentCard].front}
                    </p>
                    <p className='text-xs md:text-sm text-muted-foreground'>
                      Swipe right for next card
                    </p>
                  </div>
                </Card> */}
              <div className=' max-h-screen'>
                <h2 className='text-3xl font-bold mb-6 hidden md:block '>
                  Flash Cards
                </h2>
                <main className='flex h-[34rem] flex-col items-center justify-center '>
                  <div className=' w-full flex justify-center items-center'>
                    <CardStack flashcard={NotesData.flashcards} />
                  </div>
                </main>
                <div className='flex  w-full justify-center'>
                  <div className='flex gap-2 px-5 max-w-3xl w-full  text-zinc-400 dark:text-zinc-500'>
                    <Info className='w-5 h-5 pt-1' />
                    <div>
                      <p className='flex gap-1'>
                        Swipe right to go to next card <MoveRight />
                      </p>
                      <p>double click to show the answer</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
            //   </motion.div>
            // </motion.div>
          )}

          {selectedMode === 'quiz' && (
            <>
              {/* <motion.div
              key='quiz'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='max-w-2xl mx-auto px-4'
            >
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
                <h2 className='text-2xl md:text-3xl font-bold hidden md:block'>
                  Quiz Time
                </h2>
                <div className='text-base md:text-lg font-semibold'>
                  Score: {score}/{quizQuestions.length}
                </div>
              </div>

              <Card className='p-4 md:p-6 backdrop-blur-sm bg-card/50'>
                <h3 className='text-lg md:text-xl mb-6'>
                {quizQuestions[currentQuiz].question}
                </h3>
                <div className='space-y-3'>
                  {quizQuestions[currentQuiz].options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant='outline'
                        className='w-full justify-start text-left text-sm md:text-base'
                        onClick={() => {
                          if (index === quizQuestions[currentQuiz].correct) {
                            setScore(prev => prev + 1)
                          }
                          setCurrentQuiz(
                            prev => (prev + 1) % quizQuestions.length
                          )
                        }}
                      > 
                        {option}
                       </Button>
                    </motion.div> 
                  ))}
                   
                </div>
              </Card>
            </motion.div> */}

              <div className=' max-h-screen'>
                <h2 className='text-3xl font-bold mb-6 hidden md:block '>
                  Quiz
                </h2>
                {/* <Quiz questions={NotesData.quizzes} /> */}
                <Quiz questions={NotesData.quizzes} />
              </div>
            </>
          )}

          {selectedMode === 'story' && (
            <motion.div
              key='story'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='relative h-[400px] md:h-[600px] overflow-hidden rounded-lg'
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 20, repeat: Infinity }
                }}
                className='absolute inset-0'
              >
                <Image
                  width={700}
                  height={400}
                  src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop'
                  alt='Story background'
                  className='w-full h-full object-cover'
                />
              </motion.div>

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '-100%' }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className='absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-background/80 to-transparent'
              >
                <p className='text-xl md:text-2xl font-bold text-center'>
                  Embark on a journey through the fundamentals of React...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
