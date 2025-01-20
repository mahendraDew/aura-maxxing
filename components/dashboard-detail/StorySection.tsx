// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'
// import { toast } from 'sonner'
// import axios from 'axios'
// // import connectToDatabase from '@/lib/db/mongo/db'
// // import { ImageUrlsModel } from '@/modal/schema'

// interface StoryProps {
//   story: {
//     title: string
//     paragraphs: Array<{
//       text: string
//       prompt: string
//     }>
//   }
//   userId: string
//   videoId: string
// }

// export default function StorySection ({ story, videoId, userId }: StoryProps) {
//   const [currentPage, setCurrentPage] = useState(0)
//   const [direction, setDirection] = useState(1) // 1 for right, -1 for left
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [showPlayAgain, setShowPlayAgain] = useState(false)
//   const [narrationAudio, setNarrationAudio] = useState<HTMLAudioElement | null>(
//     null
//   )
//   const [isLoading, setIsLoading] = useState(false) // New loading state
//   const [disable, setDisable] = useState(false) //
//   const [startNaratingDisable, setStartNaratingDisable] = useState(false) //
//   const textRef = useRef<HTMLDivElement>(null)
//   const [newStoryLoading, setNewStoryLoading] = useState(true)
//   const [imageURLs, setImageURLs] = useState<string[]>([])

//   // Concatenate all paragraphs into a single text for narration
//   const fullText = story.paragraphs.map(paragraph => paragraph.text).join(' ')

//   const speakText = (text: string) => {
//     // Cancel any ongoing narration
//     window.speechSynthesis.cancel()

//     if (!text || !('speechSynthesis' in window)) {
//       console.error('Speech is not supported or text is empty.')
//       return
//     }

//     const utterance = new SpeechSynthesisUtterance(text)

//     utterance.onstart = () => {
//       setIsPlaying(true)
//       console.log('Narration started:', text)
//     }

//     utterance.onend = () => {
//       setIsPlaying(false)
//       console.log('Narration ended.')
//     }

//     utterance.onerror = (error) => {
//       console.error('Error during narration:', error)
//       setIsPlaying(false)
//     }

//     // Set voice options
//     const voices = window.speechSynthesis.getVoices()
//     utterance.voice = voices.find((voice) => voice.lang === 'en-US') || voices[0]
//     utterance.lang = 'en-US'
//     utterance.rate = 1
//     utterance.pitch = 1
//     utterance.volume = 1

//     window.speechSynthesis.speak(utterance)
//   }

//   // Fetch and play narration when the "Start Narration" button is clicked
//   const startNarration = async () => {
//     console.log('narrating the story...')
//     setStartNaratingDisable(true)
//     setIsLoading(true) // Start loading state
//     //////////////////////////////////////////////////////////////////////////////////////
//     // try {
//     //   const response = await fetch('/api/text-to-speech', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ text: fullText })
//     //   })

//     //   const data = await response.json()

//     //   if (!response.ok || !data.audio) {
//     //     // throw new Error('Failed to generate audio');
//     //     toast('Error generating audio', {
//     //       description: 'probably im out of credit! 😭😭'
//     //     })
//     //   }

//     //   const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`)
//     //   audio.onended = () => setIsPlaying(false) // Stop when narration ends
//     //   setNarrationAudio(audio)
//     //   audio.play()
//     //   setIsPlaying(true)
//     //   setDisable(true)
//     // } catch (error) {
//     //   console.error('Error generating audio:', error)
//     //   toast("Sorry there's some error generating audio", {
//     //     description: 'probably im out of credit! 😭😭'
//     //   })
//     // } finally {
//     //   setIsLoading(false) // End loading state
//     // }

//     ////////////////////////////////////////////////////////////////////////////////////////////////
//     // try {
//     //   if (!('speechSynthesis' in window)) {
//     //     console.error('Speech synthesis is not supported in this browser.')
//     //     return
//     //   }

//     //   if (!fullText || fullText.trim().length === 0) {
//     //     console.error('Text is empty. Cannot start narration.')
//     //     return
//     //   }

//     //   // Cancel any ongoing narration
//     //   window.speechSynthesis.cancel()

//     //   // Create a new utterance
//     //   // const utterance = new SpeechSynthesisUtterance(fullText);
//     //   // Split the fullText into manageable chunks (e.g., 250 characters per chunk)
//     //   const chunkSize = 250
//     //   const textChunks =
//     //     fullText.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || []

//     //   // Function to play each chunk sequentially
//     //   const playChunk = (index: number) => {
//     //     if (index >= textChunks.length) {
//     //       setIsPlaying(false)
//     //       setStartNaratingDisable(false)
//     //       console.log('Narration ended.')
//     //       return
//     //     }

