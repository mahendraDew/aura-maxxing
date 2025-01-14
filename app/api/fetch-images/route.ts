import axios from "axios";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    const { prompts }: { prompts: string[] } = await req.json();

    console.log("got the prompt:", prompts)

    try {
        const images: string[] = []
        const imagePromises = prompts.map(async paragraph => {
          try {
            const response = await axios.post('https://magicloops.dev/api/loop/59db37cf-e2ba-4870-9f8c-4b7bbfe4b70d/run', {
              prompt: paragraph
            })
            if (response.data?.imageUrl) {
              images.push(
                response.data.imageUrl // Store image URL in paragraph object
              )
            } else {
              console.warn(
                `Image generation failed for prompt: ${paragraph}`
              )
            }
          } catch (error) {
            console.error(
              `Error fetching image for prompt: ${paragraph}`,
              error
            )
          }
        })

       const imgUrls =  await Promise.all(imagePromises)

        return NextResponse.json({ imgUrls }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ "err": "error hhhhhh"+error }, { status: 500 })

    }


}