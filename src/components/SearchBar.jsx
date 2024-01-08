/* eslint-disable react/prop-types */
import { useState } from "react";
import { API } from "../helpers/API";
import { ChatState } from "../context/ChatProvider";
import SearchedUser from "./SearchedUser";
import SearchSkeleton from "./SearchSkeleton";
import { IoCloseCircleSharp } from "react-icons/io5";

// Side Search Bar for New User Search
const SearchBar = ({ searchShow, setSearchShow }) => {
  const [dataErr, setDataErr] = useState(false);

  // Search Query
  const [search, setSearch] = useState("");
  // Set button load
  const [chatLoad, setChatLoad] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);

  const [toast, setToast] = useState(false);
  // All the user matched the search query
  const [searchData, setSearchData] = useState([]);

  // Context Provider
  const { user, setSelectedChat, chats, setChats } = ChatState();

  // Searching for users
  function handleSearch() {
    if (!search) {
      setToast(() => true);
      setSearchLoading(() => false);
      setTimeout(() => {
        setToast(() => false);
      }, 4000);
      return;
    }
    // Get searched Users
    const URL = `${API}/user?search=${search}`;
    fetch(URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.acknowledged) {
          setSearchData(data.users);
          setSearchLoading(() => false);
        } else {
          setDataErr(() => true);
          setToast(() => true);
          setSearchLoading(() => false);
          setTimeout(() => {
            setToast(() => false);
            setDataErr(() => false);
          }, 4000);
        }
      })
      .catch((err) => {
        console.log(err);
        setSearchLoading(() => false);
      });
  }

  // Create Selected User Chats
  function accessChat(userId) {
    const URL = `${API}/chat/`;
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ userId }),
    })
      .then((e) => e.json())
      .then((data) => {
        if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        setChatLoad(false);
        setSearchShow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div
      className={`h-screen px-4 py-3 max-w-[350px] w-full absolute bg-gradient-to-r from-cyan-500 to-blue-500 top-0 left-0 flex flex-col justify-start items-center ${
        searchShow ? " translate-x-0 " : "translate-x-[-500px]"
      } transition-all duration-500 overflow-y-auto cus-scroll-hide overflow-x-hidden `}
    >
      {/* Heading */}
      <h1 className="mb-4 text-xl font-semibold">Search User</h1>

      {/* Search Input */}
      <div className="flex items-center justify-center gap-3">
        <input
          type="search"
          placeholder="Search User"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[200px] input input-bordered input-sm rounded-2xl"
        />
        <button
          onClick={() => {
            setSearchLoading(true);
            handleSearch();
          }}
          className="px-2 py-1 text-white rounded-md bg-slate-500 relative active:top-[1px] "
        >
          Go
        </button>
      </div>
      {/* Button to close side bar */}
      <button
        onClick={() => {
          setSearchShow(false);
        }}
        className="absolute top-2 right-2"
      >
        <IoCloseCircleSharp size={27} />
      </button>

      {/* All the searched Users */}
      <>
        {searchLoading ? (
          <SearchSkeleton />
        ) : searchData?.length > 0 ? (
          searchData?.map((user) => (
            <SearchedUser
              user={user}
              key={user._id}
              accessChat={accessChat}
              setChatLoad={setChatLoad}
              chatLoad={chatLoad}
            />
          ))
        ) : (
          ""
        )}
      </>

      {/* Toast at Bottom to show Errors */}
      {toast ? (
        <div className=" toast toast-bottom toast-start">
          <div className="alert alert-error">
            <span>
              {" "}
              {dataErr
                ? "No User Found"
                : "Please enter somthing in Search Field"}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchBar;
