import { NextRequest, NextResponse } from "next/server";
import { statSync, createReadStream, existsSync } from "fs";
import { join } from "path";
import { Readable } from "stream";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; filename: string }> }
) {
  try {
    const { userId, filename } = await params;

    if (!userId || !filename) {
      return NextResponse.json(
        { error: "User ID and filename required" },
        { status: 400 }
      );
    }

    const filepath = join(
      process.cwd(),
      "public",
      "uploads",
      "posters",
      userId,
      filename
    );

    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const stat = statSync(filepath);
    const fileSize = stat.size;

    const range = request.headers.get("range");

    let contentType = "video/mp4";
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "webm":
        contentType = "video/webm";
        break;
      case "ogg":
        contentType = "video/ogg";
        break;
      case "avi":
        contentType = "video/x-msvideo";
        break;
      case "mov":
        contentType = "video/quicktime";
        break;
    }

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const file = createReadStream(filepath, { start, end });

      // Handle stream errors to prevent uncaught exceptions
      file.on('error', (err) => {
        console.log('Stream error (handled):', err.message);
      });

      const stream = Readable.toWeb(file) as ReadableStream;
      
      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
        },
      });
    } else {
      // fallback if no range requested
      const file = createReadStream(filepath);
      
      // Handle stream errors to prevent uncaught exceptions
      file.on('error', (err) => {
        console.log('Stream error (handled):', err.message);
      });

      const stream = Readable.toWeb(file) as ReadableStream;
      
      return new NextResponse(stream, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
        },
      });
    }
  } catch (error) {
    console.log("Error serving video:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { readFile } from "fs/promises";
// import { join } from "path";
// import { existsSync } from "fs";

// // GET - Serve poster video
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string; filename: string }> }
// ) {
//   try {
//     const { userId, filename } = await params;

//     if (!userId || !filename) {
//       return NextResponse.json(
//         { error: "User ID and filename required" },
//         { status: 400 }
//       );
//     }

//     const filepath = join(
//       process.cwd(),
//       "public",
//       "uploads",
//       "posters",
//       userId,
//       filename
//     );

//     if (!existsSync(filepath)) {
//       return NextResponse.json(
//         { error: "Video not found" },
//         { status: 404 }
//       );
//     }

//     const videoBuffer = await readFile(filepath);
//     const extension = filename.split('.').pop()?.toLowerCase();

//     let contentType = "video/mp4";
//     switch (extension) {
//       case "webm":
//         contentType = "video/webm";
//         break;
//       case "ogg":
//         contentType = "video/ogg";
//         break;
//       case "avi":
//         contentType = "video/x-msvideo";
//         break;
//       case "mov":
//         contentType = "video/quicktime";
//         break;
//     }

//     return new NextResponse(new Uint8Array(videoBuffer), {
//       headers: {
//         "Content-Type": contentType,
//         "Cache-Control": "public, max-age=31536000",
//       },
//     });

//   } catch (error) {
//     console.log("Error serving video:", error);
//     return NextResponse.json(
//       { error: "خطای سرور" },
//       { status: 500 }
//     );
//   }
// }
