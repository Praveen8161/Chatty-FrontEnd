import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ImSearch } from "react-icons/im";
import SearchBar from "./SearchBar";
import { ChatState } from "../context/ChatProvider";

const NavBar = () => {
  const [dropdown, setDropDown] = useState(false);
  // Side Bar Show
  const [searchShow, setSearchShow] = useState(false);

  const { user: currUser } = ChatState();

  const navigate = useNavigate();

  // Logout
  function handleLogout() {
    localStorage.removeItem("userInfo");
    navigate("/", { replace: true });
  }

  return (
    <div className="relative flex flex-row items-center justify-around px-1 py-2 shadow-xl sm:justify-between md:px-3 bg-slate-100">
      {/* Search Side Bar Show on Click */}
      <div className="w-[30%] ">
        <p
          onClick={() => {
            setDropDown(false);
            setSearchShow(true);
          }}
          className="flex flex-row items-center ml-2 sm:ml-0 justify-start sm:gap-2 cursor-pointer w-max hover:scale-[1.03]"
        >
          <span>
            <ImSearch />
          </span>
          <span className="hidden sm:inline md:text-md">Search User</span>
        </p>

        {/* Search Side Bar */}
        <SearchBar searchShow={searchShow} setSearchShow={setSearchShow} />
      </div>
      {/* Search Input End */}

      {/* Heading */}
      <div className="w-[30%] text-center">
        <h1 className="text-sm font-semibold whitespace-nowrap sm:text-xl">
          Chatty-Chat
        </h1>
      </div>

      {/* Profile and logout */}
      <div className="flex flex-row items-center justify-end gap-1 sm:gap-3 w-[30%]">
        <IoIosNotifications size={20} className="cursor-pointer " />
        <div
          onClick={() => {
            setDropDown((prev) => !prev);
          }}
          className="py-[0.5px]  px-1 rounded-sm flex items-center gap-2 cursor-pointer"
        >
          <img
            src={currUser?.pic}
            alt="DP"
            className="rounded-[50%] object-contain w-7 h-7"
          />
          <span
            className={`${
              dropdown ? "rotate-180" : ""
            } transition-all duration-300`}
          >
            <IoIosArrowDown />
          </span>

          {/* profile and Logout */}
          <section
            className={`absolute top-[100%] flex flex-col items-center justify-center px-5 py-3  rounded-b-md right-0 cursor-pointer text-medium min-w-[200px] shadow-xl bg-slate-100 ${
              dropdown ? "scale-100" : "scale-0"
            } transition-all duration-300`}
          >
            <span>
              {/* Profile Model Start */}
              <button
                className="bg-transparent border-none rounded-lg shadow-none btn"
                onClick={() => {
                  setDropDown(false);
                  document.getElementById("my_modal_2").showModal();
                }}
              >
                Profile
              </button>
              <dialog id="my_modal_2" className="modal">
                {/* Current User Details */}
                <div className="flex flex-col items-center justify-center modal-box">
                  <img
                    src={currUser.pic}
                    alt="DP"
                    className="w-[100px] h-[100px] rounded-[50%]"
                  />
                  <h3 className="text-lg font-bold">{currUser.name}</h3>
                  <p>{currUser.email}</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              {/* Model End */}
            </span>

            <span
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg hover:bg-gray-300/50"
            >
              Logout
            </span>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
