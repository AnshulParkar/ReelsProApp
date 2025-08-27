import { model, models } from "mongoose";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    transformation?: {
        video: {
            width: number;
            height: number;
            quality?: number;
        };
        thumbnail: {
            width: number;
            height: number;
        };
    };
}

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        controls: { type: Boolean, default: true },
        transformation: {
            video: {
                width: { type: Number, default: VIDEO_DIMENSIONS.width },
                height: { type: Number, default: VIDEO_DIMENSIONS.height },
                quality: { type: Number, default: 80 }
            },
            thumbnail: {
                width: { type: Number, default: 320 },
                height: { type: Number, default: 180 }
            }
        }
    },
    {
        timestamps: true
    }
);

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
