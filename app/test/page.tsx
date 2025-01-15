// 'use client'

// import axios from 'axios'
// import { useState } from 'react'
// import { Innertube } from 'youtubei.js/web'

// export default function Home() {
//   const [url, setUrl] = useState('')
//   const [transcript, setTranscript] = useState<string[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError('')
//     setTranscript([])

//     try {
//       const result = await axios.post("/api/fetch-images", {url});
//       const data = await result.data
//       console.log("dataAAAAAAAAAA:", data);
//       // setTranscript(result)
//     } catch (err) {
//       setError('Failed to fetch transcript. Please check the URL and try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-8">
//           YouTube Transcript Generator
//         </h1>
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <form onSubmit={handleSubmit} className="mb-6">
//             <div className="mb-4">
//               <label htmlFor="url" className="block text-sm font-medium text-gray-700">
//                 YouTube Video URL
//               </label>
//               <input
//                 type="url"
//                 id="url"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="https://www.youtube.com/watch?v=..."
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
//             >
//               {isLoading ? 'Generating...' : 'Generate Transcript'}
//             </button>
//           </form>

//           {error && <p className="text-red-600 mb-4">{error}</p>}

//           {transcript.length > 0 && (
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
//               <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
//                 {transcript.map((line, index) => (
//                   <p key={index} className="mb-2">
//                     {line}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }

import React from 'react'

function test() {
  return (
    <div>test</div>
  )
}

export default test