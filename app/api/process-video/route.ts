import connectToDatabase from '@/lib/db/mongo/db'
import { getNebiusData } from '@/lib/nebius'
import { VideoModel, VideoNotesModel } from '@/modal/schema'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { Innertube } from 'youtubei.js/web'

const youtube = await Innertube.create({
  lang: 'en',
  location: 'US',
  retrieve_player: false
})

// interface GeminiDataTypes {
//   revisionNotes: string;
//   flashCard: { id: number; front: string; back: string }[];
//   quiz: { question: string; options: { text: string }[]; correctOption: number }[];
//   projectList: {
//     category: string;
//     title: string;
//     description: string;
//     steps: { context: string; description: string }[];
//   }[];
//   story: {
//     title: string;
//     paragraphs: { text: string; prompt: string }[];
//   };
// }

export async function POST (req: Request) {
  const { userId } = await auth()
  const { url } = await req.json()
  console.log('url-be:', url)
  await connectToDatabase()

  try {
    // const parser = new XMLParser();
    console.log('URL!!: ' + url)

    //#1 : get the transcription of the yt video
    console.log('Generating Transcript...')
    // const transcript = await YoutubeTranscript.fetchTranscript(url)
    // const transcriptData = transcript.map(entry => entry.text).join(' ')

    ///////////////////////////////////////////////////////////////////////////
    const videoIdMatch =url.match(
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*(?:\?|&)v=([^&]+)/
      ) || url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/)
    if (!videoIdMatch || !videoIdMatch[1]) {
      // throw new Error('Invalid YouTube URL')
      console.log('Invalid YouTube URL, err at the time of generating transcript')
      return NextResponse.json(
        { message: 'Transcription Failed.' },
        { status: 400 }
      )
    }
    const videoId = videoIdMatch[1]
    console.log('Extracted videoId:', videoId)
    const info = await youtube.getInfo(videoId)
    const tData = await info.getTranscript()
    // console.log("tarnscriptData: ", transcriptData.transcript.content.body);
    const tdataArr = tData.transcript.content?.body?.initial_segments?.map(
      segment => segment.snippet.text
    ) || []

    // console.log('tdata: ', tdataArr)
    const transcriptData = tdataArr.join(' ')
    console.log('transcriptData: ', transcriptData)
    ///////////////////////////////////////////////////////////////////////////

    if (!transcriptData || transcriptData === '') {
      return NextResponse.json(
        { message: 'Transcription Failed.' },
        { status: 400 }
      )
    }

    console.log('Storing transcript in db...')
    //#1.1: make a db entry over this yt video and data
    const videoData = await VideoModel.create({
      url: url,
      transcript: transcriptData,
      userId: userId
    })
    console.log('VideoData id:', videoData._id)

    //#2: hit the gemini and get all the details of the cards and functions
    console.log('Generating content...')
    // const geminiData = await getGeminiData(transcriptData)
    const nebiusData = await getNebiusData(transcriptData)
    console.log('nebiusData:', nebiusData)
    // const parsedFlashcards = JSON.parse(nebiusData?.flashCard);
    // const parsedQuizzes = JSON.parse(nebiusData?.quiz);
    // const parsedProjectList = JSON.parse(nebiusData.projectList);
    // console.log("geminiData:", geminiData)

    //   const storytelling: {
    //     title: string;
    //     paragraphs: {
    //         prompt: string;
    //         text: string;
    //     }[];
    // } | undefined
    //  = geminiData?.story;

    // if (!storytelling || storytelling.paragraphs.length === 0) {
    //   return NextResponse.json({ message: "No storytelling content generated." }, { status: 400 });
    // }

    // console.log("Generating images for storytelling prompts...");
    // const imageUrls = [];

    // const magicLoopsUrl = process.env.MAGIC_LOOP_URL!;

    // for (const story of geminiData?.story.paragraphs!) {
    //   const { prompt } = story;
    //   const response = await axios.post('https://magicloops.dev/api/loop/c134bf78-8d5e-4414-ade8-be4ec6855ad7/run', { prompt });

    //   if (response.data?.imageUrl) {
    //     imageUrls.push(response.data.imageUrl);
    //   } else {
    //     console.warn(`Image generation failed for prompt: ${prompt}`);
    //   }
    // }
    // console.log("images generated...");

    // console.log("Image URLs:", imageUrls);

    // Create an array of promises for all image generation requests
    // // const imageRequests = storytelling.paragraphs.map(async (story) => {
    // //   const { prompt } = story;
    // //   try {
    // //     const response = await axios.post(magicLoopsUrl, { prompt });
    // //     if (response.data?.imageUrl) {
    // //       return response.data.imageUrl; // Resolve with image URL
    // //     } else {
    // //       console.warn(`Image generation failed for prompt: ${prompt}`);
    // //       return null; // Resolve with null if generation fails
    // //     }
    // //   } catch (error) {
    // //     console.error(`Error generating image for prompt: ${prompt}`, error);
    // //     return null; // Resolve with null if an error occurs
    // //   }
    // // });

    // // Wait for all promises to resolve
    // const imageUrls = await Promise.all(imageRequests);

    // console.log("Images generated...");
    // console.log("Image URLs:", imageUrls);

    // // Filter out any null values in the result
    // const validImageUrls = imageUrls.filter((url) => url !== null);

    // console.log("valid image urls:", validImageUrls)

    //2.1: store the gemini generated text in db:
    // console.log('parsing the flashcard...')
    // const flashcards = parseFlashcardsFromString(geminiData?.flashCard!)
    // console.log('parsed flashcard:', flashcards)

    console.log('Storing generated Notesdata in the db...')

    const NotesData = await VideoNotesModel.create({
      userId: userId,
      videoId: videoData._id,
      revisedNotes: nebiusData?.revisionNotes,
      flashcards: nebiusData?.flashCard,
      quizzes: nebiusData?.quiz,
      projectList: nebiusData?.projectList,
      storytelling: nebiusData?.story
    })

    // const storytelling = [
    //   {
    //     text: "Once upon a time, in the magical land of coding, lived a curious robot named Bolt. Bolt loved to explore new things, and one day he stumbled upon a mysterious box labeled 'GPT-3'.  Curious, Bolt opened it, and inside was a powerful tool that could generate text just like a human!",
    //     prompt: "Illustration of a friendly robot named Bolt, excitedly looking at a computer screen showing the words 'GPT-3'."
    //   },
    //   {
    //     text: "Bolt quickly learned that GPT-3 was a 'pre-trained generative transformer.'  This meant it had learned from a HUGE pile of data – like reading millions of books!  The more it read, the better it got at writing and understanding language. Think of it as learning to write by reading all the stories in the world!",
    //     prompt: "Illustration of Bolt looking at a huge pile of data books, with a robot teacher explaining how the model learns from data."
    //   }
    // ]

    //#2: Fetch Data from Magic Loops
    // console.log('Image generation Magic Loops...');
    // const magicLoopsUrl = process.env.MAGIC_LOOP_URL!;

    // const magicLoopsResponse = await axios.post(magicLoopsUrl, {
    //   input: transcriptData,
    // });

    // const magicLoopsResult = magicLoopsResponse.data;
    // console.log('Magic Loops API Response:', magicLoopsResult);

    // const responseJson = await magicLoopsResult.json();
    // console.log(responseJson);

    // console.log("transcriptData:", transcriptData)
    return NextResponse.json({ notesDataId: NotesData._id }, { status: 200 })
    // return NextResponse.json({ "msg": "asdf" }, { status: 200 })
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

// function parseFlashcards (flashcardString: string) {
//   try {
//     // const flashcardPattern =
//     // /\*\*Flashcard (\d+)\*\*\n\n\* \*\*Front:\*\* (.+?)\n\* \*\*Back:\*\* (.+?)\n/g

//     const flashcardPattern =
//       /Flashcard (\d+):\s*Front: (.+?)\s*Back: (.+?)(?=\nFlashcard|\n?$)/

//     const flashcards = []

//     let match
//     while ((match = flashcardPattern.exec(flashcardString)) !== null) {
//       const id = parseInt(match[1], 10)
//       const front = match[2].trim()
//       const back = match[3].trim()

//       flashcards.push({ id, front, back })
//     }

//     console.log('parsedFlashCarf for the parseflashcard:', flashcards)

//     return flashcards
//   } catch (error) {
//     console.error('failed to parse the flashcard')
//   }
// }

// function parseFlashcardsFromString(flashcardData: string): { id: number; front: string; back: string }[] {
//   const flashcardPattern = /Flashcard (\d+):\s*Front: (.+?)\s*Back: (.+?)(?=\nFlashcard|\n?$)/gs
//   const flashcards = []

//   let match
//   while ((match = flashcardPattern.exec(flashcardData)) !== null) {
//     const id = parseInt(match[1], 10)
//     const front = match[2].trim()
//     const back = match[3].trim()

//     flashcards.push({ id, front, back })
//   }

//   return flashcards
// }
