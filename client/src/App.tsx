import { useContext, useEffect, useRef, useState } from "react";
import Chat from "./components/chat/chat";
import { User, chatContext } from "./context/chatContextProvider";
import { socket } from "./components/chat/chatContent";
import Layout from "./components/Layout";
export interface Message {
  user: string;
  message: string;
}
function App() {
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState("");

  const [personConnectedToYourRoom, setPersonConnectedToYourRoom] =
    useState("");

  const { state, dispatch } = useContext(chatContext);
  const [roomError, setRoomError] = useState(false);
  // const registerName = (e: any) => {
  //   e.preventDefault();
  //   if (!state.user.roomId) {
  //     setRoomError(true);
  //     return;
  //   }
  //   setRoomError(false);
  //   dispatch({ type: "SET_USER", payload: { username: user, roomId: roomId } });
  //   //socket.emit("user_connected", { username: user });
  // };

  // const joinRoom = (e: any) => {
  //   e.preventDefault();
  //   dispatch({ type: "JOIN_ROOM", payload: roomId });
  //   socket.emit("join room", { user: { username: user }, roomId });
  // };

  // useEffect(() => {
  //   socket.on("join room", (roomId) => {
  //     console.log(roomId, "RROM ID");
  //     if (state.user.username === roomId.user.username) {
  //       return;
  //     }
  //     if (state.user.roomId === roomId.roomId) {
  //       console.log("match");
  //       setPersonConnectedToYourRoom(roomId.user.username);
  //     }
  //   });
  // }, [state.user]);

  useEffect(() => {
    if (state.user.username) {
      //skickar till socket.on i backend som lyssnnar
      socket.emit("user_connected", { username: user });
    }
  }, [state.user]);

  // Listen for updates to the list of connected users from the backend
  useEffect(() => {
    //lyssnar från från backend som skickar från io.emit
    socket.on("user_connected", (users) => {
      // Update your state with the list of connected users
      //setConnectedUsers(users);
      dispatch({
        type: "SET_CONNECTED_USERS",
        payload: users,
      });
    });

    return () => {
      // Cleanup: Remove the event listener when the component unmounts
      socket.off("user_connected");
    };
  }, []);

  return (
    <div>
      <Layout>{state.user.username && <Chat />}</Layout>
    </div>
  );
}

export default App;
