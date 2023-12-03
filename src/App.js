// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AuthChecker from "./components/AuthChecker";
import Lobby from "./pages/Lobby";
import Games from "./pages/Games";
import Game from "./pages/Game";
import io from "socket.io-client";
import { GameProvider } from "./store/game-context";
// import { Chess } from "chess.js";

const socket = io.connect("http://localhost:3200");

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

  const [currentGame, setCurrentGame] = useState(null);

  return (
    // <div>Test</div>
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route
            path="/lobby"
            element={
              <AuthChecker>
                <Lobby />
              </AuthChecker>
            }
          />
          <Route
            path="/games"
            element={
              <AuthChecker>
                <Games setCurrentGame={setCurrentGame} />
              </AuthChecker>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <AuthChecker>
                <Game currentGame={currentGame} />
              </AuthChecker>
            }
          />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
