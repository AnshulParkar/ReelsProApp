"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Upload, Play, Eye, Users } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/apiclient";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const watchedVideoUrl = watch("videoUrl");

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    setVideoPreview(response.url || "");
    setCurrentStep(2);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    setCurrentStep(3);
    
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully! 🎉", "success");
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (step: number) => {
    if (step === 1 || (step === 2 && watchedVideoUrl)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload & Preview Section */}
        <div className="order-2 lg:order-1">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              {currentStep === 1 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
                  <p className="text-base-content/70 mb-6">
                    Share your creativity with the world
                  </p>
                  
                  <FileUpload
                    fileType="video"
                    onSuccess={handleUploadSuccess}
                    onProgress={handleUploadProgress}
                  />
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep >= 2 && videoPreview && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Video Preview</h3>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="btn btn-ghost btn-sm"
                    >
                      Change Video
                    </button>
                  </div>
                  
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-w-xs mx-auto">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-full object-cover"
                      poster={watch("thumbnailUrl")}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {loading ? (
                      <Loader2 className="w-8 h-8 text-success animate-spin" />
                    ) : (
                      <Play className="w-8 h-8 text-success" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {loading ? "Publishing..." : "Published! 🎉"}
                  </h3>
                  <p className="text-base-content/70">
                    {loading
                      ? "Your video is being published to the feed"
                      : "Your video is now live and ready for the world to see!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="order-1 lg:order-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-4">Video Details</h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Give your video a catchy title..."
                    className={`input input-bordered ${
                      errors.title ? "input-error" : "focus:input-primary"
                    }`}
                    disabled={currentStep < 2}
                    {...register("title", { 
                      required: "Title is required",
                      minLength: { value: 3, message: "Title must be at least 3 characters" },
                      maxLength: { value: 100, message: "Title must be less than 100 characters" }
                    })}
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description *</span>
                  </label>
                  <textarea
                    placeholder="Tell viewers what your video is about..."
                    className={`textarea textarea-bordered h-24 resize-none ${
                      errors.description ? "textarea-error" : "focus:textarea-primary"
                    }`}
                    disabled={currentStep < 2}
                    {...register("description", { 
                      required: "Description is required",
                      minLength: { value: 10, message: "Description must be at least 10 characters" },
                      maxLength: { value: 500, message: "Description must be less than 500 characters" }
                    })}
                  />
                  {errors.description && (
                    <span className="text-error text-sm mt-1">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <Eye className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-medium">Views</div>
                    <div className="text-sm text-base-content/70">Starting at 0</div>
                  </div>
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-secondary" />
                    <div className="text-xs font-medium">Reach</div>
                    <div className="text-sm text-base-content/70">Worldwide</div>
                  </div>
                  <div className="text-center p-3 bg-base-200 rounded-lg">
                    <Play className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <div className="text-xs font-medium">Quality</div>
                    <div className="text-sm text-base-content/70">HD</div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`btn w-full mt-6 ${
                    loading ? "btn-disabled" : "btn-primary"
                  }`}
                  disabled={loading || currentStep < 2 || !watchedVideoUrl}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing Video...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Publish Video
                    </>
                  )}
                </button>

                {currentStep < 2 && (
                  <div className="text-center text-sm text-base-content/60 mt-2">
                    Upload a video first to continue
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
