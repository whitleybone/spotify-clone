import React, { useEffect, useState } from "react";

const PlayerControls = ({ token }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const loadSpotifySDK = () => {
      return new Promise((resolve) => {
        if (window.Spotify) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;
          document.body.appendChild(script);

          script.onload = () => {
            // Ensure the global callback is defined before SDK loads
            window.onSpotifyWebPlaybackSDKReady = () => {
              console.log("Spotify Web Playback SDK is ready");
              resolve();
            };
          };
        }
      });
    };

    const initializePlayer = async () => {
      await loadSpotifySDK();

      if (!window.Spotify) {
        console.error("Spotify SDK failed to load");
        return;
      }

      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Web Player",
        getOAuthToken: (cb) => cb(token),
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with Device ID:", device_id);
        localStorage.setItem("spotify_device_id", device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      spotifyPlayer.connect();
    };

    if (token) {
      initializePlayer();
    }

    return () => {
      if (player) player.disconnect();
    };
  }, [token]);

  return (
    <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {currentTrack && (
          <img
            src={currentTrack.album.images[0]?.url}
            alt={currentTrack.name}
            className="w-16 h-16"
          />
        )}
        <div>
          <p className="text-lg">{currentTrack?.name || "No Track Playing"}</p>
          <p className="text-sm text-gray-400">
            {currentTrack?.artists?.map((artist) => artist.name).join(", ") || ""}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => player?.previousTrack()} className="text-xl">
          ⏮
        </button>
        <button
          onClick={() => (isPlaying ? player?.pause() : player?.resume())}
          className="bg-green-500 text-black px-4 py-2 rounded-full"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={() => player?.nextTrack()} className="text-xl">
          ⏭
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;