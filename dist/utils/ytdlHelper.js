"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPlaylist = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const archiver_1 = __importDefault(require("archiver"));
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const DOWNLOADS_DIR = path_1.default.join(__dirname, "../../downloads");
const downloadPlaylist = (playlistUrl, format, zipFileName) => __awaiter(void 0, void 0, void 0, function* () {
    const zipPath = path_1.default.join(DOWNLOADS_DIR, zipFileName);
    const tempDir = path_1.default.join(DOWNLOADS_DIR, `temp-${Date.now()}`);
    fs_1.default.mkdirSync(tempDir, { recursive: true });
    // Fetch playlist info
    const data = yield (0, youtube_dl_exec_1.default)(playlistUrl, {
        dumpSingleJson: true,
        flatPlaylist: true,
    });
    const videos = data.entries || [];
    // Limit for testing: download first 5 videos
    for (let i = 0; i < Math.min(videos.length); i++) {
        const videoUrl = `https://www.youtube.com/watch?v=${videos[i].id}`;
        const outputName = `${i + 1}-${videos[i].title.replace(/[^\w\s]/gi, "")}`;
        // const outputPath = path.join(tempDir, `${outputName}.${format}`);
        const extension = format === "mp3" ? "mp3" : "mp4";
        const outputPath = path_1.default.join(tempDir, `${outputName}.${extension}`);
        if (format === "mp3") {
            yield (0, youtube_dl_exec_1.default)(videoUrl, {
                extractAudio: true,
                audioFormat: "mp3",
                audioQuality: 0,
                ffmpegLocation: ffmpeg_static_1.default || undefined,
                output: outputPath,
                // Add user-agent header to reduce risk of blocking
                youtubeDL: [
                    "--user-agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
                ],
            });
        }
        else {
            // Extract resolution like "360", "720", "1080" from format string
            const resolution = format.split("_")[1];
            // Format string to get specific video height
            //   const videoFormat = `bestvideo[height=${resolution}]+bestaudio/best[height=${resolution}]`;
            // const videoFormat = `(bestvideo[height<=${resolution}][ext=mp4]+bestaudio[ext=m4a]/best[height<=${resolution}][ext=mp4]/best)`;
            const videoFormat = `best[height<=${resolution}]/best`;
            yield (0, youtube_dl_exec_1.default)(videoUrl, {
                format: videoFormat,
                output: outputPath,
            });
        }
    }
    // Zip all files
    yield zipDirectory(tempDir, zipPath);
    // Clean temp dir
    fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    return zipPath;
});
exports.downloadPlaylist = downloadPlaylist;
const zipDirectory = (source, out) => {
    const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
    const stream = fs_1.default.createWriteStream(out);
    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on("error", (err) => reject(err))
            .pipe(stream);
        stream.on("close", () => resolve());
        archive.finalize();
    });
};
