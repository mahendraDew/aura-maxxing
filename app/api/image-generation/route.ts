// import connectToDatabase from '@/lib/db/mongo/db'
// import { ImageUrlsModel } from '@/modal/schema'
// import { auth } from '@clerk/nextjs/server'
// import axios from 'axios'
// import { NextResponse } from 'next/server'

// // const NebiusAPIKEY = process.env.NEBIUS_API_KEY!

// // export async function POST (req: Request) {
// //   const { userId } = await auth()
// //   const body = await req.json()
// //   const { story_title, innerPrompts, videoId } = body

// //   if (!Array.isArray(innerPrompts) || innerPrompts.length === 0) {
// //     return NextResponse.json(
// //       { error: 'innerPrompts must be a non-empty array.' },
// //       { status: 400 }
// //     )
// //   }

// //   console.log('storyTitle:', story_title)
// //   console.log('innerPrompts:', innerPrompts)
// //   await connectToDatabase();

// //   const generatePrompt = (innerPrompt: string) => `
// //     You are an AI specialized in generating creative visual illustration for kid story book. Based on the given inputs, create/generate a cartoon/anime-style illustration.

// //     Story Title: ${story_title}
// //     Plot Context: ${innerPrompt}

// //     Requirements:
// //     1. The characters must have consistent designs across all illustrations for this story - ${story_title}. Use the defined traits (Pixel: sleek, silver, rounded; Byte: cobalt-blue, square-shaped) to ensure uniformity.
// //     2. The environment should match the whimsical and tech-inspired tone of the story. Incorporate glowing servers, magical wires, and vibrant digital elements to reflect the magical land of Internetia.
// //     3. Use vibrant, kid-friendly colors and a cartoon/anime-inspired style with exaggerated features to make the illustration expressive and engaging.
// //     4. The illustration should emphasize the excitement and curiosity of the Characters as they interact with given Plot or the relevant scene from the story.

// //     Focus on creating a cohesive and entertaining visual that aligns with the whimsical adventures of Characters in the magical land of Internetia.
// //   `

// //   const url = 'https://api.studio.nebius.ai/v1/images/generations'

// //   const requests = innerPrompts.map(innerPrompt => {
// //     const data = {
// //       width: 1024,
// //       height: 768,
// //       num_inference_steps: 4,
// //       negative_prompt: '',
// //       seed: -1,
// //       response_extension: 'webp',
// //       response_format: 'url',
// //       prompt: generatePrompt(innerPrompt),
// //       model: 'black-forest-labs/flux-schnell'
// //     }

// //     return axios
// //       .post(url, data, {
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Accept: '*/*',
// //           Authorization: `Bearer ${NebiusAPIKEY}`
// //         }
// //       })
// //       .then(response => {
// //         // Flatten and extract the URLs
// //         return response.data.data.map((item: { url: string }) => item.url)
// //       })
// //       .catch(error => {
// //         console.error(
// //           `Error generating image for prompt "${innerPrompt}":`,
// //           error.message
// //         )
// //         return null // Handle errors gracefully by returning null for failed prompts
// //       })
// //   })

// //   try {

// //     console.log('userid: ', userId)
// //     console.log('videoId: ', videoId)
// //     console.log('generating image urls...')

// //     const imageDataFind = await ImageUrlsModel.findOne({
// //       userId: userId,
// //       videoId: videoId
// //     }).select('_id imageURLs')

// //     if (imageDataFind) {
// //       console.log('imageDatafind:', imageDataFind)
// //       return NextResponse.json({ imageURLs: imageDataFind.imageURLs }, { status: 200 })
// //     } else {
// //       console.log('not found in db, generating new images...')
// //       const imageUrls = await Promise.all(requests)
// //       // Filter out any null responses (failed requests)
// //       const successfulUrls = imageUrls.filter(url => url !== null).flat()
// //       console.log('imageURLs:', successfulUrls)
// //       console.log('type of imageURLs:', typeof successfulUrls)
// //       console.log('userID:', userId)
// //       console.log('videoID: ', videoId)

// //       // we have to store it somewheree in db so we have
// //       console.log('image is stored in db..')
// //       const imageData = await ImageUrlsModel.create({
// //         userId: userId,
// //         videoId: videoId,
// //         imageURLs: successfulUrls
// //       })

