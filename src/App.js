import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import AuthChecker from "./components/AuthChecker";
import { useEffect, useState } from "react";
import GamesList from "./pages/GamesList";

// import { io } from "socket.io-client";

// const socket = io("http://localhost:3200");
// socket.on("connect", () => {
//   console.log(socket.id);
// });

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chessmixed-currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Auth setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/lobby"
          element={
            <AuthChecker>
              <Lobby currentUser={currentUser} />
            </AuthChecker>
          }
        />
        <Route
          path="/games"
          element={
            <AuthChecker>
              <GamesList />
            </AuthChecker>
          }
        />
      </Routes>
      {/* <button onClick={() => socket.emit("hello", "world!")}>Send</button> */}
    </div>
  );
}

export default App;
