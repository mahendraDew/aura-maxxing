// 'use client'

// import { useState } from 'react';

// const TextToSpeech = () => {
//     const [text, setText] = useState('');
//     const [audioUrl, setAudioUrl] = useState<string | null>(null);

//     const handleConvert = async () => {
//         const response = await fetch('/api/text-to-speech', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ text }),
//         });

//         const data = await response.body;
//         console.log("res: ", response)

//         if (response.ok) {
//             const blob = await response.blob();
//             const url = URL.createObjectURL(blob);
//             setAudioUrl(url);
//         } else {
//             alert('Failed to convert text to speech');
//         }
//     };

//     return (
//         <div>
//             <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Enter text to convert"
//                 rows={5}
//                 cols={50}
//             />
//             <button onClick={handleConvert}>Convert</button>
//             <div className='h-96 w-96 bg-gray-700'>

//             {audioUrl && (
//               <audio controls>
//                     <source src={audioUrl} type="audio/mpeg" />
//                     Your browser does not support the audio element.
//                 </audio>
//             )}
//             </div>
//         </div>
//     );
// };

// export default TextToSpeech;

// 'use client';

// import { useState } from 'react';

// const TextToSpeech = () => {
//     const [text, setText] = useState('');
//     const [audioUrl, setAudioUrl] = useState<string | null>(null);

//     const handleConvert = async () => {
//         const response = await fetch('/api/text-to-speech', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ text }),
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch audio');
//             return;
//         }

//         const reader = response.body?.getReader();
//         const chunks: Uint8Array[] = [];

//         if (reader) {
//             let done = false;

//             while (!done) {
//                 const { value, done: readerDone } = await reader.read();
//                 if (value) chunks.push(value);
//                 done = readerDone;
//             }
//         }

//         // Combine all chunks into a single Blob
//         const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });

//         // Create a URL for the Blob
//         const audioUrl = URL.createObjectURL(audioBlob);
//         setAudioUrl(audioUrl);
//     };

//     return (
//         <div>
//             <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Enter text to convert"
//                 rows={5}
//                 cols={50}
//             />
//             <button onClick={handleConvert}>Convert</button>
//             {audioUrl && (
//                 <audio controls>
//                     <source src={audioUrl} type="audio/mpeg" />
//                     Your browser does not support the audio element.
//                 </audio>
//             )}
//         </div>
//     );
// };

// export default TextToSpeech;

// 'use client';

// import { useState, useRef } from 'react';

// const TextToSpeech = () => {
//     const [text, setText] = useState('');
//     const [audioUrl, setAudioUrl] = useState<string | null>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);

//     const handleConvert = async () => {
//         const response = await fetch('/api/text-to-speech', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ text }),
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch audio');
//             return;
//         }

//         const reader = response.body?.getReader();
//         const chunks: Uint8Array[] = [];

//         if (reader) {
//             let done = false;

//             while (!done) {
//                 const { value, done: readerDone } = await reader.read();
//                 if (value) chunks.push(value);
//                 done = readerDone;
//             }
//         }

//         const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
//         const audioUrl = URL.createObjectURL(audioBlob);

//         console.log("audio url: ", audioUrl)

//         setAudioUrl(audioUrl);

//         // Ensure the audio plays after setting the URL
//         if (audioRef.current) {
//             audioRef.current.load(); // Load the new source
//             audioRef.current.play(); // Play the audio
//         }
//     };

//     return (
//         <div>
//             <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Enter text to convert"
//                 rows={5}
//                 cols={50}
//             />
//             <button onClick={handleConvert}>Convert</button>
//             <audio ref={audioRef} controls>
//                 {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
//                 Your browser does not support the audio element.
//             </audio>
//         </div>
//     );
// };

// export default TextToSpeech;

'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

const TextToSpeech = () => {
  const [text, setText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEle, setAudioEle] = useState<HTMLAudioElement | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const handleGenAudio = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setErr(null)

    try {
      const response = await fetch('api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'appication/json'
        },
        body: JSON.stringify({
          text
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'falied to gen data')
      }

      const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`)
      setAudioEle(audio)
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    } catch (error) {
      console.log('erro gen audio in text comp: ', error)
      setErr('error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (!audioEle) return

    if (isPlaying) {
      audioEle.pause()
    } else {
      audioEle.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className=' p-6 rounded-lg '>
      <div>
        <label>Enter text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Enter text here'
        />

        {err && <p className='text-red-700'>{err}</p>}

        <div>
          <Button onClick={handleGenAudio} disabled={isGenerating || !text.trim()}>
            {isGenerating ? "generateing..." : "gen audio"}
          </Button>

          {audioEle && (
            <Button
            onClick={handlePlayPause}
            >
              {isPlaying? "pause": "play"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}


export default TextToSpeech;