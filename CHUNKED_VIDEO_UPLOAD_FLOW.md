# Chunked Video Upload System Flow

## Overview
The chunked video upload system was implemented to solve video upload reliability issues on VPS environments. It breaks large video files into smaller chunks and uploads them sequentially with retry mechanisms.

## System Architecture

### Core Components

1. **ChunkedVideoUploader** (`utils/chunkedUpload.ts`)
   - Main upload orchestrator
   - Handles file chunking, progress tracking, and error recovery

2. **Chunk Upload API** (`app/api/poster/video/chunk/route.ts`)
   - Receives individual chunks
   - Saves chunks to temporary directory

3. **Finalize API** (`app/api/poster/video/finalize/route.ts`)
   - Combines chunks into final video file
   - Cleans up temporary files

4. **Video Metadata API** (`app/api/videos/metadata/route.ts`)
   - Creates database records for uploaded videos

## Upload Flow

### Step 1: File Validation
```
User selects video file
↓
Validate file type (mp4, mov, webm, etc.)
↓
Check file size (max 50MB)
```

### Step 2: Chunked Upload Process
```
ChunkedVideoUploader.uploadVideo() called
↓
File split into 1MB chunks
↓
For each chunk:
  ├── Upload to /api/poster/video/chunk
  ├── Retry up to 3 times if failed
  ├── Update progress callback
  └── Continue to next chunk
```

### Step 3: File Assembly
```
All chunks uploaded successfully
↓
Call /api/poster/video/finalize
↓
Server combines chunks into final video
↓
Temporary chunk files deleted
↓
Return final filename
```

### Step 4: Database Integration
```
Final filename received
↓
Update component state
↓
Save to database via form submission
```

## Technical Details

### Chunk Configuration
- **Chunk Size**: 1MB (1024 * 1024 bytes)
- **Retry Attempts**: 3 per chunk
- **Timeout**: 30 seconds per chunk
- **Retry Delay**: Exponential backoff (1s, 2s, 4s)

### File Storage Structure
```
/public/uploads/posters/{userId}/
├── video_1234567890.mp4
├── video_1234567891.mov
└── ...
```

### Temporary Chunk Storage
```
/tmp/chunks/{uploadId}/
├── chunk_0
├── chunk_1
├── chunk_2
└── ...
```

## API Endpoints

### POST /api/poster/video/chunk
**Purpose**: Upload individual chunks
**Parameters**:
- `chunk`: File chunk (FormData)
- `chunkIndex`: Chunk sequence number
- `uploadId`: Unique upload identifier
- `totalChunks`: Total number of chunks

### POST /api/poster/video/finalize
**Purpose**: Combine chunks into final file
**Parameters**:
- `uploadId`: Upload identifier
- `filename`: Desired output filename
- `totalChunks`: Expected chunk count

### POST /api/videos/metadata
**Purpose**: Create video database record
**Parameters**:
- `filename`: Video filename
- `title`: Video title
- `description`: Video description

## Error Handling

### Chunk Upload Failures
- Automatic retry with exponential backoff
- Progress tracking continues after recovery
- User notification on persistent failures

### Network Issues
- Timeout handling per chunk
- Resume capability from last successful chunk
- Graceful degradation on connection loss

### Server Errors
- Temporary file cleanup on failure
- Error propagation to UI
- User-friendly error messages

## Progress Tracking

### Real-time Updates
```typescript
onProgress: (progress: number) => {
  setVideoProgress(progress); // 0-100
}
```

### UI Integration
- Progress bar shows upload percentage
- Loading states during upload
- Success/error notifications

## Usage Examples

### Basic Upload
```typescript
const handleVideoUpload = async (file: File) => {
  try {
    const filename = await ChunkedVideoUploader.uploadVideo({
      file,
      onProgress: (progress) => setVideoProgress(progress),
      onError: (error) => toast.error(error),
    });
    
    // Update form data with filename
    setFormData(prev => ({ ...prev, video: filename }));
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### With Metadata Creation
```typescript
// After chunked upload completes
const response = await fetch('/api/videos/metadata', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    filename,
    title: 'Video Title',
    description: 'Video Description'
  })
});
```

## Benefits

### Reliability
- Handles network interruptions gracefully
- Retry mechanism prevents upload failures
- Works well on unstable VPS connections

### Performance
- Parallel processing potential
- Efficient memory usage
- Progress feedback improves UX

### Scalability
- Supports large file uploads (up to 50MB)
- Configurable chunk sizes
- Easy to extend for other file types

## Migration Notes

### Before (Direct Upload)
- Single request for entire file
- No retry mechanism
- Limited to small files
- Poor error handling

### After (Chunked Upload)
- Multiple small requests
- Automatic retry with backoff
- Supports larger files (50MB)
- Comprehensive error handling
- Real-time progress tracking

## Components Updated

1. **posterForm.tsx** - Main poster creation form
2. **posterById.tsx** - Poster editing interface
3. **videoUpload.tsx** - Dedicated video upload component
4. **videoManagement.tsx** - Video management modal
5. **propertyListings.tsx** - Property listing video uploads

All components now use the same chunked upload pattern for consistency and reliability.