//     //     const utterance = new SpeechSynthesisUtterance(textChunks[index])

//     //     // Set up event listeners for the utterance
//     //     utterance.onstart = () => {
//     //       console.log(
//     //         `Narration started for chunk ${index + 1} / ${textChunks.length}`
//     //       )
//     //       setIsPlaying(true)
//     //     }

//     //     utterance.onend = () => {
//     //       console.log(
//     //         `Narration ended for chunk ${index + 1} / ${textChunks.length}`
//     //       )
//     //       playChunk(index + 1) // Play the next chunk
//     //     }

//     //     utterance.onerror = error => {
//     //       console.error('Error during narration:', error)
//     //       setIsPlaying(false)
//     //       setStartNaratingDisable(false)
//     //     }

//     //     // Set voice and options
//     //     const voices = window.speechSynthesis.getVoices()
//     //     utterance.voice =
//     //       voices.find(voice => voice.lang === 'en-US') || voices[0]
//     //     utterance.lang = 'en-US'
//     //     utterance.rate = 1
//     //     utterance.pitch = 1
//     //     utterance.volume = 1

//     //     // Speak the current chunk
//     //     console.log(`Playing chunk ${index + 1}:`, textChunks[index])
//     //     window.speechSynthesis.speak(utterance)
//     //   }

//     //   // Start narrating the first chunk
//     //   setIsPlaying(true)
//     //   setStartNaratingDisable(true)
//     //   playChunk(1)
//     // } catch (error) {
//     //   console.error('Error initializing narration:', error)
//     //   setIsPlaying(false)
//     //   setStartNaratingDisable(false)
//     // } finally {
//     //   setIsLoading(false)
//     // }

//     speakText(story.paragraphs[currentPage]?.text || '')
//     setIsPlaying(true)
//     setDisable(true)

//   }

//   // Auto-scroll the text container
//   useEffect(() => {
//     if (isPlaying) {
//       speakText(story.paragraphs[currentPage]?.text || '')
//     }
//     if (textRef.current) {
//       textRef.current.scrollTop = textRef.current.scrollHeight
//     }
//   }, [currentPage])

//   // Auto-advance pages with narration
//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (isPlaying) {
//       timer = setInterval(() => {
//         setCurrentPage(prev => {
//           if (prev + 1 >= story.paragraphs.length) {
//             setIsPlaying(false)
//             setShowPlayAgain(true)
//             return prev
//           }
//           return prev + 1
//         })
//         setDirection(prev => prev * -1) // Alternate direction
//       }, 20000) // Change image every 10 seconds
//     }
//     return () => clearInterval(timer)
//   }, [isPlaying, story.paragraphs.length])

//   const handlePlayAgain = () => {
//     setCurrentPage(0)
//     setDirection(1)
//     setIsPlaying(true)
//     setShowPlayAgain(false)
//   }

//   const handlePausePlay = () => {
//     if (narrationAudio) {
//       if (isPlaying) {
//         narrationAudio.pause()
//       } else {
//         narrationAudio.play()
//       }
//       setIsPlaying(!isPlaying)
//     }
//   }

//   async function GenerateStoryFn () {
//     console.log('Generating story....')
//     setNewStoryLoading(true)
//     setIsLoading(true)
//     //we'll check in db if images is present in db or not
//     console.log('userId:', userId)
//     console.log('videoId:', videoId)
//     // await connectToDatabase();

//     try {
//       // const imageDataFind = await ImageUrlsModel.find({
//       //   userId: userId,
//       //   videoId: videoId
//       // }).select('_id imageURLs')

//       // console.log('imageDatafing:', imageDataFind)

//       // if yes get the urls if not then we'll make req to db
//       // if (imageDataFind) {
//       // console.log("imageDataFound: ", imageDataFind);
//       //   setNewStoryLoading(false)

//       // } else {
//       //   // we'll make api req to generate all the images
//       const innerPrompts = story.paragraphs.map(para => para.prompt)
//       const story_title = story.title

//       console.log('innerPromps: ', innerPrompts)

//       const response = await axios.post('/api/image-generation', {
//         story_title,
//         innerPrompts,
//         videoId
//       })
//       const data = await response.data
//       setNewStoryLoading(false)
//       setImageURLs(data.imageURLs)
//       console.log('response data: ', data)
//       // }
//       // we have to store it in db

//       // console.log("image is stored in db..", imageData._id)
//     } catch (error) {
//       console.log('error aa rha hai story vale me....:', error)
//     }

