import { Request, Response } from "express";
import { fetchPlaylistData } from "../services/youtube.service";
// import { downloadPlaylist } from '../utils/ytdlHelper';
import path from "path";
import fs from "fs";
import { streamZippedPlaylist } from "../utils/ytdlHelper";

export const getPlaylistInfo = async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url)
    return res.status(400).json({ message: "Playlist URL is required" });

  try {
    const playlist = await fetchPlaylistData(url);
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving playlist data" });
  }
};

// export const downloadZip = async (req: Request, res: Response) => {
//   const { url, format } = req.body;

//   const allowedFormats = ['mp3', 'mp4_360', 'mp4_720', 'mp4_1080'];

//   if (!url || !allowedFormats.includes(format)) {
//     return res.status(400).json({ message: 'Invalid parameters' });
//   }

//   try {
//     const fileName = `playlist-${Date.now()}.zip`;
//     const zipPath = await downloadPlaylist(url, format, fileName);

//     // Set headers for download
//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

//     const stream = fs.createReadStream(zipPath);

//     // Pipe file to response
//     stream.pipe(res);

//     // Delete file after streaming is complete
//     stream.on('close', () => {
//       fs.unlink(zipPath, (err) => {
//         if (err) console.error('Failed to delete zip after download:', err);
//         else console.log('ZIP deleted:', fileName);
//       });
//     });

//     stream.on('error', (err) => {
//       console.error('Stream error:', err);
//       res.status(500).end();
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to download playlist' });
//   }
// };

export const downloadZip = async (req: Request, res: Response) => {
  const { url, format } = req.body;

  const allowedFormats = ["mp3", "mp4_360", "mp4_720", "mp4_1080"];
  if (!url || !allowedFormats.includes(format)) {
    return res.status(400).json({ message: "Invalid parameters" });
  }

  try {
    const fileName = `playlist-${Date.now()}.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await streamZippedPlaylist(url, format as any, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to download playlist" });
  }
};
