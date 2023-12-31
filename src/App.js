// App.js
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import Games from "./pages/Games";
import Game from "./pages/Game";
import Header from "./components/Header";
import AuthChecker from "./components/AuthChecker";
import { GameProvider } from "./store/game-context";
import io from "socket.io-client";
// import { Chess } from "chess.js";

const socket = io.connect(process.env.REACT_APP_API_URL);

function App() {
  useEffect(() => {
    // Use socket here

    function onConnect() {
      console.log("Connected!");
    }

    function onDisconnect() {
      console.log("Disconnected!");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  const [isLoggedIn, setIsLoggedIn] = useState(currentUser ? true : false);

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <GameProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/login"
            element={
              <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route
            path="/lobby"
            element={
              <AuthChecker targetUrl="/lobby">
                <Lobby />
              </AuthChecker>
            }
          />
          <Route
            path="/games"
            element={
              <AuthChecker targetUrl="/games">
                <Games />
              </AuthChecker>
            }
          />
          <Route
            path="/game/"
            element={
              <AuthChecker targetUrl="/game">
                <Game />
              </AuthChecker>
            }
          />
        </Routes>
      </GameProvider>
    </div>
  );
}

export default App;
