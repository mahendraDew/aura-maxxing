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
interface VideoNotes extends Document {
  userId: String,
  videoId: mongoose.Types.ObjectId;
  revisedNotes: string;
  flashcards: string;
  projectList: string;
  storytelling: string;
}

const VideoNotesSchema = new Schema<VideoNotes>(
  {
    userId: {type: String},
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    revisedNotes: { type: String },
    flashcards: { type: String },
    projectList: { type: String },
    storytelling: { type: String },
  },
  { timestamps: true }
);

const VideoNotesModel = mongoose.models.VideoNotesContent || mongoose.model<VideoNotes>("VideoNotesContent", VideoNotesSchema);

// Export Models
export { VideoModel, VideoNotesModel};
