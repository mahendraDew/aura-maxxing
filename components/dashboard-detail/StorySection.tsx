// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import Image from 'next/image'

// interface StoryProps {
//   story: {
//     title: string
//     paragraphs: Array<{
//       text: string
//       prompt: string
//     }>
//   }, 
//   images: {
//     prompt: string;
// }[]
// }

// // export default function StorySection ({ story }: StoryProps) {
// export default function StorySection ({ story, images }: StoryProps) {
//   const [currentPage, setCurrentPage] = useState(0)
//   const [direction, setDirection] = useState(1) // 1 for right, -1 for left
//   const [isPlaying, setIsPlaying] = useState(true)
//   const [showPlayAgain, setShowPlayAgain] = useState(false)
//   const textRef = useRef<HTMLDivElement>(null)


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
//       }, 10000) // Change image every 10 seconds
//     }
//     return () => clearInterval(timer)
//   }, [isPlaying, story.paragraphs.length])

//   useEffect(() => {
//     if (textRef.current) {
//       textRef.current.scrollTop = textRef.current.scrollHeight
//     }
//   }, [currentPage])

//   const handlePlayAgain = () => {
//     setCurrentPage(0)
//     setDirection(1)
//     setIsPlaying(true)
//     setShowPlayAgain(false)
//   }

//   return (
//     <Card className='bg-card text-card-foreground'>
//       <CardHeader>
//         <CardTitle>{story.title}</CardTitle>
//       </CardHeader>
//       <CardContent className='space-y-4'>
//         <div className='relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg'>
//           <AnimatePresence initial={false}>
//             <motion.div
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//             >
//               <motion.div
//                 animate={{
//                   x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
//                   scale: [1, 1.1, 1],
//                   transition: { duration: 20, repeat: Infinity }
//                 }}
//                 className='absolute inset-0'
                
//               >
//                 <Image
//                   src={images[currentPage].prompt}
//                   alt={`Story illustration ${currentPage + 1}`}
//                   layout='fill'
//                   objectFit='cover'
//                 />
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//         <div
//           ref={textRef}
//           className='h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg'
//         >
//           <AnimatePresence mode='wait'>
//             <motion.p
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//               className='text-sm'
//             >
//               {story.paragraphs[currentPage].text}
//             </motion.p>
//           </AnimatePresence>
//         </div>
//       </CardContent>

//       {showPlayAgain && (
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className='p-6'>
//               <CardContent className='flex flex-col justify-center items-center'>
//                 <h3 className='text-xl font-bold mb-4'>Story Finished</h3>
//                 <Button onClick={handlePlayAgain}>Play Again</Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       )}
//     </Card>

    
//   )
// }




//////////////////////////////////////////////////////////////////////////////////////////////




// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';

// interface StoryProps {
//   story: {
//     title: string;
//     paragraphs: Array<{
//       text: string;
//       prompt: string;
//     }>;
//   };
//   images: {
//     prompt: string;
//   }[];
// }

// export default function StorySection({ story, images }: StoryProps) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [direction, setDirection] = useState(1); // 1 for right, -1 for left
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [showPlayAgain, setShowPlayAgain] = useState(false);
//   const [narrationAudio, setNarrationAudio] = useState<HTMLAudioElement | null>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   // Fetch and play narration when the page changes
//   useEffect(() => {
//     const fetchAndPlayAudio = async (text: string) => {
//       try {
//         const response = await fetch('/api/text-to-speech', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text }),
//         });

//         const data = await response.json();

//         if (!response.ok || !data.audio) {
//           throw new Error('Failed to generate audio');
//         }

//         const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
//         audio.onended = () => setIsPlaying(false); // Stop when narration ends
//         setNarrationAudio(audio);
//         audio.play();
//         setIsPlaying(true);
//       } catch (error) {
//         console.error('Error generating audio:', error);
//       }
//     };

//     if (story.paragraphs[currentPage]?.text) {
//       fetchAndPlayAudio(story.paragraphs[currentPage].text);
//     }
//   }, [currentPage, story.paragraphs]);

//   // Auto-scroll the text container
//   useEffect(() => {
//     if (textRef.current) {
//       textRef.current.scrollTop = textRef.current.scrollHeight;
//     }
//   }, [currentPage]);

