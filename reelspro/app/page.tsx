import Image from "next/image";
import { useEffect, useState } from "react";
import { apiClient } from "../lib/apiclient";
import { IVideo } from "@/models/Video";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await apiClient.getVideos();
        setVideos(videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <main>
      <h1>Welcome to ReelsPro</h1>
      <p>Your one-stop solution for video management.</p>
      <div>
        {videos.map(video => (
          <div key={video._id?.toString()}>
            <h2>{video.title}</h2>
            <Image src={video.thumbnailUrl} alt={video.title} width={200} height={100} />
          </div>
        ))}
      </div>
    </main>
  );
}
