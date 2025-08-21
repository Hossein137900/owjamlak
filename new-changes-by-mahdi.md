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