//   // Auto-advance pages with narration
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isPlaying) {
//       timer = setInterval(() => {
//         setCurrentPage((prev) => {
//           if (prev + 1 >= story.paragraphs.length) {
//             setIsPlaying(false);
//             setShowPlayAgain(true);
//             return prev;
//           }
//           return prev + 1;
//         });
//         setDirection((prev) => prev * -1); // Alternate direction
//       }, 10000); // Change image every 10 seconds
//     }
//     return () => clearInterval(timer);
//   }, [isPlaying, story.paragraphs.length]);

//   const handlePlayAgain = () => {
//     setCurrentPage(0);
//     setDirection(1);
//     setIsPlaying(true);
//     setShowPlayAgain(false);
//   };

//   const handlePausePlay = () => {
//     if (narrationAudio) {
//       if (isPlaying) {
//         narrationAudio.pause();
//       } else {
//         narrationAudio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <Card className="bg-card text-card-foreground">
//       <CardHeader>
//         <CardTitle>{story.title}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg">
//           <AnimatePresence initial={false}>
//             <motion.div
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//             >
//               <motion.div
//                 animate={{
//                   x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
//                   scale: [1, 1.1, 1],
//                   transition: { duration: 20, repeat: Infinity },
//                 }}
//                 className="absolute inset-0"
//               >
//                 <Image
//                   src={images[currentPage].prompt}
//                   alt={`Story illustration ${currentPage + 1}`}
//                   layout="fill"
//                   objectFit="cover"
//                 />
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//         <div
//           ref={textRef}
//           className="h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg"
//         >
//           <AnimatePresence mode="wait">
//             <motion.p
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//               className="text-sm"
//             >
//               {story.paragraphs[currentPage].text}
//             </motion.p>
//           </AnimatePresence>
//         </div>
//       </CardContent>

//       <CardContent className="flex justify-end space-x-2">
//         <Button onClick={handlePausePlay}>
//           {isPlaying ? 'Pause Narration' : 'Play Narration'}
//         </Button>
//       </CardContent>

//       {showPlayAgain && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-6">
//               <CardContent className="flex flex-col justify-center items-center">
//                 <h3 className="text-xl font-bold mb-4">Story Finished</h3>
//                 <Button onClick={handlePlayAgain}>Play Again</Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       )}
//     </Card>
//   );
// }



// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';

// interface StoryProps {
//   story: {
//     title: string;
//     paragraphs: Array<{
//       text: string;
//       prompt: string;
//     }>;
//   };
//   images: {
//     prompt: string;
//   }[];
// }

// export default function StorySection({ story, images }: StoryProps) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [direction, setDirection] = useState(1); // 1 for right, -1 for left
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [showPlayAgain, setShowPlayAgain] = useState(false);
//   const [narrationAudio, setNarrationAudio] = useState<HTMLAudioElement | null>(null);
//   const textRef = useRef<HTMLDivElement>(null);

//   // Combine all paragraphs into a single string
//   const fullText = story.paragraphs.map(paragraph => paragraph.text).join(' ');

//   // Fetch and play narration for the full story text
//   useEffect(() => {
//     const fetchAndPlayAudio = async (text: string) => {
//       try {
//         const response = await fetch('/api/text-to-speech', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text }),
//         });

//         const data = await response.json();

//         if (!response.ok || !data.audio) {
//           throw new Error('Failed to generate audio');
//         }

//         const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
//         audio.onended = () => setIsPlaying(false); // Stop when narration ends
//         setNarrationAudio(audio);
//         audio.play();
//         setIsPlaying(true);
//       } catch (error) {
//         console.error('Error generating audio:', error);
//       }
//     };

//     if (fullText) {
//       fetchAndPlayAudio(fullText);
//     }
//   }, []); // Run effect when fullText changes

//   // Auto-scroll the text container
//   useEffect(() => {
//     if (textRef.current) {
//       textRef.current.scrollTop = textRef.current.scrollHeight;
//     }
//   }, [currentPage]);

//   // Auto-advance pages with narration
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (isPlaying) {
//       timer = setInterval(() => {
//         setCurrentPage((prev) => {
//           if (prev + 1 >= story.paragraphs.length) {
//             setIsPlaying(false);
//             setShowPlayAgain(true);
//             return prev;
//           }
//           return prev + 1;
//         });
//         setDirection((prev) => prev * -1); // Alternate direction
//       }, 10000); // Change image every 10 seconds
//     }
//     return () => clearInterval(timer);
//   }, [isPlaying, story.paragraphs.length]);

//   const handlePlayAgain = () => {
//     setCurrentPage(0);
//     setDirection(1);
//     setIsPlaying(true);
//     setShowPlayAgain(false);
//   };

//   const handlePausePlay = () => {
//     if (narrationAudio) {
//       if (isPlaying) {
//         narrationAudio.pause();
//       } else {
//         narrationAudio.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   return (
//     <Card className="bg-card text-card-foreground">
//       <CardHeader>
//         <CardTitle>{story.title}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg">
//           <AnimatePresence initial={false}>
//             <motion.div
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//             >
//               <motion.div
//                 animate={{
//                   x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
//                   scale: [1, 1.1, 1],
//                   transition: { duration: 20, repeat: Infinity },
//                 }}
//                 className="absolute inset-0"
//               >
//                 <Image
//                   src={images[currentPage].prompt}
//                   alt={`Story illustration ${currentPage + 1}`}
//                   layout="fill"
//                   objectFit="cover"
//                 />
//               </motion.div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//         <div
//           ref={textRef}
//           className="h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg"
//         >
//           <AnimatePresence mode="wait">
//             <motion.p
//               key={currentPage}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//               className="text-sm"
//             >
//               {story.paragraphs[currentPage].text}
//             </motion.p>
//           </AnimatePresence>
//         </div>
//       </CardContent>

//       <CardContent className="flex justify-end space-x-2">
//         <Button onClick={handlePausePlay}>
//           {isPlaying ? 'Pause Narration' : 'Play Narration'}
//         </Button>
//       </CardContent>

//       {showPlayAgain && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-6">
//               <CardContent className="flex flex-col justify-center items-center">
//                 <h3 className="text-xl font-bold mb-4">Story Finished</h3>
//                 <Button onClick={handlePlayAgain}>Play Again</Button>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       )}
//     </Card>
//   );
// }



'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface StoryProps {
  story: {
    title: string;
    paragraphs: Array<{
      text: string;
      prompt: string;
    }>;
  };
  images: {
    prompt: string;
  }[];
}

export default function StorySection({ story, images }: StoryProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [narrationAudio, setNarrationAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [disable, setDisable] = useState(false); // 
  const textRef = useRef<HTMLDivElement>(null);

  // Concatenate all paragraphs into a single text for narration
  const fullText = story.paragraphs.map(paragraph => paragraph.text).join(' ');

  // Fetch and play narration when the "Start Narration" button is clicked
  const startNarration = async () => {
    setIsLoading(true); // Start loading state
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText }),
      });

      const data = await response.json();

      if (!response.ok || !data.audio) {
        // throw new Error('Failed to generate audio');
        toast("Error generating audio", {
          description: 'probably im out of credit! 😭😭'
        })
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
      audio.onended = () => setIsPlaying(false); // Stop when narration ends
      setNarrationAudio(audio);
      audio.play();
      setIsPlaying(true);
      setDisable(true);
    } catch (error) {
      console.error('Error generating audio:', error);
      toast("Sorry there's some error generating audio", {
        description: 'probably im out of credit! 😭😭'
      })
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  // Auto-scroll the text container
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [currentPage]);

  // Auto-advance pages with narration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentPage((prev) => {
          if (prev + 1 >= story.paragraphs.length) {
            setIsPlaying(false);
            setShowPlayAgain(true);
            return prev;
          }
          return prev + 1;
        });
        setDirection((prev) => prev * -1); // Alternate direction
      }, 20000); // Change image every 10 seconds
    }
    return () => clearInterval(timer);
  }, [isPlaying, story.paragraphs.length]);

  const handlePlayAgain = () => {
    setCurrentPage(0);
    setDirection(1);
    setIsPlaying(true);
    setShowPlayAgain(false);
  };

  const handlePausePlay = () => {
    if (narrationAudio) {
      if (isPlaying) {
        narrationAudio.pause();
      } else {
        narrationAudio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-[32rem] max-h-[32rem] overflow-hidden rounded-lg">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{
                  x: direction > 0 ? ['0%', '5%'] : ['0%', '-5%'],
                  scale: [1, 1.1, 1],
                  transition: { duration: 20, repeat: Infinity },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentPage].prompt}
                  alt={`Story illustration ${currentPage + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          ref={textRef}
          className="h-48 overflow-y-auto space-y-2 p-4 bg-muted rounded-lg"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-sm"
            >
              {story.paragraphs[currentPage].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </CardContent>

      <CardContent className="flex justify-end space-x-2">
        {isLoading ? (
          <Button disabled>Loading...</Button>
        ) : (
          <Button onClick={startNarration}>Start Narration</Button>
        )}
        <Button onClick={handlePausePlay} disabled={!disable}>
          {isPlaying ? 'Pause Narration' : 'Play Narration'}
        </Button>
      </CardContent>

      {showPlayAgain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <CardContent className="flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Story Finished</h3>
                <Button onClick={handlePlayAgain}>Play Again</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Card>
  );
}
