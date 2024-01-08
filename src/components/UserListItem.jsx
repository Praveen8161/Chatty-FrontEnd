/* eslint-disable react/prop-types */

// For New Group Chat
// List All the user for the Search Result
const UserListItem = ({ user, handleGroup }) => {
  return (
    <div
      onClick={() => handleGroup(user)}
      className="flex flex-row items-center gap-2 my-2 cursor-pointer"
    >
      <img src={user.pic} alt="DP" className="rounded-[50%] w-8 h-8" />
      <p className="flex flex-col">
        <span>{user.name}</span>
        <span>{user.email}</span>
      </p>
    </div>
  );
};

export default UserListItem;
