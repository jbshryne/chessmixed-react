import { useState, useEffect } from "react";
import { socket } from "../socket";

const Chat = () => {
  // const socket = io("http://localhost:3200");
  const currentUser = JSON.parse(
    localStorage.getItem("chessmixed_currentUser")
  );

  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    room: "",
  });

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Connected to server");
      setMessages([...messages, "Connected to server as " + socket.id]);
    });
  }, []);

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = () => {
    console.log(formData.message);

    const userName = `${currentUser.displayName}: `;

    const newMessage = userName + formData.message;
    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <div id="chat-container">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      {/* <div> */}
      <label htmlFor="message">Message: </label>
      <input
        type="text"
        name="message"
        id="chat-input"
        onChange={handleFormData}
      />
      <button onClick={handleSendMessage}>Send</button>
      {/* </div> */}
      {/* <div> */}
      <label htmlFor="room">Room: </label>
      <input
        type="text"
        name="room"
        id="room-input"
        onChange={handleFormData}
      />
      <button type="button" id="room-button">
        Join
      </button>
      {/* </div> */}
    </div>
  );
};

export default Chat;
