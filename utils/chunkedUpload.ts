interface ChunkUploadOptions {
  file: File;
  chunkSize?: number;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  maxRetries?: number;
}

interface ChunkResponse {
  success: boolean;
  chunkId: string;
  message?: string;
}

export class ChunkedVideoUploader {
  private static readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  private static readonly MAX_RETRIES = 3;

  static async uploadVideo({
    file,
    chunkSize = ChunkedVideoUploader.DEFAULT_CHUNK_SIZE,
    onProgress,
    onError,
    maxRetries = ChunkedVideoUploader.MAX_RETRIES,
  }: ChunkUploadOptions): Promise<string> {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Upload chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        await this.uploadChunkWithRetry({
          chunk,
          chunkIndex,
          totalChunks,
          uploadId,
          maxRetries,
        });
        
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        onProgress?.(progress);
      }
      
      // Finalize upload
      const finalizeResponse = await this.finalizeUpload(uploadId, file.name);
      return finalizeResponse.filename;
      
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'خطا در آپلود');
      throw error;
    }
  }

  private static async uploadChunkWithRetry({
    chunk,
    chunkIndex,
    totalChunks,
    uploadId,
    maxRetries,
  }: {
    chunk: Blob;
    chunkIndex: number;
    totalChunks: number;
    uploadId: string;
    maxRetries: number;
  }): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.uploadSingleChunk({
          chunk,
          chunkIndex,
          totalChunks,
          uploadId,
        });
        return; // Success
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < maxRetries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError;
  }

  private static async uploadSingleChunk({
    chunk,
    chunkIndex,
    totalChunks,
    uploadId,
  }: {
    chunk: Blob;
    chunkIndex: number;
    totalChunks: number;
    uploadId: string;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('uploadId', uploadId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch('/api/poster/video/chunk', {
        method: 'POST',
        headers: {
          token: localStorage.getItem('token') || '',
        },
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'خطا در آپلود قطعه');
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static async finalizeUpload(uploadId: string, originalFilename: string): Promise<{ filename: string }> {
    const response = await fetch('/api/poster/video/finalize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token') || '',
      },
      body: JSON.stringify({ uploadId, originalFilename }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'خطا در نهایی‌سازی آپلود');
    }

    return response.json();
  }
}