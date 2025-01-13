import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerControls from "../components/PlayerControls";

const PlaylistPage = ({ token }) => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    if (token) {
      fetchPlaylist();
    }
  }, [playlistId, token]);

  const playTrack = async (uri) => {
    try {
      const deviceId = localStorage.getItem("spotify_device_id");
      if (!deviceId) {
        console.error("Device ID not found. Ensure the Spotify Web Playback SDK is set up.");
        return;
      }

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [uri],
        }),
      });
      console.log("Track playing:", uri);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  return (
    <div className="h-screen bg-black text-white">
      {playlist ? (
        <>
          <div className="p-6 bg-gradient-to-b from-green-500 to-black">
            <h1 className="text-4xl font-bold">{playlist.name}</h1>
            <p className="text-gray-300">{playlist.description || "No description available"}</p>
          </div>
          <div className="p-6">
            <table className="table-auto w-full text-left text-gray-400">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Album</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {playlist.tracks.items.map((item, index) => (
                  <tr
                    key={item.track.id}
                    onClick={() => playTrack(item.track.uri)}
                    className="hover:bg-gray-800 cursor-pointer"
                  >
                    <td>{index + 1}</td>
                    <td>{item.track.name}</td>
                    <td>{item.track.album.name}</td>
                    <td>
                      {Math.floor(item.track.duration_ms / 60000)}:
                      {((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PlayerControls token={token} />
        </>
      ) : (
        <p className="text-center text-gray-400">Loading playlist...</p>
      )}
    </div>
  );
};

export default PlaylistPage;