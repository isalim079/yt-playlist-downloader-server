import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import archiver from "archiver";
import youtubedl from "youtube-dl-exec";
import ffmpegPath from "ffmpeg-static";
import { PassThrough } from "stream";
import { spawn } from "child_process";

const execAsync = promisify(exec);

const DOWNLOADS_DIR = path.join(__dirname, "../../downloads");

// export const downloadPlaylist = async (
//   playlistUrl: string,
//   format: "mp3" | "mp4_360" | "mp4_720" | "mp4_1080",
//   zipFileName: string
// ): Promise<string> => {
//   const zipPath = path.join(DOWNLOADS_DIR, zipFileName);
//   const tempDir = path.join(DOWNLOADS_DIR, `temp-${Date.now()}`);

//   fs.mkdirSync(tempDir, { recursive: true });

//   // Fetch playlist info
//   const data: any = await youtubedl(playlistUrl, {
//     dumpSingleJson: true,
//     flatPlaylist: true,
//   } as any);

//   const videos = data.entries || [];

//   // Limit for testing: download first 5 videos
//   for (let i = 0; i < Math.min(videos.length); i++) {
//     const videoUrl = `https://www.youtube.com/watch?v=${videos[i].id}`;
//     const outputName = `${i + 1}-${videos[i].title.replace(/[^\w\s]/gi, "")}`;

//     // const outputPath = path.join(tempDir, `${outputName}.${format}`);
//     const extension = format === "mp3" ? "mp3" : "mp4";
//     const outputPath = path.join(tempDir, `${outputName}.${extension}`);

//     if (format === "mp3") {
//       await youtubedl(videoUrl, {
//         extractAudio: true,
//         audioFormat: "mp3",
//         audioQuality: 0,
//         ffmpegLocation: ffmpegPath || undefined,
//         output: outputPath,
//         // Add user-agent header to reduce risk of blocking
//         youtubeDL: [
//           "--user-agent",
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
//         ],
//       } as any);
//     } else {
//       // Extract resolution like "360", "720", "1080" from format string
//       const resolution = format.split("_")[1];

//       // Format string to get specific video height
//       //   const videoFormat = `bestvideo[height=${resolution}]+bestaudio/best[height=${resolution}]`;
//       // const videoFormat = `(bestvideo[height<=${resolution}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${resolution}][ext=mp4]/best)`;
//       const videoFormat = `best[height<=${resolution}]/best`;

//       await youtubedl(videoUrl, {
//         format: videoFormat,
//         output: outputPath,
//       });
//     }
//   }

//   // Zip all files
//   await zipDirectory(tempDir, zipPath);

//   // Clean temp dir
//   fs.rmSync(tempDir, { recursive: true, force: true });

//   return zipPath;
// };

const zipDirectory = (source: string, out: string): Promise<void> => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", (err: any) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
};

export const streamZippedPlaylist = async (
  playlistUrl: string,
  format: "mp3" | "mp4_360" | "mp4_720" | "mp4_1080",
  res: any
) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="playlist.zip"`);

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err: any) => {
    console.error("Archiver error:", err);
    if (!res.headersSent) {
      res.status(500).send("Error streaming archive.");
    } else {
      res.destroy(); // forcibly close if headers already sent
    }
  });

  archive.pipe(res);

  const data: any = await youtubedl(playlistUrl, {
    dumpSingleJson: true,
    flatPlaylist: true,
  });

  const videos = data.entries || [];

  const binaryPath = path.join(
    __dirname,
    "../../node_modules/youtube-dl-exec/bin/yt-dlp.exe"
  );

  for (let i = 0; i < videos.length; i++) {
    const videoUrl = `https://www.youtube.com/watch?v=${videos[i].id}`;
    const safeTitle = videos[i].title
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "_");
    const extension = format === "mp3" ? "mp3" : "mp4";
    const filename = `${i + 1}-${safeTitle}.${extension}`;

    const resolution = format.split("_")[1];
    const videoFormat =
      format === "mp3" ? undefined : `best[height<=${resolution}]/best`;

    const flags: string[] = [
      videoUrl,
      ...(format === "mp3"
        ? [
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            ...(ffmpegPath ? ["--ffmpeg-location", ffmpegPath] : []),
          ]
        : ["-f", videoFormat || "best"]),
      "-o",
      "-", // Output to stdout
    ];

    const ytdlProcess = spawn(binaryPath, flags);

    ytdlProcess.stderr.on("data", (data) => {
      console.error(`yt-dlp error: ${data}`);
    });

    const pass = new PassThrough();
    ytdlProcess.stdout.pipe(pass);
    archive.append(pass, { name: filename });

    await new Promise((resolve, reject) => {
      ytdlProcess.on("close", resolve);
      ytdlProcess.on("error", reject);
    });
  }

  await archive.finalize();
};
