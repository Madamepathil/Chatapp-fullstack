import React, { useContext, useEffect, useState } from "react";
import { chatContext } from "../../context/ChatContextProvider";
import { socket } from "./ChatContent";
import toast, { Toaster } from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";

// bugg: när man joinat, ska man inte kunna joina igen.....

const SideBar = () => {
  const [roomId, setRoomId] = useState("");

  const { dispatch, state } = useContext(chatContext);

  console.log(state.messages, "Messages");
  console.log(state.user, "User");
  console.log(state.activeRoom, "ActiveRoom");

  useEffect(() => {
    socket.on("join room", (joinedUser) => {
      if (state.user.username === joinedUser.joinedUser.user.username) return;

      if (state.user.roomId.includes(joinedUser.joinedUser.roomId)) {
        const toastObj = toast.success(
          `${joinedUser.joinedUser.user.username} joined room: ${joinedUser.joinedUser.roomId}`
        );
        //toastObj.dismiss();
      }
    });
  }, [state.user]);
  // måste ha dependcy här för, useEffecten kommer att köras först å koppla upp join room,
  // vilket betyder att när en emit körs så körs socket.on ovan men den har inte tillgång till use statet
  // då user statet sätts i ett senare flöde, måste därför uppdatera useEfecten efter att user state sätts.

  useEffect(() => {
    socket.on("join room", (joinedUser) => {
      if (state.user.username === joinedUser.joinedUser.user.username) {
        console.log("ska komma för den som joinar");
        joinedUser.sentMessages.map((prevMsg: any) => {
          console.log(prevMsg);
          dispatch({
            type: "SEND_MESSAGE",
            payload: {
              ...prevMsg,
            },
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    socket.on("created rooms", (createdRooms) => {
      //console.log(createdRooms, "created rooms");
      dispatch({ type: "SET_CREATED_ROOMS", payload: createdRooms });
    });

    socket.emit("created rooms");
  }, []);

  const joinRoom = (e: any) => {
    e.preventDefault();
    if (state.createdRooms.includes(roomId)) return;
    dispatch({ type: "JOIN_ROOM", payload: roomId });
    dispatch({ type: "SET_ACTIVE_ROOM", payload: roomId });
    socket.emit("join room", {
      user: { username: state.user.username },
      roomId,
    });
    setRoomId("");
  };
  //console.log(state.createdRooms, "created rooms");

  return (
    <div className="min-w-fit p-5 border border-red-200">
      <Toaster />

      {state.user.username && (
        <div className="flex- flex-col space-y-4 ">
          <form className="flex items-center w-full " onSubmit={joinRoom}>
            <input
              value={roomId}
              className="border border-blue-400 p-2 w-full "
              type="text"
              placeholder="Create a room..."
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              disabled={!roomId}
              className="bg-blue-200 p-2 border border-black"
            >
              Create
            </button>
          </form>

          <Menu>
            <Menu.Button className="w-full">
              {" "}
              <h3 className="text-blue-600 text-center w-full">
                Available rooms{" "}
              </h3>
            </Menu.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="flex flex-col gap-2 bg-gray-200 shadow-lg p-2">
                {state.createdRooms.map((room, i) => {
                  //console.log(i);
                  return (
                    <Menu.Item>
                      {({ active }) => (
                        <p
                          onClick={() => {
                            if (!state.user.roomId.includes(room)) {
                              dispatch({ type: "JOIN_ROOM", payload: room });
                              socket.emit("join room", {
                                user: { username: state.user.username },
                                roomId: room,
                              });
                            }
                            dispatch({
                              type: "SET_ACTIVE_ROOM",
                              payload: room,
                            });
                          }}
                          className={` p-2  ${
                            active &&
                            "text-green-600 cursor-pointer  animate-pulse "
                          }`}
                        >
                          {room}
                        </p>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default SideBar;
