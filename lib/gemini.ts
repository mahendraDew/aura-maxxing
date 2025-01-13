import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

import dotenv from 'dotenv'
dotenv.config()

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function getGeminiData (transcript: string) {
  try {
    console.log(" - Generating revision notes...")
    const revisionNotes = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        You are an AI assistant and an expert in programming education. Your task is to analyze the following transcript data and provide detailed and concise revision notes summarizing the main topics discussed. Ensure the notes are structured, easy to understand, and suitable for learners of all ages, including kids.

        Please avoid generating any offensive, inappropriate, or obscene content. Focus on creating a clean, family-friendly, and educational summary that highlights key points, concepts, and examples explained in the transcript.

        Transcript Data:
        ${transcript}
      `,
      // prompt: `provide detailed and concise revision notes summarizing the main topics discussed in this data: ${transcript}`,
      temperature: 0.7
    })

    console.log(" - Generating flashcard...")

    const flashCard = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        You are an AI assistant and an expert in programming education. Your task is to analyze the following transcript data and create concise, easy-to-understand quick notes formatted as flashcards. Each flashcard should focus on one key topic or concept, including its definition or explanation, and, if applicable, an example (only give 10 flashcards).

        Ensure the flashcards are structured, family-friendly, and suitable for learners of all ages, including kids. Avoid generating any offensive, inappropriate, or obscene content. Keep the content clean, engaging, and educational.

        Transcript Data:
        ${transcript}


      `,
      // prompt: `Analyze the following transcript data create concise, easy-to-understand quick notes formatted as flashcards. Each flashcard should focus on one key topic or concept, including its definition or explanation, and, if applicable, an example. Here in this data: ${transcript}`,
      temperature: 0.7
    })

    console.log(" - Generating quiz...")
    const quiz = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        You are an AI assistant and an expert in programming education. Your task is to analyze the following transcript data and generate a set of quiz questions based on its content. Create:

         - 2 easy questions for beginners.
         - 4 medium questions for intermediate learners.
         - 4 hard questions for advanced learners.

        For each question, provide 4 options with only one correct answer. Ensure the questions and options are relevant to the transcript content, engaging, and appropriate for learners of all ages, including kids. Avoid generating any offensive, inappropriate, or obscene content. The quiz should be educational, family-friendly, and clearly structured.

        Transcript Data:
        ${transcript}
      `,
      // prompt: `provide detailed and concise revision notes summarizing the main topics discussed in this data: ${transcript}`,
      temperature: 0.7
    })


    console.log(" - Generating projectlist...")
    const projectList = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        You are an AI focused on creating personalized project ideas strictly based on the provided transcript data. Analyze the content of the transcript thoroughly, identify the key topics, and generate a list of project ideas that align with and cover those topics comprehensively.

        Guidelines:
        - Topic-Specific Projects Only: Projects must directly relate to the main themes, technologies, or concepts mentioned in the transcript. Avoid introducing unrelated topics.
        - Categorized by Skill Levels: Include 2-3 projects each for beginner, intermediate, and advanced levels.
        - Actionable Steps: For each project, outline step-by-step instructions to implement the idea, ensuring the complexity matches the skill level.
        - Progressive Learning: Beginner projects should focus on foundational skills, intermediate projects on practical implementation, and advanced projects on combining multiple skills and real-world application.
        - Educational Focus: Ensure all content is safe for educational purposes, free from offensive or inappropriate material, and suitable for children. Avoid 18+ content or offensive language.
        - Strict Alignment: The output should reference the topics, examples, or technologies explicitly mentioned in the transcript."


        Example Response Format:
          Beginner Project: 
          Project Name
          - Description: A brief overview of the project and how it relates to the transcript topics.
          - Steps with Context:
              1. Step Name:
                -> Context: Explain why this step is important to the project.
                ->  Description: Provide instructions on how to perform this step, including any tools or resources required.
          Repeat for other steps...


        Make sure this projects should be based on the transcript provided. Focus on creating projects that enhance learning, foster creativity, and align with industry practices. Ensure the ideas are practical, achievable, and free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material. Generate a total of 3-5 projects per level, and ensure diversity in topics and technologies        
        Transcript Data:
        ${transcript}
      `,
      temperature: 0.7
    })


    console.log(" - Generating Story...")
    const story = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        You are an AI specialized in storytelling for kids and programming education. Based on the provided {transcriptData}, craft a fun, engaging, and humorous story that explains the concepts covered in the transcript.
        Based on the provided transcript, generate a 2 to 5 minute story (260 to 750 words) that simplifies the main concepts, adds humor and light sarcasm, and ensures the story remains fun and relatable for young readers. Use characters or scenarios that are relevant to the topic to make it more engaging.


        Story Requirements:
          - The story should:
              -  Be entertaining with elements of humor and sarcasm suitable for kids.
              -  Simplify the concepts while maintaining accuracy.
              -  Ensure the content is entirely child-friendly (no offensive or 18+ content).
          - The story should include:
              -  Fun characters (e.g., a curious robot, a coding wizard, or a talking computer, etc.).
              -  Real-world analogies to simplify programming concepts.
              -  Clear takeaways for understanding the topic in each section of the transcript.
          - At key moments in the story, suggest short prompts to generate kid-friendly illustrations, cartoon or anime style image, that visually represent the current topic or scene in the story (should look entertaining and cartoonish and this should be free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material ).

        Strict Guidelines:
          - Stick strictly to the transcript content and ensure the story accurately reflects the key ideas.
          - Ensure the humor and sarcasm remain appropriate for children.
          - Avoid any offensive, obscene, or inappropriate content.


        Make sure this story should be based on the transcript provided. Focus on creating story that enhance learning, foster creativity and have eneter, and align with industry practices. 
        Ensure that the story should be for kids and free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material.    
        Transcript Data:
        ${transcript}
      `,
      // prompt: `provide detailed and concise revision notes summarizing the main topics discussed in this data: ${transcript}`,
      temperature: 0.7
    })

    console.log('Content is generated! ')

    const genText = {
      flashCard: flashCard.text,
      revisionNotes: revisionNotes.text,
      quiz: quiz.text,
      projectList: projectList.text,
      story: story.text
    }
    return genText;
  } catch (error) {
    console.log('error in chat!', error)
  }
}
