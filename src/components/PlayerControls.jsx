import React, { useEffect, useState } from "react";

const PlayerControls = ({ token, trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Initialize Spotify Web Playback SDK
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
          script.onload = resolve;
        }
      });
    };

    const initializePlayer = async () => {
      await loadSpotifySDK();

      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Web Player",
        getOAuthToken: (cb) => cb(token),
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      spotifyPlayer.addListener("initialization_error", (e) =>
        console.error("Initialization Error:", e)
      );
      spotifyPlayer.addListener("authentication_error", (e) =>
        console.error("Authentication Error:", e)
      );
      spotifyPlayer.addListener("account_error", (e) =>
        console.error("Account Error:", e)
      );
      spotifyPlayer.addListener("playback_error", (e) =>
        console.error("Playback Error:", e)
      );

      spotifyPlayer.connect();
    };

    if (token) {
      initializePlayer();
    }

    return () => {
      if (player) player.disconnect();
    };
  }, [token, player]);

  // Transfer playback to this device and start playing
  useEffect(() => {
    const transferPlayback = async () => {
      if (deviceId && trackUri) {
        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: true,
          }),
        });

        await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        });
      }
    };

    transferPlayback();
  }, [trackUri, deviceId, token]);

  // Play/Pause functionality
  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
    setIsPlaying(!isPlaying);
  };

  // Skip to the next track
  const skipToNext = () => {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error skipping to next track:", err));
  };

  // Skip to the previous track
  const skipToPrevious = () => {
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error skipping to previous track:", err));
  };

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
        <button onClick={skipToPrevious} className="text-xl">
          ⏮
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-green-500 text-black px-4 py-2 rounded-full"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={skipToNext} className="text-xl">
          ⏭
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;