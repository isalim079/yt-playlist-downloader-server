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
exports.downloadZip = exports.getPlaylistInfo = void 0;
const youtube_service_1 = require("../services/youtube.service");
const ytdlHelper_1 = require("../utils/ytdlHelper");
const fs_1 = __importDefault(require("fs"));
const getPlaylistInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url)
        return res.status(400).json({ message: 'Playlist URL is required' });
    try {
        const playlist = yield (0, youtube_service_1.fetchPlaylistData)(url);
        res.json(playlist);
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving playlist data' });
    }
});
exports.getPlaylistInfo = getPlaylistInfo;
const downloadZip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, format } = req.body;
    const allowedFormats = ['mp3', 'mp4_360', 'mp4_720', 'mp4_1080'];
    if (!url || !allowedFormats.includes(format)) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }
    try {
        const fileName = `playlist-${Date.now()}.zip`;
        const zipPath = yield (0, ytdlHelper_1.downloadPlaylist)(url, format, fileName);
        // Set headers for download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        const stream = fs_1.default.createReadStream(zipPath);
        // Pipe file to response
        stream.pipe(res);
        // Delete file after streaming is complete
        stream.on('close', () => {
            fs_1.default.unlink(zipPath, (err) => {
                if (err)
                    console.error('Failed to delete zip after download:', err);
                else
                    console.log('ZIP deleted:', fileName);
            });
        });
        stream.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).end();
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to download playlist' });
    }
});
exports.downloadZip = downloadZip;
