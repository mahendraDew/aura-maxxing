import mongoose, { Schema, Document } from "mongoose";

// Video Schema
interface IVideo extends Document {
  url: string;
  transcript: string;
  userId: String;
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    url: { type: String, required: true },
    transcript: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const VideoModel = mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema);


type flashcard={
 id: number
 front:String
 back: String
}



// // AI Output Schema
// interface VideoNotes extends Document {
//   userId: String,
//   videoId: mongoose.Types.ObjectId;
//   revisedNotes: string;
//   flashcards: flashcard[];
//   // flashcards: string[];
//   projectList: string[];
//   storytelling: string;
// }


// Project Step Schema
const StepSchema = new Schema({
  context: { type: String, required: true },
  description: { type: String, required: true },
});

// Project Schema
const ProjectSchema = new Schema({
  category: { type: String, required: true }, // Beginner, Intermediate, Advanced
  title: { type: String, required: true },
  description: { type: String, required: true },
  steps: [StepSchema], // Array of steps
});


const OptionSchema = new Schema({
  text: { type: String, required: true },
});

const QuizSchema = new Schema({
  question: { type: String, required: true },
  options: [OptionSchema], // Array of options
  correctOption: { type: Number, required: true }, // Index of the correct option (0-3)
});




// Define the schema for a story paragraph
const StoryParagraphSchema = new Schema({
  text: { type: String, required: true }, // The paragraph of the story
  prompt: { type: String, required: true }, // The illustration prompt
});

// Define the schema for a story
const StorySchema = new Schema({
  title: { type: String, required: true }, // Title of the story
  paragraphs: [StoryParagraphSchema], // Array of story paragraphs
});

// AI Output Schema
interface VideoNotes extends Document {
  userId: String;
  videoId: mongoose.Types.ObjectId;
  revisedNotes: string;
  flashcards: flashcard[];
  quizzes: {
    question: string;
    options: { text: string }[];
    correctOption: number; // Index of the correct option
  }[];
  projectList: {
    category: string;
    title: string;
    description: string;
    steps: { context: string; description: string }[];
  }[];
  storytelling: {
    title: string;
    paragraphs: { text: string; prompt: string }[];
  };
}


export interface NotesContent {
  revisedNotes: string;
  flashcards: flashcard[];
  quizzes: {
    question: string;
    options: { text: string }[];
    correctOption: number; // Index of the correct option
  }[];
  projectList: {
    category: string;
    title: string;
    description: string;
    steps: { context: string; description: string }[];
  }[];
  storytelling: {
    title: string;
    paragraphs: { text: string; prompt: string }[];
  };
}


const VideoNotesSchema = new Schema<VideoNotes>(
  {
    userId: {type: String},
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    revisedNotes: { type: String },
    flashcards: [{ 
      id: { type: Number, required: true },
      front: { type: String, required: true },
      back: { type: String, required: true }
    }],
    // flashcards: [{type:String}],
    quizzes: [{
      question: { type: String, required: true },
      options: [{ text: String }],
      correctOption: { type: Number, required: true }, // Index of the correct option (0-3)
    }], // Array of quizzes
    projectList: [ProjectSchema], // Array of structured projects

    storytelling: {
      title: { type: String, required: true },
      paragraphs: [StoryParagraphSchema], // Link to the paragraphs schema
    },
  },
  { timestamps: true }
);

const VideoNotesModel = mongoose.models.VideoNotesContent || mongoose.model<VideoNotes>("VideoNotesContent", VideoNotesSchema);

// Export Models
export { VideoModel, VideoNotesModel };
export type { VideoNotes };
