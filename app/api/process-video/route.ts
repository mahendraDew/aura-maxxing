import { NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

export async function POST (req: Request) {
  const { url } = await req.json()
  console.log('url-be:', url)

  try {
    // const parser = new XMLParser();
    console.log('URL!!: ' + url)

    // const info = await ytdl.getInfo(url)
    const transcript = await YoutubeTranscript.fetchTranscript(url)
    

    // console.log(transcript)
    // if (!info.player_response.captions) return null;
    // const tracks =
    //   info.player_response.captions.playerCaptionsTracklistRenderer
    //     .captionTracks;

    // if (!tracks || !tracks.length) {
    //   return "No tracks";
    // } else {
    //   //console.log(tracks);
    //   //return "Ok!";

    //   console.log("Captions:\n");
    //   console.log(first_transcript);
    //   return first_transcript;
    // }
    const transcriptData = transcript.map((entry) => entry.text).join(" ");

    // console.log("transcriptData:", transcriptData)
    return NextResponse.json({transcriptData},{ status: 200 })
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

// import ytdl from 'ytdl-core'
// import axios from 'axios'

// import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

// export const getSubTitles = async (url: string) => {
//   try {
//     const parser = new XMLParser()

//     const info = await ytdl.getInfo(url)
//     if (!info.player_response.captions) return null
//     const tracks =
//       info.player_response.captions.playerCaptionsTracklistRenderer
//         .captionTracks

//     if (!tracks || !tracks.length) return null

//     const parsedTracks = tracks

//     /*const parsedTracks = await Promise.all(
//             tracks.map(async (track) => ({
//                 lang: track.languageCode,
//                 content: parser.parse((await axios.get(track.baseUrl)).data, {
//                     ignoreAttributes: false,
//                 }),
//             })),
//         );
//         */

//     console.log(parsedTracks[0])

//     //return parsedTracks[0].content.transcript.text;
//     return 'OK!'
//   } catch (e) {
//     console.log('Exception happened:\n')
//     console.log(e)
//     return null
//   }
// }
