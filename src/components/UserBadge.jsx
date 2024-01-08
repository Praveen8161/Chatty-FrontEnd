/* eslint-disable react/prop-types */
import { AiOutlineCloseCircle } from "react-icons/ai";

// For New Group Chat
// Show Selected User in badge Style
const UserBadge = ({ u, handleDelete }) => {
  return (
    <p className="flex flex-row items-center text-white bg-blue-500 rounded-md flex-nowrap">
      <span className="px-2 py-1">{u.name}</span>
      <span
        onClick={() => handleDelete(u)}
        className="flex items-center justify-center h-full px-1 bg-red-400 cursor-pointer"
      >
        <AiOutlineCloseCircle />
      </span>
    </p>
  );
};

export default UserBadge;
