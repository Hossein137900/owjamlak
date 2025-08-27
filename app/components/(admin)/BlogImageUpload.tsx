"use client";


// import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { motion } from "framer-motion";

interface BlogImageUploadProps {
  onImageUpload: (imageUrl: string, type: "main" | "second") => void;
  currentMainImage?: string;
  currentSecondImage?: string;
  maxFiles?: number;
}

export default function BlogImageUpload({
  onImageUpload,
  currentMainImage,
  currentSecondImage,
  maxFiles = 2,
}: BlogImageUploadProps) {
  // const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{
    main?: string;
    second?: string;
  }>({
    main: currentMainImage,
    second: currentSecondImage,
  });
  // const { edgestore } = useEdgeStore();

  // function updateFileProgress(key: string, progress: FileState["progress"]) {
  //   setFileStates((fileStates) => {
  //     const newFileStates = structuredClone(fileStates);
  //     const fileState = newFileStates.find(
  //       (fileState) => fileState.key === key
  //     );
  //     if (fileState) {
  //       fileState.progress = progress;
  //     }
  //     return newFileStates;
  //   });
  // }

  const removeImage = (type: "main" | "second") => {
    setUploadedImages((prev) => ({
      ...prev,
      [type]: undefined,
    }));
    onImageUpload("", type);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-[#e5d8d0]/20">
        <h3 className="text-xl font-bold text-black mb-4 text-center">
          تصاویر بلاگ
        </h3>

        {/* Current Images Display */}
        {(uploadedImages.main || uploadedImages.second) && (
          <div className="mb-6">
            <h4 className="text-white mb-3">تصاویر آپلود شده:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedImages.main && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={uploadedImages.main}
                    alt="تصویر اصلی"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => removeImage("main")}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      حذف تصویر اصلی
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    تصویر اصلی
                  </span>
                </motion.div>
              )}

              {uploadedImages.second && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={uploadedImages.second}
                    alt="تصویر دوم"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => removeImage("second")}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      حذف تصویر دوم
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    تصویر دوم
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-4">
          <p className="text-black/50 text-sm text-center">
            حداکثر {maxFiles} تصویر می‌توانید آپلود کنید (تصویر اصلی و تصویر
            دوم)
          </p>

          {/* <MultiImageDropzone
            value={fileStates}
            dropzoneOptions={{
              maxFiles: maxFiles,
              accept: {
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
              }
            }}
            onChange={(files) => {
              setFileStates(files);
            }}
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles]);
              
              await Promise.all(
                addedFiles.map(async (addedFileState) => {
                  try {
                    const res = await edgestore.publicFiles.upload({                      file: addedFileState.file as File,
                      onProgressChange: async (progress) => {
                        updateFileProgress(addedFileState.key, progress);
                        if (progress === 100) {
                          await new Promise((resolve) => setTimeout(resolve, 1000));
                          updateFileProgress(addedFileState.key, "COMPLETE");
                        }
                      },
                    });

                    // Determine if this is main or second image based on current state
                    const imageType: 'main' | 'second' = !uploadedImages.main ? 'main' : 'second';
                    
                    setUploadedImages(prev => ({
                      ...prev,
                      [imageType]: res.url
                    }));
                    
                    onImageUpload(res.url, imageType);
                  } catch (err) {
                    console.log("Upload error:", err);
                    updateFileProgress(addedFileState.key, "ERROR");
                  }
                })
              );
            }}
          /> */}
        </div>

        {/* Upload Instructions */}
        <div className="mt-4 text-sm text-black/60 space-y-1">
          <p>• اولین تصویر به عنوان تصویر اصلی بلاگ استفاده می‌شود</p>
          <p>• دومین تصویر به عنوان تصویر فرعی استفاده می‌شود</p>
          <p>• فرمت‌های مجاز: PNG, JPG, JPEG, GIF, WebP</p>
        </div>
      </div>
    </div>
  );
}
