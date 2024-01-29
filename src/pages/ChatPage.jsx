import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";
import GroupChatModel from "../components/GroupChatModel";
import MyChats from "../components/MyChats";
import NavBar from "../components/NavBar";
import { ChatState } from "../context/ChatProvider";

// Main Chat page
const ChatPage = () => {
  const { selectedChat } = ChatState();
  const [viewChatBox, setViewChatBox] = useState(false);

  useEffect(() => {
    if (selectedChat._id) {
      setViewChatBox(() => true);
    } else if (!selectedChat._id) {
      setViewChatBox(() => false);
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-col max-h-screen min-h-screen custom_bg min-w-screen">
      <NavBar />

      {/* Main Chat Section for >sm */}
      <div className="flex-row flex-grow hidden h-full gap-3 mt-2 overflow-y-auto sm:flex">
        {/* List of Chat */}
        <section className="flex flex-col w-4/12 px-3 overflow-y-auto rounded-t-xl bg-slate-50">
          <div className="flex flex-row items-center justify-between py-2">
            <h1 className="font-semibold md:text-lg lg:text-xl ">MyChats</h1>

            {/* Component to create new Group */}
            <section>
              <GroupChatModel />
            </section>

            {/* All the user Chats list */}
          </div>
          <MyChats />
        </section>

        {/* Chat Box */}
        <section className="flex-grow h-auto overflow-hidden rounded-t-xl ">
          <ChatBox />
        </section>
      </div>

      {/* Main Chat for <sm */}
      <div className="flex flex-col flex-grow w-screen h-full gap-3 mt-2 overflow-y-auto sm:hidden bg-slate-900">
        {/* List of Chat */}
        {!viewChatBox && (
          <section className="flex flex-col flex-grow w-full px-3 overflow-y-auto rounded-t-xl bg-slate-50">
            <div className="flex flex-row items-center justify-between py-2">
              <h1 className="font-semibold md:text-lg lg:text-xl ">MyChats</h1>

              {/* Component to create new Group */}
              <section>
                <GroupChatModel />
              </section>

              {/* All the user Chats list */}
            </div>
            <MyChats />
          </section>
        )}

        {/* Chat Box */}
        {viewChatBox && (
          <section className="flex-grow w-full overflow-hidden  rounded-t-xl bg-slate-700">
            <ChatBox setViewChatBox={setViewChatBox} />
          </section>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
