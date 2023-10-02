import React, { useContext } from "react";
import SideBar from "./chat/SideBar";
import ChatModal from "./chat/ChatModal";
import { chatContext } from "../context/chatContextProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useContext(chatContext);
  return (
    <div className="">
      <ChatModal />
      {!state.user.username ? (
        <h1
          className="text-center mt-8 animate-bounce text-2xl cursor-pointer"
          onClick={() =>
            dispatch({ type: "OPEN_CHAT_REGISTER_MODAL", payload: true })
          }
        >
          Register a user to start chat
        </h1>
      ) : (
        <div className="flex space-x-2 w-full">
          <SideBar />
          <div className="flex-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Layout;
