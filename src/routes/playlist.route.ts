import express from 'express';
import { getPlaylistInfo, downloadZip } from '../controllers/playlist.controller';

const router = express.Router();

router.post('/fetch', getPlaylistInfo);
router.post('/download', downloadZip);

export default router;
