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
exports.fetchPlaylistData = void 0;
const youtube_dl_exec_1 = __importDefault(require("youtube-dl-exec"));
const fetchPlaylistData = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const output = yield (0, youtube_dl_exec_1.default)(url, {
            dumpSingleJson: true,
            flatPlaylist: true,
            playlistEnd: 200, // for testing: limit number of videos
        });
        return output;
    }
    catch (error) {
        console.error("Error fetching playlist:", error);
        throw new Error("Failed to fetch playlist data.");
    }
});
exports.fetchPlaylistData = fetchPlaylistData;
