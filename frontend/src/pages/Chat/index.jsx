import React, { Fragment, useEffect } from "react";
import withDashboard from "../../HOC/Dashboard";
import UserImg from "../../assets/avatar.png";
import Input from "../../shared/Input";
import "./index.css";
import { faPaperPlane, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  applyCompanySearchFilter,
  applyUserSearchFilter,
  establishConnection,
  getCompanyChats,
  getUserChats,
  setChat,
} from "../../redux/actions/chatAction";
import { setShared } from "../../redux/actions/sharedAction";
const Chat = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(({ Shared }) => Shared.currentUser);
  const isCompany = currentUser.type === 0;
  const Chat = useSelector(({ Chat }) => Chat);
  const { chats, filteredChats, messageText, selectedChat, searchText } = Chat;
  useEffect(() => {
    if (currentUser) {
      if (currentUser.type === 0) {
        const companyId = currentUser._id;
        dispatch(establishConnection({ id: companyId }));
        dispatch(getCompanyChats({ companyId }));
      } else {
        const userId = currentUser._id;
        dispatch(establishConnection({ id: userId }));
        dispatch(getUserChats({ userId }));
      }
    }
    dispatch(
      setShared({
        name: "DashboardPage",
        value: "Chat",
      })
    );
  }, []);

  const onSendMessage = () => {
    if (currentUser) {
      if (selectedChat) {
        if (currentUser.type === 0) {
          // Company
          const text = messageText;
          const companyId = currentUser._id;
          const userId = selectedChat.userId;
          const isCompany = true;
          dispatch(
            addMessage({
              sender: companyId,
              reciever: userId,
              text,
              isCompany,
            })
          );
        } else {
          // User
          const text = messageText;
          const companyId = selectedChat.companyId;
          const userId = currentUser._id;
          const isCompany = false;
          dispatch(
            addMessage({
              sender: userId,
              reciever: companyId,
              text,
              isCompany,
            })
          );
        }
      }
      dispatch(
        setChat({
          name: "messageText",
          value: "",
        })
      );
    }
  };

  const onMessageChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(
      setChat({
        name: name,
        value: value,
      })
    );
  };
  const onSearchChange = (e) => {
    const value = e.target.value;
    dispatch(
      setChat({
        name: "searchText",
        value: value,
      })
    );
    if (isCompany) {
      dispatch(applyUserSearchFilter());
    } else {
      dispatch(applyCompanySearchFilter());
    }
  };
  const setSelectedChat = (chat) => {
    dispatch(
      setChat({
        name: "selectedChat",
        value: chat,
      })
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-card-container">
        <div className="chat-users-container">
          <div className="chat-users-search-container">
            <Input
              type={"text"}
              icon={faSearch}
              onChange={onSearchChange}
              name={"searchText"}
              value={searchText}
            />
          </div>
          {chats &&
            filteredChats.map((chat) => (
              <div
                className="chat-user-item"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-user-item-image-container">
                  <img
                    src={
                      isCompany
                        ? chat.user.image
                          ? require(`../../assets/profile/${chat.user.image}`)
                          : UserImg
                        : chat.company.image
                        ? require(`../../assets/profile/${chat.company.image}`)
                        : UserImg
                    }
                    alt={"user.png"}
                    className="chat-user-item-image"
                  />
                </div>
                <div className="chat-user-item-text-container">
                  <div className="chat-user-item-name">
                    {isCompany
                      ? `${chat.user.firstName} ${chat.user.lastName}`
                      : chat.company.companyName}
                  </div>
                  <div className="chat-user-item-lastmessage">
                    Online
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="chat-message-container">
          <div className="chat-message-header">
            {selectedChat && (
              <Fragment>
                <img
                  src={
                    selectedChat
                      ? isCompany
                        ? selectedChat.user.image
                          ? require(`../../assets/profile/${selectedChat.user.image}`)
                          : UserImg
                        : selectedChat.company.image
                        ? require(`../../assets/profile/${selectedChat.company.image}`)
                        : UserImg
                      : UserImg
                  }
                  className="chat-header-img"
                  alt={"user.png"}
                />
                <div className="chat-currentuser-name">
                  {isCompany
                    ? `${selectedChat.user.firstName} ${selectedChat.user.lastName}`
                    : selectedChat.company.companyName}
                </div>
              </Fragment>
            )}
          </div>
          <div className="chat-conversation-container">
            {selectedChat &&
              selectedChat.messages.map((message) => {
                if (
                  (isCompany && message.isCompany) ||
                  (!isCompany && !message.isCompany)
                ) {
                  return (
                    <div className="chat-conversation-item alt">
                      <div className="chat-conversation-text-container">
                        <div className="chat-conversation-message">
                          {message.text}
                        </div>
                        <div className="chat-conversation-time">04:25</div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="chat-conversation-item">
                      <img
                        src={
                          isCompany
                            ? selectedChat.user.image
                              ? require(`../../assets/profile/${selectedChat.user.image}`)
                              : UserImg
                            : selectedChat.company.image
                            ? require(`../../assets/profile/${selectedChat.company.image}`)
                            : UserImg
                        }
                        alt={"user.png"}
                        className="chat-conversation-item-image"
                      />
                      <div className="chat-conversation-text-container">
                        <div className="chat-conversation-message">
                          {message.text}
                        </div>
                        <div className="chat-conversation-time">04:25</div>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
          <div className="chat-input-container">
            <Input
              type={"text"}
              placeholder={"Enter Message"}
              onChange={onMessageChange}
              name={"messageText"}
              value={messageText}
            />
            <div
              className="chat-input-send-icon-container"
              onClick={onSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDashboard(Chat);
