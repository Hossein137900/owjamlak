app/
├── api/
│   ├── poster/
│   │   ├── route.ts              # GET (list) & POST (create with video)
│   │   ├── [id]/route.ts         # GET single poster & DELETE
│   │   ├── posterByUser/route.ts # GET user's posters
│   │   └── view/route.ts         # POST increment views
│   ├── images/
│   │   └── [...path]/route.ts    # GET serve images
│   ├── videos/
│   │   └── [filename]/route.ts   # GET serve videos
│   └── auth/
│       └── id/route.ts           # GET user info
├── poster/
│   └── [id]/page.tsx             # Poster detail page with video support
components/
├── static/
│   ├── admin/posters/
│   │   ├── posterForm.tsx        # Create poster form with video upload
│   │   └── posterById.tsx        # User's poster list
│   └── poster/
│       └── detailPagePoster.tsx  # Poster detail with video slider
public/uploads/posters/
└── {userId}/                     # User-specific image folders
    ├── poster_123_0_image1.jpg
    └── poster_123_1_image2.jpg

middleware on root for rate limit by token and ip

## Image Compression & Validation
- 30MB file size limit for all uploads
- Automatic compression for files >100KB
- WebP format conversion for better compression
- MIME type validation (PNG, JPG, JPEG, GIF, WebP)
- Secure filename sanitization

## Video Upload System (Admin/SuperAdmin Only)
app/
├── api/
│   └── videos/
│       ├── route.ts              # POST (upload), GET (list), DELETE (delete)
│       └── [filename]/route.ts   # GET serve videos (no auth)
components/
├── static/
│   └── admin/
│       └── video/
│           ├── videoManagement.tsx  # Main video management UI
│           └── videoUpload.tsx      # Upload component
public/uploads/videos/               # Video storage folder
└── video_timestamp.ext             # Uploaded video files

- Admin/SuperAdmin can upload videos (50MB limit)
- Videos served without authentication
- Supports MP4, WebM, OGG, AVI, MOV formats
- Token-based upload/delete authentication
- Integrated with existing admin panel

## Poster Video Integration
- Users can upload one video per poster (50MB limit)
- Video upload integrated into poster creation form
- Video appears as first item in poster detail slider
- Unified media slider: video first, then images
- Video thumbnails show first frame with play button overlay
- Automatic video preloading for smooth playback
- Video filename stored in poster model
- Same video validation as admin video system
- Video management in both user (posterById.tsx) and admin (propertyListings.tsx) interfaces
- Video preview functionality shows existing videos in edit modals
- Complete video CRUD: upload, update, remove, and preview
- Video field added to Poster type definition

## Blog System (Admin/SuperAdmin Only)
app/
├── api/
│   └── blog/
│       ├── route.ts              # POST (create), GET (list)
│       ├── [id]/route.ts         # PUT (update), DELETE (delete)
│       └── images/
│           └── route.ts          # POST (upload blog images)
├── blogs/
│   ├── page.tsx                  # Blog listing page
│   └── [id]/page.tsx             # Individual blog detail page
├── addBlog/
│   └── page.tsx                  # Blog creation/edit form (admin only)
components/
├── static/
│   └── admin/
│       └── blogs/
│           └── blogManagement.tsx # Admin blog management interface
data/
└── blogs.json                    # Blog storage (JSON file)
public/uploads/blog/              # Blog image storage
└── blog_{type}_{timestamp}_{filename} # Blog image files

- Admin/SuperAdmin can create, edit, and delete blogs with rich text editor
- Support for up to 5 images per blog (30MB limit each)
- Image compression (WebP format, ~100KB)
- First image used as blog cover image
- Admin can place images anywhere in content using editor dropdown
- Images show as placeholders in editor, render properly on blog page
- SEO fields (title, description, tags)
- Blogs stored in JSON file, displayed on /blogs page
- Responsive blog listing and detail pages
- Complete CRUD operations: Create, Read, Update, Delete
- Single form handles both create and edit modes (/addBlog?edit=blogId)
- Admin management panel with view, edit, and delete buttons
- Blog deletion removes all associated images from filesystem
- Cache-busting for immediate content updates
- Dynamic rendering to prevent caching issues