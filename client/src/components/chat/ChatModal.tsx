import React, { useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { chatContext } from "../../context/chatContextProvider";

const ChatModal = () => {
  const [user, setUser] = useState("");

  const { state, dispatch } = useContext(chatContext);

  const registerName = (e: any) => {
    e.preventDefault();

    dispatch({
      type: "SET_USER",
      payload: { username: user, roomId: [...state.user.roomId] },
    });
    dispatch({ type: "OPEN_CHAT_REGISTER_MODAL", payload: false });
    //socket.emit("user_connected", { username: user });
  };
  return (
    <>
      <Transition appear show={state.openChatRegisterModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() =>
            dispatch({ type: "OPEN_CHAT_REGISTER_MODAL", payload: false })
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Register User
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={registerName}>
                      <input
                        value={user}
                        className="border border-blue-400 p-2 w-64"
                        type="text"
                        placeholder="enter your name"
                        onChange={(e) => setUser(e.target.value)}
                      />
                      <button className="bg-blue-200 p-2 border border-black">
                        Enter Name
                      </button>
                    </form>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() =>
                        dispatch({
                          type: "OPEN_CHAT_REGISTER_MODAL",
                          payload: false,
                        })
                      }
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChatModal;
