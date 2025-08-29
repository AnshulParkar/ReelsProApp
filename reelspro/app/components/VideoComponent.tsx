import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Heart, MessageCircle, Share2, Play, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 1000)); // Mock data
  const [commentsCount] = useState(Math.floor(Math.random() * 100)); // Mock data

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all duration-300 group">
      {/* Video */}
      <figure className="relative overflow-hidden">
        <Link href={`/videos/${video._id}`} className="relative block w-full group/video">
          <div className="relative w-full bg-black aspect-[9/16]">
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                  quality: 80
                },
              ]}
              controls={false}
              muted={true}
              className="w-full h-full object-cover"
              poster={video.thumbnailUrl}
            />
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>

            {/* Video duration (mock) */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {Math.floor(Math.random() * 60)}:{(Math.floor(Math.random() * 60)).toString().padStart(2, '0')}
            </div>
          </div>
        </Link>
      </figure>

      {/* Content */}
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content w-8 h-8 rounded-full">
                <span className="text-xs font-bold">
                  {video.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">@creator</p>
              <p className="text-xs text-base-content/60">
                {new Date(video.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" aria-label="Video options" className="btn btn-ghost btn-xs btn-circle">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
              <li><button className="text-xs">Report</button></li>
              <li><button className="text-xs">Share</button></li>
            </ul>
          </div>
        </div>

        {/* Title and description */}
        <Link href={`/videos/${video._id}`} className="block mb-3 hover:opacity-80 transition-opacity">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{video.title}</h3>
          <p className="text-xs text-base-content/70 line-clamp-2">{video.description}</p>
        </Link>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-base-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`btn btn-ghost btn-xs gap-1 ${
                isLiked ? "text-error" : "text-base-content/70 hover:text-error"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{formatCount(likesCount)}</span>
            </button>
            
            <Link href={`/videos/${video._id}#comments`} className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-primary">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{formatCount(commentsCount)}</span>
            </Link>
          </div>

          <button className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-secondary">
            <Share2 className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
