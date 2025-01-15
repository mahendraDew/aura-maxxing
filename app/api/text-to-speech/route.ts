// import { NextRequest, NextResponse } from 'next/server';
// import { ElevenLabsClient } from 'elevenlabs';
// import { Readable } from 'stream';

import { NextResponse } from 'next/server'

// import { createAudioStreamFromText } from "@/lib/ElevenLabs";
// import { NextResponse } from "next/server";

// const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API });

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { text } = body;

//         if (!text) {
//             return NextResponse.json({ message: 'Text is required' }, { status: 400 });
//         }

//         const audioStream = await client.textToSpeech.convert('pFZP5JQG7iQjIQuC4Bku', {
//             text,
//             output_format: 'mp3_44100_128',
//             model_id: 'eleven_monolingual_v1',
//         });

//         // Convert Node.js Readable to Web ReadableStream
//         const readableStream = new ReadableStream({
//             start(controller) {
//                 audioStream.on('data', (chunk) => controller.enqueue(chunk));
//                 audioStream.on('end', () => controller.close());
//                 audioStream.on('error', (err) => controller.error(err));
//             },
//         });

//         const headers = new Headers({
//             'Content-Type': 'audio/mpeg',
//             'Content-Disposition': 'attachment; filename="output.mp3"',
//         });

//         return new NextResponse(readableStream, { headers });
//     } catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json({ message: 'Failed to convert text to speech' }, { status: 500 });
//     }
// }

// export async function POST(req: Request) {
//     try {

//         const stream = await createAudioStreamFromText(
//             "In a far-off land of coding, there lived a brilliant and curious builder named Twain. Twain loved to construct beautiful and functional websites, but she always struggled with one thing: naming her CSS classes. 'Why does it have to be so hard?' she would cry out in frustration.."
//         );

//         return NextResponse.json({stream}, {status: 200})
//     } catch (error) {
//         console.log("kuch err h: ", error)
//     }
// }

export async function POST (req: Request) {
  try {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

    if (!ELEVENLABS_API_KEY) {
      console.log('ELEVENLABS_API_KEY is not config')
      return NextResponse.json(
        { error: 'api key is not config' },
        { status: 500 }
      )
    }

    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'bad req' }, { status: 400 })
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/pFZP5JQG7iQjIQuC4Bku/stream`,
      {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      }
    );

    if(!res.ok){
        const errData = await res.json();
        console.log("ELEVEN LAB API err", errData)
        const errMsg = errData.details?.message || "failed to generate speech";

        return NextResponse.json({err:errMsg}, {status: res.status})
    }

    const audioBuffer = await res.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64")


    return NextResponse.json({audio: audioBase64})
    
    
  } catch (error) {
    console.log("text-to-speech gen err: ", error)
    return NextResponse.json({msg: "error hai bhai text-to-speech route me"}, {status: 500})

  }
}
