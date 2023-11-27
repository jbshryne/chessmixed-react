import "./App.css";
import { Outlet } from "react-router-dom";
// import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";

// import { io } from "socket.io-client";
// import Chat from "./components/Chat";

// const socket = io("http://localhost:3200"); // Adjust the URL to match your server

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Use socket here

    function onConnect() {
      console.log("Connected!");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Disconnected!");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // const [currentUser, setCurrentUser] = useState(null);

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("chessmixed-currentUser"));
  //   if (user) {
  //     setCurrentUser(user);
  //   }
  // }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Outlet></Outlet>
      <ConnectionManager />
      {/* <button onClick={() => socket.emit("hello", "world!")}>Send</button> */}
    </div>
  );
}

export default App;
