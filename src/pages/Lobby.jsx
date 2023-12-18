import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import { socket } from "../socket";

const Lobby = () => {
  const [usersPresent, setUsersPresent] = useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  useEffect(() => {
    socket.on("usersInLobby", (usersInLobby) => {
      console.log("usersInLobby", usersInLobby);
      setUsersPresent(usersInLobby);
    });

    socket.on("userJoined", (user, usersInLobby) => {
      console.log("userJoined", user, socket);
      console.log("usersInLobby", usersInLobby);
      setUsersPresent(usersInLobby);
    });

    // socket.on("userLeft", (user) => {
    //   console.log("userLeft", user);
    //   setUsersPresent((usersPresent) =>
    //     usersPresent.filter((presentUser) => presentUser._id !== user._id)
    //   );
    // });

    socket.on("userDisconnected", (loggedInUsers) => {
      // console.log("userDisconnected", socketId);
      setUsersPresent(loggedInUsers);
    });
  }, []);

  useEffect(() => {
    // Join the "lobby" room when the page loads
    socket.emit("joinLobby", currentUser);

    // return () => {
    //   // Leave the "lobby" room when the page unmounts
    //   socket.emit("leaveLobby", currentUser);
    // };
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Lobby</h1>
      <p>Welcome {currentUser.displayName}</p>
      <Chat />
      <h4>Users Present:</h4>
      <ul>
        {usersPresent.map((user) => (
          <li key={user.socketId}>{user.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