//     setIsLoading(false)
//   }

//   return (
//     <Card className='bg-card text-card-foreground'>
//       <CardHeader>
//         <CardTitle>{story.title}</CardTitle>
//       </CardHeader>

//       {newStoryLoading ? (
//         <div className='flex justify-center items-center flex-col w-full m-5 gap-3'>
//           <h3 className='text-2xl font-semibold'>Generate Full Story </h3>
//           {isLoading ? (
//             <Button disabled>Loading...</Button>
//           ) : (
//             <Button onClick={GenerateStoryFn}>Generate</Button>
//           )}
//         </div>
//       ) : (
//         <>
//           <CardContent className='space-y-4'>
//             <div className='relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg'>
//               <AnimatePresence initial={false}>
//                 <motion.div
//                   key={currentPage}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 1 }}
//                 >
//                   <motion.div
//                     animate={{
//                       x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
//                       scale: [1, 1.1, 1],
//                       transition: { duration: 20, repeat: Infinity }
//                     }}
//                     className='absolute inset-0'
//                   >
//                     <Image
//                       // src={images[currentPage].prompt}
//                       src={imageURLs[currentPage]}
//                       alt={`Story illustration ${currentPage + 1}`}
//                       layout='fill'
//                       objectFit='cover'
//                     />
//                   </motion.div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//             {/* <div>img:{imageURLs[currentPage]}</div> */}
//             <div
//               ref={textRef}
//               className='h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg'
//             >
//               <AnimatePresence mode='wait'>
//                 <motion.p
//                   key={currentPage}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 1 }}
//                   className='text-sm'
//                 >
//                   {story.paragraphs[currentPage].text}
//                 </motion.p>
//               </AnimatePresence>
//             </div>
//           </CardContent>

//           <CardContent className='flex justify-end space-x-2'>
//             {isLoading ? (
//               <Button disabled>Loading...</Button>
//             ) : (
//               <Button onClick={startNarration} disabled={startNaratingDisable}>
//                 Start Narration
//               </Button>
//             )}
//             <Button onClick={handlePausePlay} disabled={!disable}>
//               {isPlaying ? 'Pause Narration' : 'Play Narration'}
//             </Button>
//           </CardContent>

//           {showPlayAgain && (
//             <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//               <motion.div
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.8, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card className='p-6'>
//                   <CardContent className='flex flex-col justify-center items-center'>
//                     <h3 className='text-xl font-bold mb-4'>Story Finished</h3>
//                     <Button onClick={handlePlayAgain}>Play Again</Button>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </div>
//           )}
//         </>
//       )}
//     </Card>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'sonner'

interface StoryProps {
  story: {
    title: string
    paragraphs: Array<{
      text: string
      prompt: string
    }>
  }
  userId: string
  videoId: string
}

