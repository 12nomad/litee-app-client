import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";

import { useAppSelector } from "../../store/store";
import { socket } from "../../store/features/api.slice";
import { EVENTS } from "../../data/event.constant";
import Sidebar from "../../components/ui/Sidebar";
import Nav from "../../components/ui/Nav";
import PostsFeed from "./posts-feed";
import PostModal from "../../components/ui/PostModal";
import ViewPost from "./view-post";
import MessageInbox from "./messages";
import MessageSearch from "./messages/components/MessageSearch";
import Profile from "./profile";
import MessageRoom from "./messages/components/MessageRoom";
import Notifications from "./notifications";
import Search from "./search";
import NotFound from "../common/not-found";

const Home = () => {
  const [navOpen, setNavOpen] = useState(false);
  const postInputModalOpen = useAppSelector((s) => s.post.postInputModalOpen);

  useEffect(() => {
    document.querySelector("html")!.classList.add("dark");

    return () => {
      socket.off<`${EVENTS}`>("NEW_FOLLOW");
      socket.off<`${EVENTS}`>("NEW_LIKE");
      socket.off<`${EVENTS}`>("NEW_REPOST");
      socket.off<`${EVENTS}`>("NEW_REPLY");
      socket.off<`${EVENTS}`>("INCOMING_MESSAGE");
    };
  }, []);

  const toggleNav = useCallback((val: boolean) => setNavOpen(val), []);

  return (
    <>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#1d2127",
              color: "#FCFFFC",
            },
          }}
        />
      </div>
      <Nav toggleNav={toggleNav} />
      <div className="xl:max-w-screen-xl xl:px-4 grid grid-cols-3 mx-auto">
        <aside
          className={`h-screen bg-black-rich px-4 py-6 transition ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          } w-full fixed z-10 top-0 left-0 xl:static xl:block xl:translate-x-0 xl:px-0 xl:h-[calc(100vh-52px)]`}
        >
          <Sidebar toggleNav={toggleNav} />
        </aside>
        <main className="max-h-[calc(100vh-76px)] pt-6 col-span-3 xl:col-span-2 overflow-auto no-scrollbar">
          {postInputModalOpen && <PostModal />}
          <Routes>
            <Route index element={<PostsFeed />} />
            <Route path="messages" element={<MessageInbox />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="search" element={<Search />} />
            <Route path="posts/:postId" element={<ViewPost />} />
            <Route path="profile/:username" element={<Profile />} />
            <Route path="messages/new" element={<MessageSearch />} />
            <Route path="messages/:roomId" element={<MessageRoom />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default Home;
