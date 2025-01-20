// import axios from 'axios'
// import { NextResponse } from 'next/server'

// const NebiusAPIKEY = process.env.NEBIUS_API_KEY!

// export async function POST (req: Request) {
//   const body = await req.json()
//   const { story_title, innerPrompt } = body

//   console.log('storytitle: ', story_title)
//   console.log('innerprompt: ', innerPrompt)

//   const current_prompt = `
//       You are an AI specialized in generating creative visual illustration for kid story book. Based on the given inputs, create/generating a cartoon/anime-style illustration.

//       Story Title: ${story_title}
//       Plot Context: ${innerPrompt}

//       Requirements:
//       1. The characters must have consistent designs across all illustrations for this story - ${story_title}. Use the defined traits (Pixel: sleek, silver, rounded; Byte: cobalt-blue, square-shaped) to ensure uniformity.
//       2. The environment should match the whimsical and tech-inspired tone of the story. Incorporate glowing servers, magical wires, and vibrant digital elements to reflect the magical land of Internetia.
//       3. Use vibrant, kid-friendly colors and a cartoon/anime-inspired style with exaggerated features to make the illustration expressive and engaging.
//       4. The illustration should emphasize the excitement and curiosity of the Characters as they interact with given Plot or the relevant scene from the story.

//       Focus on creating a cohesive and entertaining visual that aligns with the whimsical adventures of Characters in the magical land of Internetia.
//     `

//   const url = 'https://api.studio.nebius.ai/v1/images/generations'

//   const data = {
//     width: 1024,
//     height: 768,
//     num_inference_steps: 4,
//     negative_prompt: '',
//     seed: -1,
//     response_extension: 'webp',
//     response_format: 'url',
//     prompt: current_prompt,
//     model: 'black-forest-labs/flux-schnell'
//   }

//   try {
//     const response = await axios.post(url, data, {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: '*/*',
//         Authorization: `Bearer ${NebiusAPIKEY}`
//       }
//     })

//     console.log("resData: ",response.data)
//   } catch (error) {
//     console.error('Error fetching generated image:', error)
//     throw error
//   }

//   return NextResponse.json({ msg: 'img generated' }, { status: 200 })
// }

import connectToDatabase from '@/lib/db/mongo/db'
import { ImageUrlsModel } from '@/modal/schema'
import { auth } from '@clerk/nextjs/server'
import axios from 'axios'
import { NextResponse } from 'next/server'

const NebiusAPIKEY = process.env.NEBIUS_API_KEY!

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
  await connectToDatabase();

  const generatePrompt = (innerPrompt: string) => `
    You are an AI specialized in generating creative visual illustration for kid story book. Based on the given inputs, create/generate a cartoon/anime-style illustration. 

    Story Title: ${story_title}
    Plot Context: ${innerPrompt}

    Requirements:
    1. The characters must have consistent designs across all illustrations for this story - ${story_title}. Use the defined traits (Pixel: sleek, silver, rounded; Byte: cobalt-blue, square-shaped) to ensure uniformity. 
    2. The environment should match the whimsical and tech-inspired tone of the story. Incorporate glowing servers, magical wires, and vibrant digital elements to reflect the magical land of Internetia.
    3. Use vibrant, kid-friendly colors and a cartoon/anime-inspired style with exaggerated features to make the illustration expressive and engaging.
    4. The illustration should emphasize the excitement and curiosity of the Characters as they interact with given Plot or the relevant scene from the story.

    Focus on creating a cohesive and entertaining visual that aligns with the whimsical adventures of Characters in the magical land of Internetia.
  `

  const url = 'https://api.studio.nebius.ai/v1/images/generations'

  const requests = innerPrompts.map(innerPrompt => {
    const data = {
      width: 1024,
      height: 768,
      num_inference_steps: 4,
      negative_prompt: '',
      seed: -1,
      response_extension: 'webp',
      response_format: 'url',
      prompt: generatePrompt(innerPrompt),
      model: 'black-forest-labs/flux-schnell'
    }

    return axios
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: `Bearer ${NebiusAPIKEY}`
        }
      })
      .then(response => {
        // Flatten and extract the URLs
        return response.data.data.map((item: { url: string }) => item.url)
      })
      .catch(error => {
        console.error(
          `Error generating image for prompt "${innerPrompt}":`,
          error.message
        )
        return null // Handle errors gracefully by returning null for failed prompts
      })
  })

  try {

    console.log('userid: ', userId)
    console.log('videoId: ', videoId)
    console.log('generating image urls...')

    const imageDataFind = await ImageUrlsModel.findOne({
      userId: userId,
      videoId: videoId
    }).select('_id imageURLs')

    
    if (imageDataFind) {
      console.log('imageDatafind:', imageDataFind)
      return NextResponse.json({ imageURLs: imageDataFind.imageURLs }, { status: 200 })
    } else {
      console.log('not found in db, generating new images...')
      const imageUrls = await Promise.all(requests)
      // Filter out any null responses (failed requests)
      const successfulUrls = imageUrls.filter(url => url !== null).flat()
      console.log('imageURLs:', successfulUrls)
      console.log('type of imageURLs:', typeof successfulUrls)
      console.log('userID:', userId)
      console.log('videoID: ', videoId)

      // we have to store it somewheree in db so we have
      console.log('image is stored in db..')
      const imageData = await ImageUrlsModel.create({
        userId: userId,
        videoId: videoId,
        imageURLs: successfulUrls
      })

      console.log("Stored img data:",imageData)

      return NextResponse.json({ imageURLs: successfulUrls, imageDataId:  imageData._id }, { status: 200 })
    }

    // return NextResponse.json({msg: 'img genrtd'})
  } catch (error) {
    console.error('Error generating images:', error)
    return NextResponse.json(
      { error: 'Failed to generate images for one or more prompts.' },
      { status: 500 }
    )
  }
}
