import { useState } from "react";
import Chat from "./Chat";

const MessageState = () => {
  const [messages, setMessages] = useState([]);

  return (
    <>
      <Chat messages={messages} setMessages={setMessages} />
    </>
  );
};

export default MessageState;
