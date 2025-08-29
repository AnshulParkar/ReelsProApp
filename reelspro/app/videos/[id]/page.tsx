"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/apiclient";
import { IKVideo } from "imagekitio-next";
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Play, Pause } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useNotification } from "@/app/components/Notification";

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // Try to fetch the specific video first
        try {
          const foundVideo = await apiClient.getAVideo(params.id as string);
          setVideo(foundVideo);
        } catch (error) {
          // If specific fetch fails, fall back to searching all videos
          const videos = await apiClient.getVideos();
          const foundVideo = videos.find((v: IVideo) => 
            v._id?.toString() === params.id || v.videoUrl === params.id
          );
          
          if (!foundVideo) {
            setError("Video not found");
            return;
          }
          setVideo(foundVideo);
        }

        setLikesCount(Math.floor(Math.random() * 1000)); // Mock data
        setComments([
          {
            id: 1,
            user: "user1",
            text: "Amazing video! 🔥",
            timestamp: "2 hours ago"
          },
          {
            id: 2,
            user: "user2", 
            text: "Love this content! Keep it up 👏",
            timestamp: "1 hour ago"
          }
        ]);
      } catch (err) {
        setError("Failed to load video");
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVideo();
    }
  }, [params.id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    showNotification(isLiked ? "Removed from likes" : "Added to likes", "success");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      showNotification("Link copied to clipboard!", "success");
    }
  };

  const handleAddComment = () => {
    if (!session) {
      showNotification("Please sign in to comment", "error");
      return;
    }
    
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: session.user?.email?.split("@")[0] || "user",
      text: newComment,
      timestamp: "now"
    };

    setComments([comment, ...comments]);
    setNewComment("");
    showNotification("Comment added!", "success");
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-base-content/50" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <p className="text-base-content/70 mb-6">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn btn-ghost btn-circle"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold">{video.title}</h1>
              <p className="text-sm text-base-content/70">@creator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-md mx-auto lg:max-w-none lg:aspect-video">
              <IKVideo
                path={video.videoUrl}
                transformation={[
                  {
                    height: window.innerWidth < 1024 ? "1920" : "1080",
                    width: window.innerWidth < 1024 ? "1080" : "1920",
                    quality: 90
                  },
                ]}
                controls={true}
                className="w-full h-full object-cover"
                poster={video.thumbnailUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Video Info */}
            <div className="mt-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <p className="text-base-content/80">{video.description}</p>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between py-4 border-t border-base-200">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleLike}
                    className={`btn btn-ghost gap-2 ${
                      isLiked ? "text-error" : "text-base-content/70 hover:text-error"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    <span>{formatCount(likesCount)}</span>
                  </button>

                  <button className="btn btn-ghost gap-2 text-base-content/70 hover:text-primary">
                    <MessageCircle className="w-5 h-5" />
                    <span>{comments.length}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="btn btn-ghost gap-2 text-base-content/70 hover:text-secondary"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" aria-label="More options" className="btn btn-ghost btn-circle">
                    <MoreHorizontal className="w-5 h-5" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                    <li><button className="text-sm">Report</button></li>
                    <li><button className="text-sm">Copy link</button></li>
                  </ul>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content w-12 h-12 rounded-full">
                    <span className="font-bold">
                      {video.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">@creator</h3>
                  <p className="text-sm text-base-content/70">Content Creator</p>
                </div>
                <button className="btn btn-primary btn-sm">Follow</button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl border border-base-200 sticky top-24">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

                {/* Add Comment */}
                {session ? (
                  <div className="mb-4">
                    <div className="flex gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content w-8 h-8 rounded-full">
                          <span className="text-xs font-bold">
                            {session.user?.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          className="textarea textarea-bordered w-full text-sm resize-none"
                          rows={2}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                          onClick={handleAddComment}
                          className="btn btn-primary btn-sm mt-2"
                          disabled={!newComment.trim()}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-base-200 rounded-lg text-center">
                    <p className="text-sm text-base-content/70 mb-2">Sign in to comment</p>
                    <Link href="/login" className="btn btn-primary btn-sm">
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content w-8 h-8 rounded-full">
                          <span className="text-xs font-bold">
                            {comment.user.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">@{comment.user}</span>
                          <span className="text-xs text-base-content/60">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-base-content/80">{comment.text}</p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-base-content/60">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs">Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
