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
export { VideoModel, 
    // AIOutput
 };
