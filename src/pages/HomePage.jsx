import { useEffect, useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [login, setLogin] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen custome_home_bg">
      <div className="w-[260px] sm:w-[325px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] bg-blue-600 text-center mb-5 py-3 font-semibold text-xl rounded-xl text-white">
        Chatty Chat
      </div>

      <div className="w-[260px] sm:w-[325px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] bg-slate-200 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-row items-center justify-center gap-1 overflow-hidden cursor-pointer">
          <div
            className={`w-[50%] text-center  py-2 ${
              login ? "bg-blue-400" : ""
            }`}
            onClick={() => setLogin(true)}
          >
            Login
          </div>
          <div
            className={`w-[50%] text-center  py-2 ${
              !login ? "bg-blue-400" : ""
            }`}
            onClick={() => setLogin(false)}
          >
            Register
          </div>
        </div>

        {/* Components */}
        <div className="mt-4">{login ? <Login /> : <Register />}</div>
      </div>
    </div>
  );
};

export default HomePage;
