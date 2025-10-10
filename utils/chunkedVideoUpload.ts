interface ChunkedVideoUploadOptions {
  file: File;
  title?: string;
  description?: string;
  alt?: string;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export class ChunkedVideoUpload {
  static async uploadVideo({ file, title, description, alt, onProgress, onError }: ChunkedVideoUploadOptions): Promise<string> {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = Date.now().toString();
    
    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('uploadId', uploadId);
        formData.append('filename', file.name);
        
        const token = localStorage.getItem('token');
        const response = await fetch('/api/videos/chunk', {
          method: 'POST',
          headers: {
            'token': token || '',
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Chunk upload failed: ${response.statusText}`);
        }
        
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        onProgress?.(progress);
      }
      
      // Finalize upload
      const token = localStorage.getItem('token');
      const finalizeResponse = await fetch('/api/videos/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token || '',
        },
        body: JSON.stringify({
          uploadId,
          filename: file.name,
          totalChunks,
          originalName: file.name,
          size: file.size,
          title,
          description,
          alt,
        }),
      });
      
      const result = await finalizeResponse.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload finalization failed');
      }
      
      return result.filename;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
      throw error;
    }
  }
}