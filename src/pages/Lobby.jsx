import React from "react";
import Chat from "../components/Chat";

const Lobby = () => {
  // const currentUser = JSON.parse(
  //   localStorage.getItem("chessmixed_currentUser")
  // );

  // console.log(currentUser);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Lobby</h1>
      {/* <p>Welcome {currentUser.displayName}</p> */}
      <Chat />
    </div>
  );
};

export default Lobby;
