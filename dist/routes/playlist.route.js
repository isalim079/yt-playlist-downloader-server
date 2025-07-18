"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playlist_controller_1 = require("../controllers/playlist.controller");
const router = express_1.default.Router();
router.post('/fetch', playlist_controller_1.getPlaylistInfo);
router.post('/download', playlist_controller_1.downloadZip);
exports.default = router;
