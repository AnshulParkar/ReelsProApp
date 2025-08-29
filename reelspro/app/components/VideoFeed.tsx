import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Grid Layout for larger screens */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoComponent key={video._id?.toString()} video={video} />
        ))}
      </div>

      {/* Mobile: Single column, full-width */}
      <div className="sm:hidden space-y-6">
        {videos.map((video) => (
          <VideoComponent key={video._id?.toString()} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-base-content/80 mb-2">
              No videos to show
            </h3>
            <p className="text-base-content/60">
              Start exploring or create your first video!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
