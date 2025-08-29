"use client";

import VideoUploadForm from "../components/VideoUploadForm";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

export default function VideoUploadPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-12 h-12 text-base-content/50" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sign in to upload</h1>
          <p className="text-base-content/70 mb-6">
            You need to be signed in to share your amazing content with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="btn btn-ghost btn-circle"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Create New Reel</h1>
              <p className="text-base-content/70">Share your moment with the world</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <span>Upload</span>
            </div>
            <div className="w-8 h-px bg-base-300"></div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center text-xs">
                2
              </div>
              <span>Details</span>
            </div>
            <div className="w-8 h-px bg-base-300"></div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center text-xs">
                3
              </div>
              <span>Publish</span>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-4xl mx-auto">
          <VideoUploadForm />
        </div>

        {/* Tips */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-base-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">💡 Tips for great reels</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">📱 Format</h4>
                <ul className="space-y-1 text-base-content/70">
                  <li>• Vertical videos work best (9:16)</li>
                  <li>• Keep it under 60 seconds</li>
                  <li>• High quality (1080p or higher)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🎯 Content</h4>
                <ul className="space-y-1 text-base-content/70">
                  <li>• Hook viewers in first 3 seconds</li>
                  <li>• Add captions for accessibility</li>
                  <li>• Use trending music or sounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}