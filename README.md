# YouTube Playlist Downloader Server

A TypeScript-based Node.js server for downloading YouTube playlists in various formats (MP3, MP4) and providing them as ZIP archives.

## Features

- 🎵 Download YouTube playlists in multiple formats
- 📦 Automatically package downloads as ZIP files
- 🎬 Support for MP4 (360p, 720p, 1080p) and MP3 formats
- 🚀 RESTful API with Express.js
- 🔒 CORS enabled for cross-origin requests
- 📱 Built with TypeScript for type safety

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **youtube-dl-exec** - YouTube downloading utility
- **FFmpeg** - Media processing
- **Archiver** - ZIP file creation

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [FFmpeg](https://ffmpeg.org/) (automatically included via ffmpeg-static)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yt-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   ```env
   PORT=5000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Development Mode

Run the server in development mode with hot reload:

```bash
npm run dev
```

### Production Mode

Build and run the server in production:

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Base URL
```
http://localhost:5000/api/playlist
```

### 1. Fetch Playlist Information

**POST** `/fetch`

Get metadata and video information from a YouTube playlist.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID"
}
```

**Response:**
```json
{
  "title": "Playlist Title",
  "videos": [
    {
      "title": "Video Title",
      "url": "https://youtube.com/watch?v=VIDEO_ID",
      "duration": "3:45"
    }
  ]
}
```

### 2. Download Playlist

**POST** `/download`

Download a YouTube playlist in the specified format and receive a ZIP file.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID",
  "format": "mp3"
}
```

**Supported Formats:**
- `mp3` - Audio only
- `mp4_360` - Video 360p
- `mp4_720` - Video 720p  
- `mp4_1080` - Video 1080p

**Response:**
- Returns a ZIP file download containing all playlist videos

## Project Structure

```
yt-server/
├── src/
│   ├── app.ts                 # Main application entry point
│   ├── config/                # Configuration files
│   ├── controllers/
│   │   └── playlist.controller.ts  # Playlist route handlers
│   ├── routes/
│   │   └── playlist.route.ts       # API route definitions
│   ├── services/
│   │   └── youtube.service.ts      # YouTube data fetching logic
│   └── utils/
│       └── ytdlHelper.ts           # Download utility functions
├── downloads/                 # Temporary download directory
├── dist/                      # Compiled JavaScript files
├── .env.example               # Environment variables template
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript in production
- `npm test` - Run tests (not implemented yet)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |

## Error Handling

The API includes comprehensive error handling for:

- Invalid playlist URLs
- Unsupported formats
- Network errors
- File system errors
- Download failures

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Disclaimer

This tool is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have permission to download.

## Support

If you encounter any issues or have questions, please open an issue on the repository.
