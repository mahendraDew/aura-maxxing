import mongoose, { Schema, Document } from "mongoose";



// Video Schema
interface IVideo extends Document {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  transcript: string;
  userId: mongoose.Types.ObjectId;
  aiOutputs: mongoose.Types.ObjectId;
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    transcript: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    aiOutputs: { type: mongoose.Schema.Types.ObjectId, ref: "AIOutput" },
  },
  { timestamps: true }
);

const Video = mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema);

// AI Output Schema
// interface IAIOutput extends Document {
//   video: mongoose.Types.ObjectId;
//   revisedNotes: string;
//   flashcards: string[];
//   projectList: string[];
//   storytelling: string;
// }

// const aiOutputSchema = new Schema<IAIOutput>(
//   {
//     video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
//     revisedNotes: { type: String },
//     flashcards: [{ type: String }],
//     projectList: [{ type: String }],
//     storytelling: { type: String },
//   },
//   { timestamps: true }
// );

// const AIOutput = mongoose.models.AIOutput || mongoose.model<IAIOutput>("AIOutput", aiOutputSchema);

// Export Models
export { Video, 
    // AIOutput
 };
