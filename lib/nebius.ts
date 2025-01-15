import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

import OpenAI from 'openai'

import dotenv from 'dotenv'
dotenv.config()

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY
})

// ---------flashcardschema-----------

const flashcardsSchema = z.array(
  z.object({
    id: z.number(), // Flashcard ID
    front: z.string(), // Flashcard front text
    back: z.string() // Flashcard back text
  })
)

// ---------quiz schema-----------

const QuizOptionSchema = z.object({
  text: z.string()
})

const QuizSchema = z.object({
  question: z.string(),
  options: z.array(QuizOptionSchema).length(4), // Exactly 4 options
  correctOption: z.number().int().min(0).max(3) // Correct option index
})

const QuizzesSchema = z.array(QuizSchema)

// ---------project schema-----------

// Define Zod schema for projects
const StepSchema = z.object({
  context: z.string(),
  description: z.string()
})

const ProjectSchema = z.object({
  category: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  title: z.string(),
  description: z.string(),
  steps: z.array(StepSchema)
})

const ProjectListSchema = z.array(ProjectSchema)

// ---------story schema-----------

// Define Zod schema for a story paragraph
const StoryParagraphSchema = z.object({
  text: z.string(), // The paragraph of the story
  prompt: z.string() // The associated prompt for an illustration
})

// Define Zod schema for the entire story
const StorySchema = z.object({
  title: z.string(), // The title of the story
  paragraphs: z.array(StoryParagraphSchema) // Array of paragraphs with prompts
})

declare module "openai" {
  interface ChatCompletionCreateParams {
    extra_body?: {
      guided_json?: Record<string, unknown>;
    };
  }
}

