// src/utils/auth.js
const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "43f79c3d9d0d401b827c55e5017a8e3c"; // Replace with your Spotify Client ID
const redirectUri = "http://localhost:3000"; // Replace with your redirect URI
const scopes = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "playlist-read-collaborative",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;

// Extract the token from URL hash
export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};