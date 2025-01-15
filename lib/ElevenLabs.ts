// import { ElevenLabsClient } from "elevenlabs";
// import { stream } from "elevenlabs";
// import { Readable } from "stream";

// const client = new ElevenLabsClient({
//   apiKey: process.env.ELEVENLABS_API,
// });





// async function main() {
//   const audioStream = await client.textToSpeech.convertAsStream(
//     "JBFqnCBsd6RMkjVDRZzb",
//     {
//       text: "This is a test",
//       model_id: "eleven_multilingual_v2",
//     }
//   );
//   // option 1: play the streamed audio locally
//   await stream(Readable.from(audioStream));
// //   // option 2: process the audio manually
// //   for await (const chunk of audioStream) {
// //     console.log(chunk);
// //   }
// }
// main();



import { ElevenLabsClient } from "elevenlabs";
import * as dotenv from "dotenv";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const createAudioStreamFromText = async (
  text: string
): Promise<Buffer> => {
  const audioStream = await client.generate({
    voice: "Rachel",
    model_id: "eleven_turbo_v2",
    text,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }

  const content = Buffer.concat(chunks);
  return content;
};