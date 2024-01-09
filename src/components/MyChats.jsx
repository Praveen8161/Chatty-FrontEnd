/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { API } from "../helpers/API";
import { getSender } from "../config/ChatLogic.js";

// List of users in the left side box
const MyChats = () => {
  // Current User
  const [loggedUser, setLoggedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const { setSelectedChat, chats, setChats } = ChatState();

  // Get All the Chats List of the User
  function fetchChats() {
    const URL = `${API}/chat/`;
    fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userInfo")).token
        }`,
      },
    })
      .then((e) => e.json())
      .then((data) => {
        if (data.acknowledged) {
          setChats(data.results);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  // Initial Loading
  if (loading) {
    return (
      <div className="flex flex-col flex-grow gap-3 px-3 py-3 bg-slate-300 rounded-t-xl">
        Loading ...
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow gap-3 px-3 py-3 bg-slate-200 rounded-t-xl">
      {/* All Chats List*/}
      {chats?.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          className="px-2 py-4 border-t-[1px] bg-slate-400 cursor-pointer rounded-md flex flex-col ga-1 "
        >
          {/* Logic to see opposite Chat user */}
          <h1>
            {chat.isGroupChat
              ? chat.chatName
              : getSender(loggedUser, chat.users)}
          </h1>

          {/* Latest Message */}
          {chat.latestMessage && (
            <div>
              <span>{chat.latestMessage.sender.name}: </span>
              <span>
                {chat.latestMessage.content.length > 25
                  ? chat.latestMessage.content.substring(0, 25) + "..."
                  : chat.latestMessage.content}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyChats;
