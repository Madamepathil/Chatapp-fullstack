import React, { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Avatar from "../Avatar";
import { chatContext } from "../../context/ChatContextProvider";

export const socket = io("http://localhost:3000");
const ChatContent = () => {
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  const { state, dispatch } = useContext(chatContext);

  useEffect(() => {
    console.log("messages socket.on recieve");
    socket.on("chat message", (msg) => {
      console.log(msg, "msg from backend");
      //setMessages([...messages, { user: msg.user, message: msg.message }]);
      dispatch({
        type: "SEND_MESSAGE",
        payload: msg,
      });
    });

    return () => {
      // Cleanup the listener when the component unmounts
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop =
        scrollableContainerRef.current.scrollHeight;
    }
  }, [state.messages]);

  // {
  //   state.messages
  //     .filter((msg) => msg.user.roomId.includes(state.activeRoom))
  //     .forEach((msg, i) => {
  //       console.log(msg.message);
  //     });
  // }
  return (
    <div className="w-full flex flex-col space-y-2 min-h-[200px] max-h-[500px]">
      {state.activeRoom && (
        <p className="text-center">Active Room: {state.activeRoom}</p>
      )}
      <div
        ref={scrollableContainerRef}
        className="flex-1 flex flex-col space-y-3 border-2 border-black h-full overflow-y-scroll p-3"
      >
        {state.messages
          .filter((msg) => msg.user.roomId.includes(state.activeRoom))
          .map((msg, i) => {
            return (
              <div
                key={i}
                className={` max-w-[45%] ${
                  msg.user.username === state.user.username && "self-end"
                }  `}
              >
                <div className="flex flex-col space-y-1">
                  <Avatar
                    isUser={msg.user.username === state.user.username}
                    username={msg.user.username}
                  />
                  <div className="bg-gray-100 py-1 px-2 rounded-md m-0 break-all">
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatContent;
