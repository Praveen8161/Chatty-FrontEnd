import { getSender, getSenderFUll } from "../config/ChatLogic.js";
import { ChatState } from "../context/ChatProvider";
import { AiOutlineEye } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { API } from "../helpers/API.js";
import { useEffect, useState } from "react";
import UserBadge from "./UserBadge.jsx";
import UserListItem from "./UserListItem.jsx";

/* eslint-disable react/prop-types */
// Selected Chat Details , view and update group chat profile
const SingleChat = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  // Selected User
  const [selectedUsers, setSelectedUsers] = useState("");
  // Query -- Add new user for Group chat - Group Admin
  const [search, setSearch] = useState("");
  // Searched User
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // Chat Name
  const [chatName, setChatName] = useState(selectedChat.chatName);
  // Group Chat New Name Upadet
  const [updateName, setUpdateName] = useState(false);

  //  Remove User from Group -- Group Admin or a user itself
  function handleUserRemove(chatId, userId) {
    const URL = `${API}/chat/remove`;

    fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ chatId, userId }),
    })
      .then((d) => d.json())
      .then((data) => {
        if (data.acknowledged) {
          setSelectedChat(data.removed);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // For New User Update -- Group Admin
  function handleUserUpdate() {
    if (!selectedUsers) {
      alert("User Required");
      return;
    }
    const URL = `${API}/chat/groupadd`;

    fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ chatId: selectedChat._id, userId: selectedUsers }),
    })
      .then((d) => d.json())
      .then((data) => {
        if (data.acknowledged) {
          setSelectedChat(data.added);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // For New Chat Name -- Group Admin
  function handleChatNameUpdate(chatId) {
    if (!chatName) {
      alert("Chat Name is Required");
      return;
    }
    setUpdateName(false);
    const URL = `${API}/chat/rename`;
    fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ chatId, chatName }),
    })
      .then((e) => e.json())
      .then((data) => {
        if (data.acknowledged) {
          setSelectedChat(data.updatedChat);
          const tempChats = chats.map((c) => {
            if (data.updatedChat._id === c._id) {
              return data.updatedChat;
            }
            return c;
          });
          setChats(tempChats);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Serch for users
  function handleUserSearch(query) {
    setSearch(query);
    if (!query) {
      return;
    }
    setSearchResult([]);
    setLoading(true);

    const URL = `${API}/user?search=${search}`;
    fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((e) => e.json())
      .then((data) => {
        if (data.acknowledged) {
          let existUserId = new Set(selectedChat.users.map((obj) => obj.id));

          let users = data.users.filter((f) => !existUserId.has(f.id));

          setSearchResult(users);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // remove the selected user
  const handleDelete = () => {
    setSelectedUsers("");
  };

  // Update the selected user
  function handleGroup(userToAdd) {
    setSelectedUsers(userToAdd);
  }

  useEffect(() => {
    setUpdateName(false);
    setChatName(selectedChat.chatName);
  }, [selectedChat._id]);

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex flex-row items-center justify-between px-2">
            {/* Chat Name */}
            <p className="text-xl font-semibold ">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)}
            </p>
            {/* To view Chat profile */}
            <label
              htmlFor="my_modal_7"
              className="p-0 px-3 m-0 bg-transparent border-none shadow-none btn"
            >
              <AiOutlineEye size={20} />
            </label>

            {/* Chat Profile Model */}
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal" role="dialog">
              {/* For Group Chat */}
              {selectedChat.isGroupChat ? (
                <div className="flex flex-col items-center modal-box">
                  {/* Update Chat Name */}
                  {updateName ? (
                    <div className="flex flex-row gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Enter Chat Name"
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        className="w-full max-w-xs input input-bordered input-md rounded-2xl"
                      />
                      <button
                        onClick={() => handleChatNameUpdate(selectedChat._id)}
                        className="px-2 bg-blue-500 rounded-lg hover:bg-blue-800 hover:text-white"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <h3 className="flex flex-row items-center gap-2 mb-3 text-lg font-bold">
                      <span>{selectedChat.chatName}</span>

                      {/* Allow Admin to change the Group Name -- Icon */}
                      {selectedChat.groupAdmin._id === user._id ? (
                        <span
                          onClick={() => setUpdateName(true)}
                          className="relative top-[2px] cursor-pointer"
                        >
                          <FaRegEdit />
                        </span>
                      ) : (
                        ""
                      )}
                    </h3>
                  )}

                  {/* All the Users in the Group */}
                  <div className="flex flex-row flex-wrap items-center justify-center gap-3 mb-3">
                    {/* All the users in the group */}
                    {selectedChat.users.map((u) => (
                      <div
                        key={u._id}
                        className="flex flex-row items-center justify-center h-full overflow-hidden border-2 border-black rounded-xl"
                      >
                        {/* user name */}
                        <span className="self-center px-2 py-1 bg-blue-500">
                          {u.name}
                        </span>

                        {/* Remove user from group -- Groups Admin*/}
                        {user._id === selectedChat.groupAdmin._id ? (
                          <span
                            onClick={() =>
                              handleUserRemove(selectedChat._id, u._id)
                            }
                            className="h-full cursor-pointer"
                          >
                            <IoIosCloseCircleOutline
                              size={21}
                              className="border-black"
                            />
                          </span>
                        ) : u._id === user._id ? (
                          // Or if curr user is in the group allow them to leave the group
                          <span
                            onClick={() =>
                              handleUserRemove(selectedChat._id, u._id)
                            }
                            className="h-full cursor-pointer"
                          >
                            <IoIosCloseCircleOutline
                              size={21}
                              className="border-black"
                            />
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Serach for User to be Added to the group */}
                  {user._id === selectedChat.groupAdmin._id ? (
                    <>
                      <input
                        type="text"
                        placeholder="Users name"
                        onChange={(e) => handleUserSearch(e.target.value)}
                        className="w-full max-w-xs input input-bordered input-md rounded-2xl"
                      />

                      {/* Selected Users */}
                      <div className="flex flex-row flex-wrap gap-1 mt-2">
                        {selectedUsers ? (
                          <UserBadge
                            key={selectedUsers._id}
                            u={selectedUsers}
                            handleDelete={handleDelete}
                          />
                        ) : (
                          ""
                        )}
                      </div>

                      {/* Search Results */}
                      <div className="flex flex-col items-center justify-center">
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          <div className="flex flex-col items-start justify-center">
                            {searchResult?.slice(0, 4).map((user) => (
                              <UserListItem
                                key={user._id}
                                user={user}
                                handleGroup={handleGroup}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Button to Add new user to group Chat */}
                      <button
                        onClick={handleUserUpdate}
                        className="px-2 py-1 mt-3 text-white bg-green-700"
                      >
                        Create Chat
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                // For One on One chat
                <div className="flex flex-col items-center modal-box">
                  <img
                    src={getSenderFUll(user, selectedChat.users).pic}
                    alt="DP"
                    className="w-[100px] h-[100px] rounded-[50%]"
                  />
                  <h3 className="text-lg font-bold">
                    {getSenderFUll(user, selectedChat.users).name}
                  </h3>
                  <p className="">
                    {getSenderFUll(user, selectedChat.users).email}
                  </p>
                </div>
              )}
              <label className="modal-backdrop" htmlFor="my_modal_7">
                Close
              </label>
            </div>
          </div>
        </>
      ) : (
        // if there is no chat is selected
        <div className="w-full text-center">Select User to Chat</div>
      )}
    </>
  );
};

export default SingleChat;
