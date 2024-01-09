/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";
import { API } from "../helpers/API";
import { isLastMessage, isSameSender } from "../config/ChatLogic.js";
import { io } from "socket.io-client";

// Sockets
const ENDPOINT = `${API}`;
let socket, selectedChatCompare;

// Chat Box -- Real Time Chat View
const ChatBox = ({ setFetchAgain, fetchAgain }) => {
  // Selected Chat Details
  const { selectedChat, user } = ChatState();
  // All the messages for the Chats
  const [messages, setMessages] = useState("");
  // New Message in Input Field
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Check Socket Connection
  const [socketConnected, setSocketConnected] = useState(false);
  // User Typing Tracker
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", JSON.parse(localStorage.getItem("userInfo")));

    socket.on("connected", () => {
      setSocketConnected(true);
    });
    // Socket -- Receive -- Typing Events
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  }, []);

  // Socket - Emitter -- Typing Event
  function typingHandler(e) {
    setNewMessage(e.target.value);

    // Typing Indicator
    if (!socketConnected) return;

    if (!isTyping) {
      socket.emit("typing", selectedChat._id);
      setTimeout(() => {
        socket.emit("stopTyping", selectedChat._id);
      }, 5000);
    }
  }

  // Socket - Receiver -- New Message Event
  useEffect(() => {
    socket.on("messageReceived", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        return;
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  // Sending New Mesages and Socket -- Emitter - New Message
  function handleNewMessage(e) {
    if (newMessage && (e.key === "Enter" || e.target.name === "send")) {
      const URL = `${API}/message`;
      // It will work because it was not updated immediately without callback
      setNewMessage("");
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId: selectedChat._id, content: newMessage }),
      })
        .then((d) => d.json())
        .then((data) => {
          console.log(data);
          if (data.acknowledged) {
            // Socket - Emitter - New Message
            socket.emit("newMessage", data.message);
            setMessages(() => [...messages, data.message]);
          }
        })
        .catch((e) => console.log(e));
    }
  }

  // Fetching Messages
  function fetchMessages() {
    const URL = `${API}/message/${selectedChat._id}`;
    fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((d) => d.json())
      .then((data) => {
        if (data.acknowledged) {
          setMessages(data.messages);
          setLoading(false);

          socket.emit("joinChat", selectedChat._id);
        }
      })
      .catch((e) => console.log(e));
  }

  // Initialize -- Fetching Messages
  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat._id]);

  // To Scroll down to bottom of the Chat Box
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  //

  return (
    <div
      className={`h-full bg-stone-50 ${
        selectedChat ? "flex" : "hidden"
      } flex-col px-2`}
    >
      {/* Name of the selected chat top of the Chat Box */}
      <section>
        <SingleChat setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
      </section>

      {/* Selected chats Messages */}
      <section className="grid h-full max-h-full overflow-y-auto rounded-t-xl">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full font-semibold">
            Loading ...
          </div>
        ) : (
          // All Mesasges
          <ul className="flex flex-col justify-end px-2 py-2 custom_chatBox_bg">
            {messages &&
              messages?.map((m, i) => (
                <li
                  key={m._id}
                  className="flex flex-row gap-2 my-[2px] items-center  "
                >
                  {/* Logic to see sender Profile Pic */}

                  {isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id) ? (
                    <img
                      src={m.sender.pic}
                      alt="DP"
                      className="w-[30px] h-[30px] rounded-full bg-white"
                    />
                  ) : (
                    <span className="ml-7"></span>
                  )}
                  {/* Message Content */}
                  <div
                    className={`w-full flex flex-row ${
                      m.sender._id !== user._id
                        ? "justify-start"
                        : "justify-end"
                    } `}
                  >
                    <span
                      className={`px-2 py-2 max-w-[50%] text-white  rounded-xl  ${
                        m.sender._id !== user._id
                          ? "bg-green-600 text-left"
                          : "bg-blue-600 text-right"
                      }`}
                    >
                      {m.content}
                    </span>
                  </div>
                </li>
              ))}

            {/* Dummy Div tag for Scroll Down */}
            <div
              style={{ float: "left", clear: "both" }}
              ref={messagesEndRef}
            ></div>
          </ul>
        )}
      </section>
      {/* Typing Event */}
      {isTyping ? (
        <div className="text-white bg-transparent custom_chatBox_bg">
          Typing...
        </div>
      ) : (
        ""
      )}

      {/* Message Inputs */}
      <section className="flex flex-row h-10 gap-1 px-1 pb-2 custom_chatBox_bg flex-nowrap ">
        <input
          type="text"
          value={newMessage}
          onKeyDown={(e) => {
            handleNewMessage(e);
          }}
          onChange={(e) => typingHandler(e)}
          placeholder="Enter Message"
          className="w-full h-[35px] rounded-xl"
        />
        <button
          onClick={(e) => handleNewMessage(e)}
          className="w-16 bg-blue-500 rounded-xl"
          name="send"
        >
          Send
        </button>
      </section>
    </div>
  );
};

export default ChatBox;
