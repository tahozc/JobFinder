import {
  APPLY_COMPANY_CHAT_SEARCH_FILTER,
  APPLY_USER_CHAT_SEARCH_FILTER,
  RESET_CHAT,
  SET_CHAT,
  SET_CONVERSATIONS,
  UPDATE_CHAT,
  UPDATE_MESSAGES,
} from "../actions/types";

const initialState = {
  chats: [],
  filteredChats: [],
  selectedChat: null,
  messageText: "",
  connectionEstablished: false,
  searchText: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT: {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    case SET_CONVERSATIONS: {
      return {
        ...state,
        chats: action.payload,
        filteredChats: action.payload,
      };
    }
    case UPDATE_MESSAGES: {
      if (state.selectedChat) {
        const { selectedChat, chats } = state;
        const { messages } = selectedChat;
        const { conversation, message } = action.payload.value;
        const chatOpened = conversation._id === selectedChat._id;

        let newselectedChat = selectedChat;
        if (chatOpened) {
          newselectedChat = conversation;
        }

        const newChats = chats.map((chat) =>
          chat._id === conversation._id ? conversation : chat
        );

        return {
          ...state,
          selectedChat: newselectedChat,
          chats: newChats,
        };
      }
    }
    case RESET_CHAT: {
      return initialState;
    }
    case APPLY_USER_CHAT_SEARCH_FILTER: {
      const { chats, searchText } = state;
      const searchRegex = new RegExp(searchText, "i");
      const newChats = chats.filter((chat) => {
        return (
          searchText === "" ||
          searchRegex.test(`${chat.user.firstName} ${chat.user.lastName}`)
        );
      });
      return {
        ...state,
        filteredChats: newChats,
      };
    }
    case APPLY_COMPANY_CHAT_SEARCH_FILTER: {
      const { chats, searchText } = state;
      const searchRegex = new RegExp(searchText, "i");
      const newChats = chats.filter((chat) => {
        return searchText === "" || searchRegex.test(chat.company.companyName);
      });
      return {
        ...state,
        filteredChats: newChats,
      };
    }
    default:
      return state;
  }
};
