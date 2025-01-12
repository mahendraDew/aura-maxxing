import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { url } = await req.json()

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock data
  const data = {
    keyPoints: [
      "Introduction to AI",
      "Machine Learning basics",
      "Neural Networks explained",
      "Applications of AI in real-world scenarios",
      "Future of AI and ethical considerations"
    ],
    flashcards: [
      { question: "What is AI?", answer: "Artificial Intelligence is the simulation of human intelligence in machines." },
      { question: "What is Machine Learning?", answer: "A subset of AI that enables systems to learn and improve from experience." },
      { question: "What are Neural Networks?", answer: "Computing systems inspired by biological neural networks in animal brains." }
    ],
    quiz: [
      {
        question: "Which of the following is NOT a type of Machine Learning?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Quantum Learning"],
        correctAnswer: 3
      },
      {
        question: "What is the main goal of supervised learning?",
        options: ["Clustering data", "Predicting outcomes", "Reinforcing actions", "Generating new data"],
        correctAnswer: 1
      }
    ],
    projects: [
      {
        title: "Build a Simple Chatbot",
        description: "Create a basic chatbot using natural language processing techniques.",
        steps: [
          "Set up a Python environment",
          "Install necessary libraries (e.g., NLTK)",
          "Implement basic text processing",
          "Create a simple response mechanism",
          "Test and refine your chatbot"
        ]
      },
      {
        title: "Image Classification with TensorFlow",
        description: "Develop an image classification model using TensorFlow and Keras.",
        steps: [
          "Prepare your dataset",
          "Design a Convolutional Neural Network (CNN)",
          "Train your model",
          "Evaluate model performance",
          "Use the model for predictions"
        ]
      }
    ],
    story: [
      {
        text: "In a world where AI reigned supreme, young Ada found herself fascinated by the intricate dance of algorithms and data.",
        image: "/story-image-1.jpg"
      },
      {
        text: "With a witty AI assistant named Siri-ously Funny, Ada embarked on a journey to unravel the mysteries of machine learning.",
        image: "/story-image-2.jpg"
      },
      {
        text: "Together, they faced challenges, debugged code, and occasionally argued about whether AI could truly appreciate a good pun.",
        image: "/story-image-3.jpg"
      }
    ]
  }

  return NextResponse.json(data)
}