// //       console.log("Stored img data:",imageData)

// //       return NextResponse.json({ imageURLs: successfulUrls, imageDataId:  imageData._id }, { status: 200 })
// //     }

// //     // return NextResponse.json({msg: 'img genrtd'})
// //   } catch (error) {
// //     console.error('Error generating images:', error)
// //     return NextResponse.json(
// //       { error: 'Failed to generate images for one or more prompts.' },
// //       { status: 500 }
// //     )
// //   }
// // }
// import { GoogleGenAI } from '@google/genai'
// import * as fs from 'node:fs'
// const GEMINI_IMG_APIKEY = process.env.GEMINI_IMG_APIKEY!
// const POLLINATIONSAI_API_KEY = process.env.POLLINATIONSAI_API_KEY!

import { InferenceClient } from '@huggingface/inference'

const client = new InferenceClient(process.env.HF_API_KEY)

/// Use the generated image (it's a Blob)

import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import connectToDatabase from '@/lib/db/mongo/db'
import { auth } from '@clerk/nextjs/server'

import cloudinary, { UploadApiResponse } from 'cloudinary'
import { ImageUrlsModel } from '@/modal/schema'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
// const HF_API_KEY = process.env.HF_API_KEY!
// const NebiusAPIKEY = process.env.NebiusAPIKEY!

export async function POST (req: Request) {
  const { userId } = await auth()
  const body = await req.json()
  const { story_title, innerPrompts, videoId } = body

  if (!Array.isArray(innerPrompts) || innerPrompts.length === 0) {
    return NextResponse.json(
      { error: 'innerPrompts must be a non-empty array.' },
      { status: 400 }
    )
  }

  console.log('storyTitle:', story_title)
  console.log('innerPrompts:', innerPrompts)
  await connectToDatabase()

  try {
    console.log('userid: ', userId)
    console.log('videoId: ', videoId)
    console.log('generating image urls...')

    const existing = await ImageUrlsModel.findOne({
      userId,
      videoId
    }).select('_id imageURLs')

    if (existing) {
      console.log('Found in DB', existing.imageURLs)
      return NextResponse.json(
        { imageURLs: existing.imageURLs },
        { status: 200 }
      )
    }

    const results = await generateImages(innerPrompts, story_title)

    // console.log(' generated imageURLs:', results)

    const imageURLs = results.filter((url): url is string => url !== null)

    console.log(' imageURLs:', imageURLs)

    //  3. Store in MongoDB
    if (imageURLs.length > 0) {
      const imageData = await ImageUrlsModel.create({
        userId,
        videoId,
        imageURLs
      })
      console.log(' Stored in DB:', imageData._id)
      return NextResponse.json(
        {
          imageURLs,
          imageDataId: imageData._id
        },
        { status: 200 }
      )
    }

    throw new Error('Image generateion failed: Token limit hit...')
  } catch (error) {
    console.error('Image generation failed:', error)

    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    )
  }
}

