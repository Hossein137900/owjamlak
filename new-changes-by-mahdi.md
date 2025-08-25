app/
├── api/
│   ├── poster/
│   │   ├── route.ts              # GET (list) & POST (create)
│   │   ├── [id]/route.ts         # GET single poster & DELETE
│   │   ├── posterByUser/route.ts # GET user's posters
│   │   └── view/route.ts         # POST increment views
│   ├── images/
│   │   └── [...path]/route.ts    # GET serve images
│   └── auth/
│       └── id/route.ts           # GET user info
├── poster/
│   └── [id]/page.tsx             # Poster detail page
components/
├── static/
│   ├── admin/posters/
│   │   ├── posterForm.tsx        # Create poster form
│   │   └── posterById.tsx        # User's poster list
│   └── poster/
│       └── detailPagePoster.tsx  # Poster detail component
public/uploads/posters/
└── {userId}/                     # User-specific image folders
    ├── poster_123_0_image1.jpg
    └── poster_123_1_image2.jpg

middleware on root for rate limit by token and ip

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