import React, { createContext } from "react";

// Define the User interface
export interface User {
  username: string;
  roomId: (string | number)[]; // Define roomId as an array of strings or numbers
}

// Define your initial state
interface MessageState {
  messages: Message[];
  user: User;
  createdRooms: (string | number)[];
  conectedUsers: { socketId: string; user: { username: string } }[];
  openChatRegisterModal: boolean;
  activeRoom: string | number;
}

// Define the Message interface
interface Message {
  user: User;
  message: string;
}

// Define your actions
type ChatAction =
  | { type: "SEND_MESSAGE"; payload: Message }
  | { type: "SET_USER"; payload: User }
  | { type: "OPEN_CHAT_REGISTER_MODAL"; payload: boolean }
  | {
      type: "SET_CONNECTED_USERS";
      payload: { socketId: string; user: { username: string } }[];
    }
  | { type: "REMOVE_CONNECTED_USERS"; payload: string }
  | { type: "JOIN_ROOM"; payload: string | number }
  | { type: "SET_CREATED_ROOMS"; payload: (string | number)[] }
  | { type: "SET_ACTIVE_ROOM"; payload: string | number };

// Create your context
interface ChatContext {
  state: MessageState;
  dispatch: React.Dispatch<ChatAction>;
}

// Define your initial state
const initState: MessageState = {
  messages: [],
  user: { username: "", roomId: [] }, // Initialize roomId as an empty array
  conectedUsers: [],
  createdRooms: [],
  openChatRegisterModal: false,
  activeRoom: "",
};

// Create the context
export const chatContext = createContext<ChatContext>({
  state: initState,
  dispatch: () => {},
});

// Define your reducer
const reducer = (state: MessageState, action: ChatAction) => {
  console.log(action);
  switch (action.type) {
    case "SEND_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "OPEN_CHAT_REGISTER_MODAL":
      return {
        ...state,
        openChatRegisterModal: action.payload,
      };
    case "SET_CONNECTED_USERS":
      return {
        ...state,
        conectedUsers: action.payload,
      };
    case "REMOVE_CONNECTED_USERS":
      return {
        ...state,
        conectedUsers: state.conectedUsers.filter(
          (user) => user.socketId !== action.payload
        ),
      };
    case "JOIN_ROOM":
      if (!state.user.roomId.includes(action.payload)) {
        return {
          ...state,
          user: {
            ...state.user,
            roomId: [...state.user.roomId, action.payload],
          },
        };
      }
      return state;
    case "SET_CREATED_ROOMS":
      return {
        ...state,
        createdRooms: action.payload,
      };
    case "SET_ACTIVE_ROOM":
      return {
        ...state,
        activeRoom: action.payload,
      };

    default:
      return state;
  }
};

// Create your context provider
const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initState);

  return (
    <chatContext.Provider value={{ state, dispatch }}>
      {children}
    </chatContext.Provider>
  );
};

export default ChatContextProvider;
