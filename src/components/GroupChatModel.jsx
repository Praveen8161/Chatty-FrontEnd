import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChatState } from "../context/ChatProvider";
import { API } from "../helpers/API";
import UserSearching from "./UserSearching";

const GroupChatModel = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { user, chats, setChats } = ChatState();

  // Create a New Group
  function handleSubmit() {
    if (!groupChatName || !selectedUsers) {
      alert("fields are required");
      return;
    }

    const URL = `${API}/chat/group`;
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name: groupChatName,
        users: selectedUsers.map((u) => u._id),
      }),
    })
      .then((e) => e.json())
      .then((data) => {
        if (data.acknowledged) {
          setChats([data.fullGroupChat, ...chats]);
          alert("chat is created");
          setGroupChatName("");
          setSelectedUsers([]);
          setSearch("");
          setSearchResult([]);
          document.getElementById("my_modal_3").close();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <span>
      {/* Model Start */}

      <button
        className="px-0 mx-0 bg-transparent border-none shadow-none btn"
        onClick={() => setShowModal(true)}
      >
        <span className="hidden md:inline">New Group Chat</span>{" "}
        <span className="relative top-[1px]">
          <FaPlus />
        </span>
      </button>
      {/*  */}
      {showModal && (
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="modal-box">
            <form method="dialog">
              {/* button to close the modal */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
              >
                ✕
              </button>
            </form>

            <h1 className="text-lg font-bold">Create a Group Chat</h1>
            {/* Group Name */}
            <input
              type="text"
              placeholder="Enter Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
              className="w-full max-w-xs mb-4 input input-bordered input-md rounded-2xl"
            />
            {/* Searched and Selected User */}
            <UserSearching
              searchResult={searchResult}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              setSearchResult={setSearchResult}
              search={search}
              setSearch={setSearch}
            />
            {/* Create Chat */}
            <button
              onClick={handleSubmit}
              className="px-2 py-1 mt-3 text-white bg-green-700"
            >
              Create Chat
            </button>
          </div>
        </div>
      )}

      {/* Model End */}
    </span>
  );
};

export default GroupChatModel;