export default function StorySection ({ story, videoId }: StoryProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  //------
  const [newStoryLoading, setNewStoryLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false) // New loading state
  const [imageURLs, setImageURLs] = useState<string[]>([])

  //-----
  const dummyimages = [
    '/img/1.jpeg',
    '/img/placeholder.webp',
    '/img/placeholder-2.webp',
    '/img/placeholder-3.webp',
    '/img/placeholder-4.webp',
    '/img/placeholder-5.webp'
  ]
  const randomImage =
    dummyimages[Math.floor(Math.random() * dummyimages.length)]

  const speakText = (text: string) => {
    // Cancel any ongoing narration
    // window.speechSynthesis.cancel()
    // console.log("yes we are in speakText fn....................")
    if (!text || !('speechSynthesis' in window)) {
      // console.error('Speech synthesis is not supported or text is empty.')
      toast('Narration stopped!')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.onstart = () => {
      setIsPlaying(true)
      // console.log('Narration started:', text)
    }

    utterance.onend = () => {
      // setIsPlaying(false)
      // console.log('Narration ended.')
    }

    // utterance.onerror = error => {
    //   // console.log('during narration:', error)
    //   toast("Narration stopped!")
    //   setIsPlaying(false)
    // }

    // Set voice options
    const voices = window.speechSynthesis.getVoices()
    utterance.voice = voices.find(voice => voice.lang === 'en-US') || voices[0]
    utterance.lang = 'en-US'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
    // let index = 1;
    // console.log(`text:${index} = `, text)
    // index = index+1
  }

  // useEffect(() => {
  //   console.log("current page changed!!!!!!!!!")
  //   if (isPlaying) {
  //     console.log("is playing!!!!!!!!!")
  //     speakText(story.paragraphs[currentPage]?.text || '')
  //   }
  // }, [currentPage, isPlaying, story.paragraphs])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isPlaying) {
      // console.log("its still playing")
      // Start page animations and narration
      speakText(story.paragraphs[currentPage]?.text || '')

      timer = setInterval(() => {
        setCurrentPage(prev => {
          if (prev + 1 >= story.paragraphs.length) {
            handleStopNarration() // Stop when the story ends
            return prev
          }
          return prev + 1
        })
        setDirection(prev => prev * -1)
      }, 20000) // Change page every 20 seconds
    } else {
      // console.log("its stopped")
      // Clear interval if stopped
      if (timer) clearInterval(timer)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, currentPage, story.paragraphs])

  useEffect(() => {
    // console.log("yhaa bhi....")
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentPage(prev => {
          if (prev + 1 >= story.paragraphs.length) {
            window.speechSynthesis.cancel() // Stop narration when story ends
            return prev
          }
          return prev + 1
        })
        setDirection(prev => prev * -1)
      }, 20000) // Change page every 20 seconds

      return () => clearInterval(timer)
    }
  }, [story.paragraphs.length])

  // const handlePlayNarration = () => {
  //   setIsPlaying(true)
  //   speakText(story.paragraphs[currentPage]?.text || '')
  // }
  const handlePlayNarration = () => {
    setIsPlaying(true)
  }

  // const handleStopNarration = () => {
  //   setIsPlaying(false)
  //   window.speechSynthesis.cancel()
  // }
  const handleStopNarration = () => {
    toast('Narration stopped!')
    setIsPlaying(false)
    window.speechSynthesis.cancel() // Stop narration
    setCurrentPage(0) // Reset to the first page if needed
  }

  async function GenerateStoryFn () {
    // console.log('Generating story....')
    setIsLoading(true)
    //we'll check in db if images is present in db or not
    // console.log('userId:', userId)
    // console.log('videoId:', videoId)
    // await connectToDatabase();
    try {
      // const imageDataFind = await ImageUrlsModel.find({
      //   userId: userId,
      //   videoId: videoId
      // }).select('_id imageURLs')

      // console.log('imageDatafing:', imageDataFind)

      // if yes get the urls if not then we'll make req to db
      // if (imageDataFind) {
      //   console.log('imageDataFound: ', imageDataFind)
      //   setNewStoryLoading(false)
      // } else {
        //   // we'll make api req to generat
        //getting the images
        const innerPrompts = story.paragraphs.map(para => para.prompt)
        const story_title = story.title
        // console.log('innerPromps: ', innerPrompts)
        const response = await axios.post('/api/image-generation', {
          story_title,
          innerPrompts,
          videoId
        })
        const data = await response.data
        setNewStoryLoading(false)
        setImageURLs(data.imageURLs)
      // }
      // console.log('response data: ', data)
    } catch (error) {
      toast("Error getting the Imgages.")
      console.log('error:', error)
    }

    setIsLoading(false)
  }

  return (
    <Card className='bg-card text-card-foreground'>
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      {newStoryLoading ? (
        <div className='flex justify-center items-center flex-col w-full m-5 gap-3'>
          <h3 className='text-2xl font-semibold'>Generate Full Story </h3>
          {isLoading ? (
            <Button disabled>Loading...</Button>
          ) : (
            <Button onClick={GenerateStoryFn}>Generate</Button>
          )}
        </div>
      ) : (
        <>
          <CardContent className='space-y-4'>
            <div className='relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg'>
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentPage}
                  initial={isPlaying ? { opacity: 0 } : {}}
                  animate={isPlaying ? { opacity: 1 } : {}}
                  exit={isPlaying ? { opacity: 0 } : {}}
                  transition={isPlaying ? { duration: 1 } : {}}
                >
                  <motion.div
                    animate={
                      isPlaying
                        ? {
                            x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
                            scale: [1, 1.1, 1],
                            transition: { duration: 20, repeat: Infinity }
                          }
                        : {}
                    }
                    className='absolute inset-0'
                  >
                    <Image
                      src={imageURLs[currentPage] || randomImage}
                      alt={`Story illustration ${currentPage + 1}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              ref={textRef}
              className='h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg'
            >
              <motion.p
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className='text-sm'
              >
                {story.paragraphs[currentPage]?.text || ''}
              </motion.p>
            </div>
          </CardContent>
          <CardContent className='flex justify-end space-x-2'>
            {isPlaying ? (
              <Button onClick={handleStopNarration}>Stop</Button>
            ) : (
              <Button onClick={handlePlayNarration}>Start</Button>
            )}
          </CardContent>
        </>
      )}
    </Card>
  )
}
