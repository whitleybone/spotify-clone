import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WebPlayer = ({ token }) => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data.items))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  return (
    <div className="h-screen bg-[#121212] text-white">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] cursor-pointer"
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            >
              <img
                src={playlist.images[0]?.url || "/placeholder.png"}
                alt={playlist.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="mt-4 text-base font-semibold truncate">
                {playlist.name}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {playlist.tracks.total} Songs
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebPlayer;