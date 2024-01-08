import { useState } from "react";
import { API } from "../helpers/API";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const Login = () => {
  // Set button load
  const [btnLoad, setBtnLoad] = useState(false);
  // User Data
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = ChatState();

  const navigate = useNavigate();

  // Handle UserData Change
  function handleChange(e) {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Login
  function handleLogin() {
    for (let i in userData) {
      if (userData[i] == "") {
        alert("fields are required");
        return;
      }
    }
    const URL = `${API}/user/login`;

    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((data) => data.json())
      .then((data) => {
        setBtnLoad(false);
        if (data.acknowledged) {
          setUser(data);
          localStorage.setItem("userInfo", JSON.stringify(data));

          navigate("/chats");
        } else {
          alert(data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        setBtnLoad(false);
      });
  }
  return (
    <div className="flex flex-col items-center justify-center w-full gap-3 px-3 pt-3 pb-5 m-auto sm:px-5">
      <div className="flex flex-col items-center justify-center gap-5">
        {/* Email Field */}
        <div className="relative flex flex-col sm:w-72 w-60">
          <input
            autoComplete="email"
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={(e) => handleChange(e)}
            className="relative w-full px-2 pt-4 pb-2 text-sm text-black bg-white border-0 rounded shadow outline-none focus:outline-none focus:ring peer placeholder-shown:py-2 focus:pt-4 focus:pb-2 focus:placeholder:opacity-0"
          />
          <span className="absolute peer-placeholder-shown:top-[7px] left-2  peer-focus:top-[1px] text-[12px] peer-placeholder-shown:hidden z-10 peer-placeholder-shown:z-0 peer-focus:block text-slate-500 ">
            Email
          </span>
        </div>

        {/* Password Field */}
        <div className="relative flex flex-col sm:w-72 w-60">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={(e) => handleChange(e)}
            className="relative w-full px-2 pt-4 pb-2 text-sm text-black bg-white border-0 rounded shadow outline-none focus:outline-none focus:ring peer placeholder-shown:py-2 focus:pt-4 focus:pb-2 focus:placeholder:opacity-0"
          />
          <span className="absolute peer-placeholder-shown:top-[7px] left-2  peer-focus:top-[1px] text-[12px] peer-placeholder-shown:hidden z-10 peer-placeholder-shown:z-0 peer-focus:block text-slate-500 ">
            Password
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => {
            setBtnLoad((prev) => !prev);
            handleLogin();
          }}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800  me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none min-w-[40%] min-h-[30px] flex justify-center items-center relative active:top-[2px] focus:outline-slate-700"
        >
          {btnLoad ? <div className=" cus_loading"></div> : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default Login;
