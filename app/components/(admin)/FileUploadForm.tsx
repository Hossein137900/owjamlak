"use client";

import { useState } from "react";

export default function MultiImageDropzoneUsage() {
  // const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadedFiles] = useState<
    { name: string; url: string }[]
  >([]);

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

  async function handleSaveToMongoDB() {
    const categorizedFiles = uploadedFiles.map((file) => {
      const category = file.name.split("-")[0];
      const type = file.name.split("-")[1];
      return {
        name: file.name,
        url: file.url,
        type,
        category,
      };
    });

    await fetch("/api/uploadedFiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: categorizedFiles }),
    });
  }

  return (
    <div>
      {/* <MultiImageDropzone
        value={fileStates}
        dropzoneOptions={{
          maxFiles: 6,
        }}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file as File,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });

                setUploadedFiles((prev) => [
                  ...prev,
                  {
                    name:
                      typeof addedFileState.file === "object"
                        ? addedFileState.file.name
                        : "",
                    url: res.url,
                  },
                ]);
              } catch (err) {
                console.log(err)
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      /> */}

      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <strong>Name:</strong> {file.name}, <strong>URL:</strong> {file.url}
          </li>
        ))}
      </ul>

      {/* Button to save the categorized files to MongoDB */}
      <button onClick={handleSaveToMongoDB}>Save to MongoDB</button>
    </div>
  );
}
