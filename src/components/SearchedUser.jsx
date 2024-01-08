/* eslint-disable react/prop-types */

// In the side Search for searching New user to Chat
// Each user cards
const SearchedUser = ({ user, accessChat, setChatLoad, chatLoad }) => {
  return (
    <div
      onClick={() => {
        accessChat(user._id);
        setChatLoad(true);
      }}
      className="flex flex-row items-center justify-start w-full gap-5 px-4 py-2 my-2 overflow-hidden cursor-pointer bg-slate-400 text-start rounded-xl hover:bg-sky-500"
    >
      <div>
        <img
          src={user.pic}
          alt="DP"
          className="object-contain w-8 rounded-[50%] filter contrast-150"
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
      {chatLoad ? (
        <div className="w-5 h-5 ml-6 border-black cus_loading"></div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SearchedUser;
