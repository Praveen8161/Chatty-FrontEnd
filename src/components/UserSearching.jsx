/* eslint-disable react/prop-types */
import { useState } from "react";
import UserBadge from "./UserBadge";
import UserListItem from "./UserListItem";
import { API } from "../helpers/API";
import { ChatState } from "../context/ChatProvider";

// Search user to add to the new Group Chat
const UserSearching = ({
  searchResult,
  setSelectedUsers,
  selectedUsers,
  setSearchResult,
  setSearch,
  search,
}) => {
  const [loading, setLoading] = useState(false);
  // COntaxt API
  const { user } = ChatState();

  // Search user for every Keystrock
  function handleUserSearch(query) {
    setSearch(query);
    if (!query) {
      return;
    }
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
          setSearchResult(data.users);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Select the user -- to be added to the New Group Chat
  function handleGroup(userToAdd) {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  // Remove the Selected User
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  return (
    <>
      <input
        type="text"
        placeholder="Users name"
        onChange={(e) => handleUserSearch(e.target.value)}
        className="w-full max-w-xs input input-bordered input-md rounded-2xl"
      />

      {/* Selected Users in Badge Style */}
      <div className="flex flex-row flex-wrap gap-1 mt-2">
        {selectedUsers.length > 0 &&
          selectedUsers?.map((u) => (
            <UserBadge key={u._id} u={u} handleDelete={handleDelete} />
          ))}
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
    </>
  );
};

export default UserSearching;
