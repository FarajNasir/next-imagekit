"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import React, { useRef, useState } from "react";
interface FileuploadProps {
    onSuccess: (res: any) => void
    onProgress: (progress: number) => void
    fileType: "image" | "video"
}


const FileUpload = ({ onSuccess, onProgress, fileType }: FileuploadProps) => {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    //optional validation
    const validateFiles = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file")
                return false
            }
        } else if (fileType === "image") {
            if (!file.type.startsWith("image/")) {
                setError("Please upload a valid image file")
                return false
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File must be less than 100MB")
            return false
        }
        return true
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFiles(file)) return
        setUploading(true)
        setError(null)
        setProgress(0)
        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json()
            const res = await upload({
                // Authentication parameters
                file,
                expire: auth.expire,
                token: auth.token,
                signature: auth.signature,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,

                fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        const roundedPercent = Math.round(percent)
                        setProgress(roundedPercent)
                        onProgress(roundedPercent)
                    };
                },

            });
            onSuccess(res)
        } catch (error) {
            console.error("upload failed", error)
            setError("Upload failed. Please try again.")
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }






    return (
        <div className="w-full max-w-md mx-auto">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={fileType === "video" ? "video/*" : "image/*"}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Upload {fileType === "video" ? "Video" : "Image"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Max file size: 100MB
                        </p>
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="mt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                Uploading... {progress}%
                            </span>
                        </div>
                        <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-red-700 dark:text-red-300">
                            {error}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;