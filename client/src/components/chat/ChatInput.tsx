import React, { useContext, useEffect, useState } from "react";
import Avatar from "../Avatar";
import { User, chatContext } from "../../context/ChatContextProvider";
import { socket } from "./ChatContent";

const ChatInput = () => {
  const [isTyping, setIsTyping] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  let timer: any;

  const { state } = useContext(chatContext);
  const { user } = state;

  const handleWrittingMsg = (e: any) => {
    setMessage(e.target.value);
    setIsTyping(user);
    //console.log(state.user);
    socket.emit("message typing", user);
    timer = setTimeout(() => {
      timer = null;
    }, 500);
  };

  useEffect(() => {
    //console.log("msg typing");
    socket.on("message typing", (typingUser) => {
      //console.log("llllll");
      //console.log(typingUser, "den som skriver");
      //console.log(state.user, "inloggat user");
      // Check if the typing user is in the same room as the current user
      if (state.user.roomId.includes(typingUser.roomId[0])) {
        //console.log("samma rum");
        clearTimeout(timer);
        setIsTyping(typingUser);

        timer = setTimeout(() => {
          setIsTyping(null);
        }, 1000);
      }
    });
  }, [state.user]);

  const handleSubmitMsg = (e: any) => {
    e.preventDefault();
    setMessage("");

    //console.log(user.roomId);
    socket.emit("chat message", {
      message: message,
      user: { username: user.username, roomId: state.activeRoom },
    });
  };

  return (
    <div>
      {/* {isTyping && isTyping.username !== user.username && (
        <div className="flex space-x-1 items-center">
          <Avatar
            username={
              isTyping.username === user.username
                ? user.username
                : isTyping.username
            }
            color={"red"}
            size={7}
            isUser={user.username === isTyping.username}
          />
          <span className="loading loading-dots loading-xs"></span>
        </div>
      )} */}

      <div className="">
        <form onSubmit={handleSubmitMsg} className="flex space-x-3">
          <input
            value={message}
            className="flex-1 border border-black p-2 rounded-md"
            type="text"
            placeholder="enter message.."
            onChange={handleWrittingMsg}
          />
          <button
            disabled={!user.username || !state.user.roomId}
            className={`px-8 border border-black bg-blue-600 rounded-md ${
              !user.username || !user.roomId ? "cursor-not-allowed" : ""
            } ${!user.username || !user.roomId ? "opacity-40" : "opacity-100"}`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
