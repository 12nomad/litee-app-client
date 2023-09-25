import { Outlet, useLocation } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect } from "react";

import lottiefile from "../../assets/lottie/animation_ljztp22z.json";
import { socket } from "../../store/features/api.slice";
import { EVENTS } from "../../data/event.constant";
import { useAppSelector } from "../../store/store";

const Auth = () => {
  const location = useLocation();

  const user = useAppSelector((s) => s.user.user);
  console.log(user);

  useEffect(() => {
    document.querySelector("html")!.classList.remove("dark");

    const key = localStorage.getItem("lt-app-key");
    if (key) {
      socket.emit<`${EVENTS}`>("DISCONNECT", {
        username: key,
      });
      socket.disconnect();
    }
  }, []);

  return (
    <div
      className={`min-h-screen ${
        location.pathname === "/auth/password-reset"
          ? "xl:grid-cols-1"
          : "xl:grid-cols-2"
      } grid grid-cols-1 text-center bg-gradient-to-r from-purple-eminence to-[#b28cbc]`}
    >
      <div className="m-auto order-last xl:order-none">
        <h2 className="flex items-center justify-center gap-1 text-4xl mt-6 xl:mt-0 text-white-powder">
          <span className="font-lobster">Litee.</span>
        </h2>
        <p className="mb-6 mt-2">Share whatever comes through your mind...</p>
        <Outlet />
      </div>
      <div
        className={`m-auto p-8 xl:p-16 ${
          location.pathname === "/auth/password-reset" && "hidden"
        }`}
      >
        <Player src={lottiefile} className="w-full h-full" autoplay loop />
      </div>
    </div>
  );
};

export default Auth;