async function generateImages (
  innerPrompts: string[],
  story_title: string
) {
  const imagesDir = path.join(process.cwd(), 'public', 'images')

  //  ensure folder exists
  fs.mkdirSync(imagesDir, { recursive: true })

  // const generatePrompt2 = (innerPrompt: string) => `
  //   You are an AI specialized in generating creative visual illustration for kid story book. Based on the given inputs, create/generate a cartoon/anime-style illustration.

  //   Story Title: ${story_title}
  //   Plot Context: ${innerPrompt}

  //   Requirements:
  //   1. The characters must have consistent designs across all illustrations for this story - ${story_title}. Use the defined traits (Pixel: sleek, silver, rounded; Byte: cobalt-blue, square-shaped) to ensure uniformity.
  //   2. The environment should match the whimsical and tech-inspired tone of the story. Incorporate glowing servers, magical wires, and vibrant digital elements to reflect the magical land of Internetia.
  //   3. Use vibrant, kid-friendly colors and a cartoon/anime-inspired style with exaggerated features to make the illustration expressive and engaging.
  //   4. The illustration should emphasize the excitement and curiosity of the Characters as they interact with given Plot or the relevant scene from the story.

  //   Focus on creating a cohesive and entertaining visual that aligns with the whimsical adventures of Characters in the magical land of Internetia.
  // `

  const generatePrompt2 = (innerPrompt: string) => `
    Cartoon anime-style illustration, wide cinematic composition, kid-friendly, vibrant colors.

    Scene: ${innerPrompt}

    Story Title: "${story_title}"

    Characters:
    - Pixel: sleek silver robot, rounded body, small glowing eyes, single antenna, curious and energetic
    - Byte: cobalt-blue robot, square body, digital smile, small wheels, cheerful and friendly

    Art Style:
    - soft lighting, colorful, Pixar-like + anime blend
    - smooth shading, high detail, expressive characters
    - whimsical digital world with glowing wires, floating UI elements, magical servers

    Composition (VERY IMPORTANT):
    - wide horizontal scene (like 16:5 aspect ratio)
    - keep main characters centered but with space on left and right
    - avoid cropping characters
    - background extends on both sides for camera movement (pan effect)
    - cinematic framing, slightly zoomed-out view

    Camera:
    - wide shot, slight depth of field
    - dynamic but clean composition

    Mood:
    - playful, magical, exciting, adventurous

    Negative:
    - no dark tones, no realism, no blur, no distortion, no cropped characters

    MOST IMPORTANT: 
      same characters, same appearance, same style across all scenes in one story
    `

  // const generatePrompt = (innerPrompt: string) => `
  //   Cartoon/anime style illustration, kid friendly, vibrant colors.
  //   Scene: ${innerPrompt}
  //   Keep characters consistent.
  // `

  const requests = innerPrompts.map(async innerPrompt => {
    try {
      const image = await client.textToImage({
        provider: 'hf-inference',
        model: 'stabilityai/stable-diffusion-xl-base-1.0',
        inputs: generatePrompt2(innerPrompt),
        parameters: { num_inference_steps: 5 }
      }) as unknown as Blob

      // convert blob → buffer
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // unique filename
      // const fileName = `image-${Date.now()}-${Math.random()
      //   .toString(36)
      //   .slice(2)}.png`

      // const filePath = path.join(imagesDir, fileName)

      // save
      // fs.writeFileSync(filePath, buffer)

      const result = await uploadToCloudinary(buffer)
      return result.secure_url

      // return public URL
      // return `/images/${fileName}`
    } catch (error) {
      console.error('Error for prompt:', innerPrompt, error)
      return null
    }
  })
  // async function requests() {

  //   try {
  //     const image = await client.textToImage({
  //       provider: "hf-inference",
  //       model: "stabilityai/stable-diffusion-xl-base-1.0",
  //       inputs: generatePrompt2(innerPrompts[0]),
  //       parameters: { num_inference_steps: 5 },
  //     });

  //     // convert blob → buffer
  //     const arrayBuffer = await image.arrayBuffer()
  //     const buffer = Buffer.from(arrayBuffer)

  //     // unique filename
  //     const fileName = `image-${Date.now()}-${Math.random()
  //       .toString(36)
  //       .slice(2)}.png`

  //     const filePath = path.join(imagesDir, fileName)

  //     // save
  //     // fs.writeFileSync(filePath, buffer)

  //     const result = await uploadToCloudinary(buffer)
  //     return result.secure_url

  //     // return public URL
  //     return `/images/${fileName}`
  //   } catch (error) {
  //     console.error('Error for prompt:', innerPrompts[0], error)
  //     return null
  //   }
  // }

  // run all in parallel
  // const results = await requests();
  const results = await Promise.all(requests)
  console.log('results at 333: ', results)
  // remove failed ones
  const imageURLs = results.filter((url): url is string => url !== null)

  return imageURLs
}

const uploadToCloudinary = async (buffer: Buffer) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'auramaxxing' },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('No result'))

        resolve(result)
      }
    )
    stream.end(buffer)
  })
}


// const uploadPromise: Promise<UploadApiResponse> = new Promise((resolve, reject) => {
//   cloudinary.v2.uploader.upload_stream((error, uploadResult) => {
//     if (error) return reject(error);
//     resolve(uploadResult);
//   }).end(byteArrayBuffer);
// });

// const uploadResult = await uploadPromise;

