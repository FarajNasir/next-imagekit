"use client"

import FileUpload from "@/app/components/FileUpload";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleSuccess = (res: any) => {
    setUploadedFiles((prev) => [...prev, res]);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to upload files</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Media
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload images and videos to ImageKit
            </p>
          </div>

          {/* Upload Tabs */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Upload Image
              </h2>
              <FileUpload
                fileType="image"
                onSuccess={handleSuccess}
                onProgress={(progress) => console.log("Image progress:", progress)}
              />
            </div>

            {/* Video Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Upload Video
              </h2>
              <FileUpload
                fileType="video"
                onSuccess={handleSuccess}
                onProgress={(progress) => console.log("Video progress:", progress)}
              />
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Recently Uploaded
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
                  >
                    <img
                      src={file.thumbnail || file.url}
                      alt={file.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}