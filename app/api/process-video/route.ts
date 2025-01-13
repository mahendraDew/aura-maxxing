import connectToDatabase from '@/lib/db/mongo/db'
import { VideoModel } from '@/modal/schema'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export async function POST (req: Request) {
  const { userId } = await auth()
  const { url } = await req.json()
  console.log('url-be:', url)
  await connectToDatabase()

  try {
    // const parser = new XMLParser();
    console.log('URL!!: ' + url)

    //#1 : get the transcription of the yt video
    console.log('transcripting....')
    // const info = await ytdl.getInfo(url)
    const transcript = await YoutubeTranscript.fetchTranscript(url)
    const transcriptData = transcript.map(entry => entry.text).join(' ')

    if (!transcriptData || transcriptData === '') {
      return NextResponse.json(
        { message: 'Transcription Failed.' },
        { status: 400 }
      )
    }

    console.log('transcription: ', transcriptData)

    console.log('storign it in be....')
    //#1.1: make a db entry over this yt video and data
    const videoData = await VideoModel.create({
      url: url,
      transcript: transcriptData,
      userId: userId
    })

    console.log('videodata:', videoData)

    return NextResponse.json(
      { message: 'Video Data saved successfully', _id: videoData._id },
      { status: 201 }
    )

    //#2: hit the gemini and get all the details of the cards and functions

    // console.log("transcriptData:", transcriptData)
    return NextResponse.json({ transcriptData }, { status: 200 })
  } catch (e) {
    console.log('Exception happened:\n')
    console.log(e)
    return NextResponse.json(
      {
        msg: 'Error: cant get the transcript, ' + e
      },
      { status: 500 }
    )
  }
}
