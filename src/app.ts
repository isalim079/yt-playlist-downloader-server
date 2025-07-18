import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playlistRoutes from "./routes/playlist.route";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://yt-downloader-frontend-sand.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/playlist", playlistRoutes);

app.get("/", (_req, res) => {
  res.send("YouTube Playlist Downloader API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
