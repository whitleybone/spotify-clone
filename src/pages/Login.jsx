import React from "react";
import { loginUrl } from "../utils/auth";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <a href={loginUrl} className="bg-green-500 px-4 py-2 rounded">
        Login with Spotify
      </a>
    </div>
  );
};

export default Login;