export async function getNebiusData (transcript: string) {
  try {
    
    
    // ############################################# Nebius #######################################################################
    
    console.log(' - Generating revision notes...')
    const revisionNotes = await client.chat.completions.create({
      temperature: 0.6,
      max_tokens: 512,
      top_p: 0.9,
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      messages: [
        {
          role: 'system',
          content: `AI assistant is a brand new, powerful, human-like artificial intelligence.\n
                    You are an AI assistant and an expert in programming education. Your task is to analyze the following transcript data and provide detailed and concise revision notes summarizing the main topics discussed. Ensure the notes are structured, easy to understand, and suitable for learners of all ages, including kids.\n\n
                    Please avoid generating any offensive, inappropriate, or obscene content. Focus on creating a clean, family-friendly, and educational summary that highlights key points, concepts, and examples explained in the transcript.\n\n
                    Transcript Data:
                    ${transcript}
                  `
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'analyze the following transcript data and provide detailed and concise revision notes summarizing the main topics discussed:'
            }
          ]
        }
      ]
    })
    console.log(" - Generating flashcard...")
    // const flashcards = await client.chat.completions.create({
    //   temperature: 0.6,
    //   max_tokens: 512,
    //   top_p: 0.9,
    //   model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: `You are an AI assistant and an expert in programming education.
    //                 Your task is to analyze the following transcript data and create concise, easy-to-understand flashcards.
    //                 Each flashcard should focus on one key topic or concept, including its definition or explanation, and, if applicable, an example.

    //                 Example Response Format:
    //                 [
    //                 { id: 1, front: "What is Nodemailer?", back: "A Node.js package for sending emails." },
    //                 { id: 2, front: "How to install Nodemailer?", back: "Use \`npm install nodemailer\` in your terminal." },
    //                 ...
    //                 ]

    //                 Ensure the flashcards are:
    //                 - Clean, engaging, and educational.
    //                 - Family-friendly and suitable for all ages, including kids.
    //                 - Based entirely on the transcript data provided below.

    //                 Transcript Data:
    //                 ${transcript}
    //               `
    //     },
    //     {
    //       role: 'user',
    //       content: [
    //         {
    //           type: 'text',
    //           text: 'analyze the following transcript data and create concise, easy-to-understand flashcards.'
    //         }
    //       ]
    //     }
    //   ]
    // })

    const flashcards = await client.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant and an expert in programming education.
                    Your task is to analyze the following transcript data and create concise, easy-to-understand flashcards.
                    Each flashcard should focus on one key topic or concept, including its definition or explanation, and, if applicable, an example.

                    Example Response Format:
                    [
                        { id: 1, front: "What is Nodemailer?", back: "A Node.js package for sending emails." },
                        { id: 2, front: "How to install Nodemailer?", back: "Use \`npm install nodemailer\` in your terminal." },
                        ...
                    ]

                    Ensure the flashcards are:
                    - Clean, engaging, and educational.
                    - Family-friendly and suitable for all ages, including kids.
                    - Based entirely on the transcript data provided below.

                    Transcript Data:
                    ${transcript}
                  `
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'analyze the following transcript data and create concise, easy-to-understand flashcards.'
            }
          ]
        }
      ],
      // extra_body: {
      //   guided_json: zodResponseFormat(flashcardsSchema, 'flashcard').json_schema
      //     .schema
      // }
      response_format: zodResponseFormat(flashcardsSchema, 'flashcard')

    })
    console.log(' - Generating projectlist...')
    const projectList = await client.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      messages: [
        {
          role: 'system',
          content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                    You are an AI focused on creating personalized project ideas strictly based on the provided transcript data. Analyze the content of the transcript thoroughly, identify the key topics, and generate a list of project ideas that align with and cover those topics comprehensively.

                    Guidelines:
                    - Topic-Specific Projects Only: Projects must directly relate to the main themes, technologies, or concepts mentioned in the transcript. Avoid introducing unrelated topics.
                    - Categorized by Skill Levels: Include 2-3 projects each for beginner, intermediate, and advanced levels.
                    - Actionable Steps: For each project, outline step-by-step instructions to implement the idea, ensuring the complexity matches the skill level.
                    - Progressive Learning: Beginner projects should focus on foundational skills, intermediate projects on practical implementation, and advanced projects on combining multiple skills and real-world application.
                    - Educational Focus: Ensure all content is safe for educational purposes, free from offensive or inappropriate material, and suitable for children. Avoid 18+ content or offensive language.
                    - Strict Alignment: The output should reference the topics, examples, or technologies explicitly mentioned in the transcript."

                

                    Make sure this projects should be based on the transcript provided. Focus on creating projects that enhance learning, foster creativity, and align with industry practices. Ensure the ideas are practical, achievable, and free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material. Generate a total of 3-5 projects per level, and ensure diversity in topics and technologies
                    
                    Based on the following transcript, generate a structured project list.
            
                    Each project should include:
                    - A category (Beginner, Intermediate, Advanced).
                    - A title.
                    - A description.
                    - A series of actionable steps with context and a detailed explanation.
            
                    The response must be a valid JSON array matching this format:
                    [
                        {
                            "category": "Beginner",
                            "title": "Simple Email Sender",
                            "description": "Create a Node.js application that sends a simple text-based email using Nodemailer.",
                            "steps": [
                                {
                                    "context": "Set up your environment.",
                                    "description": "Initialize a Node.js project and install Nodemailer."
                                },
                                {
                                    "context": "Configure your email.",
                                    "description": "Set up SMTP settings using your email provider."
                                }
                            ]
                        }
                    ]
            
                    Transcript:
                    ${transcript}
                  `
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze the content of the transcript thoroughly, identify the key topics, and generate a list of project ideas that align with and cover those topics comprehensively.'
            }
          ]
        }
      ],
      // extra_body: {
      //   guided_json: zodResponseFormat(ProjectListSchema, 'film').json_schema
      //     .schema
      // }
      
      response_format: zodResponseFormat(ProjectListSchema, 'projectList')

    })

    console.log(' - Generating quizzes...')
    const quizzes = await client.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      messages: [
        {
          role: 'system',
          content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                    You are an AI assistant and an expert in programming education. Your task is to analyze the following transcript data and generate a set of quiz questions based on its content. Create:

                    - 2 easy questions for beginners.
                    - 4 medium questions for intermediate learners.
                    - 4 hard questions for advanced learners.

                    For each question, provide 4 options with only one correct answer. Ensure the questions and options are relevant to the transcript content, engaging, and appropriate for learners of all ages, including kids. Avoid generating any offensive, inappropriate, or obscene content. The quiz should be educational, family-friendly, and clearly structured.

                    
                    Based on the transcript, generate a structured list of quiz questions.
            
                    Each quiz question must include:
                    - A question.
                    - Four options.
                    - The index of the correct option (0-based).
            
                    The response must be a valid JSON array matching this format:
                    [
                        {
                            "question": "What does SMTP stand for?",
                            "options": [
                                { "text": "Simple Mail Transfer Protocol" },
                                { "text": "Secure Mail Transfer Protocol" },
                                { "text": "Simple Message Transmission Protocol" },
                                { "text": "Secure Message Transmission Protocol" }
                            ],
                            "correctOption": 0
                        }
                    ]
                    For response format, refer to this schema: ${QuizzesSchema}
            
                    Ensure that:
                    - All options are meaningful and relevant.
                    - The correct answer matches the transcript content.

                    Transcript:
                    ${transcript}
                  `
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Based on the transcript, generate a structured list of quiz questions.'
            }
          ]
        }
      ],
      // extra_body: {
      //   guided_json: zodResponseFormat(QuizzesSchema, 'film').json_schema
      //     .schema
      // }
      response_format: zodResponseFormat(QuizzesSchema, 'quizzes')
    })
    console.log(' - Generating story...')
    const story = await client.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
      messages: [
        {
          role: 'system',
          content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
                    You are an AI specialized in storytelling for kids and programming education. Based on the provided {transcriptData}, craft a fun, engaging, and humorous story that explains the concepts covered in the transcript.
                    Based on the provided transcript, generate a 2 to 5 minute story (260 to 750 words) that simplifies the main concepts, adds humor and light sarcasm, and ensures the story remains fun and relatable for young readers. Use characters or scenarios that are relevant to the topic to make it more engaging.

                    Story Requirements:
                    - The story should:
                        -  Be entertaining with elements of humor and sarcasm suitable for kids.
                        -  Simplify the concepts while maintaining accuracy.
                        -  Ensure the content is entirely child-friendly (no offensive or 18+ content).
                    - The story should include:
                        -  Fun characters (e.g., a curious robot, a coding wizard, or a talking computer, etc.) generate the characters based on the trascript.
                        -  Real-world analogies to simplify programming concepts.
                        -  Clear takeaways for understanding the topic in each section of the transcript.
                    - At key moments in the story, suggest short prompts to generate kid-friendly illustrations, cartoon or anime style image, that visually represent the current topic or scene in the story (should look entertaining and cartoonish and this should be free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material ).

                    Strict Guidelines:
                    - Stick strictly to the transcript content and ensure the story accurately reflects the key ideas.
                    - Ensure the humor and sarcasm remain appropriate for children.
                    - Avoid any offensive, obscene, or inappropriate content.

                    Make sure this story should be based on the transcript provided. Focus on creating story that enhance learning, foster creativity and have eneter, and align with industry practices.
                    Ensure that the story should be for kids and free from any offensive or inappropriate content, as this content may be used for educational purposes, including children. Avoid adding any 18+ or obscene material.
                

                    Based on the following transcript, generate a creative and engaging story suitable for kids and beginners in programming.
            
                    The story should:
                    - Have a title.
                    - Be structured into paragraphs that explain key concepts in a fun, relatable way.
                    - Include a prompt for an illustration that matches each paragraph.
            
                    Example Format (these are just for examples its not strict to use name 'bolt'):
                    {
                        "title": "The Case of the Missing Email: A Node.js Adventure!",
                        "paragraphs": [
                            {
                                "text": "Once upon a time, in the land of coding, lived a super-smart robot named Bolt...",
                                "prompt": "A Cartoon/anime style illustration of Bolt, a friendly robot with glowing eyes, looking excitedly at a computer screen displaying the words 'Node Mailer'."
                            },
                            {
                                "text": "Bolt wanted to send a simple 'Hello, World!' email...",
                                "prompt": "A Cartoon/anime style illustration of Bolt writing a 'Hello, World!' email with colorful HTML code, using backticks as special magic markers."
                            }
                        ]
                    }
            
                    Ensure:
                    - The story is family-friendly, free from offensive or inappropriate content.
                    - Each prompt clearly describes what to illustrate in a way suitable for kids.
            
                    Transcript:
                    ${transcript}
                  `
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Based on the provided transcript, generate a 2 to 5 minute story (260 to 750 words) that simplifies the main concepts, adds humor and light sarcasm, and ensures the story remains fun and relatable for young readers. Use characters or scenarios that are relevant to the topic to make it more engaging.'
            }
          ]
        }
      ],
      // extra_body: {
      //   guided_json: zodResponseFormat(StorySchema, 'film').json_schema
      //     .schema
      // }
      response_format: zodResponseFormat(StorySchema, 'story')

    })

    console.log('Content is generated! ', )
    console.log("quiz: ", quizzes.choices[0].message.content)

    const genText = {
      revisionNotes: revisionNotes.choices[0].message.content,
      flashCard: JSON.parse( flashcards.choices[0].message.content!),
      projectList: JSON.parse( projectList.choices[0].message.content!),
      quiz: JSON.parse( quizzes.choices[0].message.content!),
      story: JSON.parse( story.choices[0].message.content!)
    }

    console.log('generated content:', genText)
    return genText
  } catch (error) {
    console.log('error in chat!', error)
  }
}
