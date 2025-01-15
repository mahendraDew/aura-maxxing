// import { NextResponse } from 'next/server'
// import { Innertube } from 'youtubei.js/web'

// // const youtube = await Innertube.create({
// //   lang: 'en',
// //   location: 'US',
// //   retrieve_player: false
// // })

// export async function POST (req: Request) {
//   const { url }: { url: string } = await req.json()
//   console.log('Received URL:', url)
//   try {
//     // Validate input
//     const youtube = await Innertube.create({
//       lang: 'en',
//       location: 'US',
//       retrieve_player: false
//     })

//     // const inf = await youtube.getBasicInfo(url)
//     // console.log("inf:", inf);
//     const videoIdMatch = url.match(
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*(?:\?|&)v=([^&]+)/
//       ) || url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/)
//     if (!videoIdMatch || !videoIdMatch[1]) {
//       throw new Error('Invalid YouTube URL')
//     }
//     const videoId = videoIdMatch[1]
//     console.log('Extracted videoId:', videoId)
//     const info = await youtube.getInfo(videoId)
//     const transcriptData = await info.getTranscript()
//     // console.log("tarnscriptData: ", transcriptData.transcript.content.body);
//     //@ts-ignore
//     const tdata = transcriptData.transcript.content.body.initial_segments.map(
//       segment => segment.snippet.text
//     )

//     console.log('tdata: ', tdata)
//     const longParagraph = tdata.join(' ') // Join with a space between lines

//     console.log('long para: ', longParagraph)

//     // } catch (error) {
//     //   console.error('Error fetching transcript:', error)
//     //   throw error
//     // }

//     //  console.log("tasns:", trans)

//     // Return the transcript
//     return NextResponse.json({ tdata }, { status: 200 })
//   } catch (error) {
//     console.error('Error fetching transcript:', error)

//     // Handle errors
//     return NextResponse.json(
//       { error: 'Failed to fetch transcript.', details: error },
//       { status: 500 }
//     )
//   }
// }



export async function POST (req: Request) {
}