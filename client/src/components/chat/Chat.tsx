import React from "react";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";
import ChatModal from "./ChatModal";

const Chat = () => {
  return (
    <div className="w-full p-5 border border-green-300">
      <ChatContent />

      <ChatInput />
    </div>
  );
};

export default Chat;
