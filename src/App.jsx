import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WebPlayer from "./pages/WebPlayer";
import PlaylistPage from "./pages/PlaylistPage";
import Navbar from "./components/Navbar";
import PlayerControls from "./components/PlayerControls";

const App = () => {
  const [token, setToken] = useState(null);
  const [currentTrackUri, setCurrentTrackUri] = useState(null);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, item) => {
        const [key, value] = item.split("=");
        acc[key] = value;
        return acc;
      }, {});

    const _token = hash.access_token;

    if (_token) {
      localStorage.setItem("spotify_token", _token);
      setToken(_token);
      window.location.hash = "";
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  if (!token) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Define the home route "/" */}
        <Route path="/" element={<WebPlayer token={token} setCurrentTrackUri={setCurrentTrackUri} />} />
        
        {/* Define the player and playlist routes */}
        <Route
          path="/player"
          element={<WebPlayer token={token} setCurrentTrackUri={setCurrentTrackUri} />}
        />
        <Route
          path="/playlist/:playlistId"
          element={<PlaylistPage token={token} setCurrentTrackUri={setCurrentTrackUri} />}
        />
      </Routes>
      <PlayerControls token={token} trackUri={currentTrackUri} />
    </>
  );
};

export default App;