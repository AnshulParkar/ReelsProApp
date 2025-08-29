"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/apiclient";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Play } from "lucide-react";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20">
        <div className="hero-content text-center max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              ReelsPro
            </h1>
            <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-2xl mx-auto">
              Share your moments, discover amazing content, and connect with creators worldwide
            </p>
            
            {session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/upload" className="btn btn-primary btn-lg gap-2">
                  <Plus className="w-5 h-5" />
                  Create Content
                </Link>
                <a href="#videos" className="btn btn-outline btn-lg gap-2">
                  <Play className="w-5 h-5" />
                  Watch Videos
                </a>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link href="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Feed Section */}
      <div id="videos" className="container mx-auto px-4 py-12">
        {videos.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Videos</h2>
              <p className="text-lg text-base-content/70">Discover trending content from our community</p>
            </div>
            <VideoFeed videos={videos} />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-12 h-12 text-base-content/50" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No videos yet</h3>
              <p className="text-base-content/70 mb-6">
                Be the first to share amazing content with the community!
              </p>
              {session && (
                <Link href="/upload" className="btn btn-primary">
                  Upload First Video
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ReelsPro?</h2>
            <p className="text-lg text-base-content/70">Everything you need to create and share amazing videos</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-base-content/70">Upload and stream videos in stunning quality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-base-content/70">Connect with creators and discover new content</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-base-content/70">Lightning-fast uploads and smooth playback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}