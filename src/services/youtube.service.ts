import youtubedl from 'youtube-dl-exec';

export const fetchPlaylistData = async (url: string) => {
  try {
    const output = await youtubedl(url, {
      dumpSingleJson: true,
     flatPlaylist: true,
      playlistEnd: 200, // for testing: limit number of videos
    } as any);

    return output;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw new Error("Failed to fetch playlist data.");
  }
};
