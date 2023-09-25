import {
  HiOutlineHome,
  HiOutlineLogin,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { MdOutlineNotificationsActive, MdOutlineAddBox } from "react-icons/md";
import {
  BiPaperPlane,
  BiDotsHorizontalRounded,
  BiSearchAlt,
} from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { Dropdown } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  socket,
  useGetMessageNotifsCountQuery,
  useGetNotifsCountQuery,
  useLogoutMutation,
} from "../../store/features/api.slice";
import { clearUser } from "../../store/features/user.slice";
import { setPostInputModalOpen } from "../../store/features/post.slice";
import PostInput from "../../screens/home/posts-feed/components/PostInput";
import { EVENTS } from "../../data/event.constant";
import ProfileImage from "./ProfileImage";

interface ISidebar {
  toggleNav: (val: boolean) => void;
}

const Sidebar = ({ toggleNav }: ISidebar) => {
  const user = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: notifsCount } = useGetNotifsCountQuery();
  const { data: messageNotifsCount } = useGetMessageNotifsCountQuery();
  const [logout] = useLogoutMutation();

  const onCreatePost = () => {
    toggleNav(false);
    dispatch(setPostInputModalOpen({ val: true, element: <PostInput /> }));
  };

  const onGoToProfile = () => {
    toggleNav(false);
    navigate(`/profile/${user?.username}`);
  };

  const onSignout = async () => {
    const result = await logout();

    if (!("error" in result)) {
      socket.emit<`${EVENTS}`>("DISCONNECT", { username: user?.username });
      socket.disconnect();
      dispatch(clearUser());
      localStorage.removeItem("lt-app-key");
      return navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between xl:block">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "dark:text-purple-eminence" : "dark:text-white-powder"
            }
            onClick={() => toggleNav(false)}
          >
            <div className="flex items-center gap-2 ">
              <HiOutlineHome size={22} />
              <h4 className="font-medium text-lg">Home</h4>
            </div>
          </NavLink>

          <CgClose
            className="text-white-powder cursor-pointer xl:hidden"
            size={28}
            onClick={() => toggleNav(false)}
          />
        </div>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? "dark:text-purple-eminence" : "dark:text-white-powder"
          }
          onClick={() => toggleNav(false)}
        >
          <div className="flex items-center gap-2 ">
            {notifsCount && notifsCount > 0 ? (
              <div className="relative">
                <MdOutlineNotificationsActive size={22} />
                <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-purple-eminence text-white-powder grid place-items-center text-xs">
                  {notifsCount}
                </div>
              </div>
            ) : (
              <MdOutlineNotificationsActive size={22} />
            )}
            <h4 className="font-medium text-lg">Notifications</h4>
          </div>
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            isActive ? "dark:text-purple-eminence" : "dark:text-white-powder"
          }
          onClick={() => toggleNav(false)}
        >
          <div className="flex items-center gap-2 ">
            {messageNotifsCount && messageNotifsCount > 0 ? (
              <div className="relative">
                <BiPaperPlane size={22} />
                <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-purple-eminence text-white-powder grid place-items-center text-xs">
                  {messageNotifsCount}
                </div>
              </div>
            ) : (
              <BiPaperPlane size={22} />
            )}
            <h4 className="font-medium text-lg">Messages</h4>
          </div>
        </NavLink>

        <NavLink
          to={`/search`}
          className={({ isActive }) =>
            isActive ? "dark:text-purple-eminence" : "dark:text-white-powder"
          }
          onClick={() => toggleNav(false)}
        >
          <div className="flex items-center gap-2 ">
            <BiSearchAlt size={22} />
            <h4 className="font-medium text-lg">Search</h4>
          </div>
        </NavLink>

        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            isActive ? "dark:text-purple-eminence" : "dark:text-white-powder"
          }
          onClick={() => toggleNav(false)}
        >
          <div className="flex items-center gap-2 ">
            <HiOutlineUserCircle size={22} />
            <h4 className="font-medium text-lg">Profile</h4>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={onCreatePost}
          className="flex items-center gap-2 cursor-pointer"
        >
          <MdOutlineAddBox size={22} />
          <h4 className="font-medium text-lg">Post</h4>
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProfileImage src={user?.profileImage} size={10} />
            <p>{user?.username}</p>
          </div>
          <Dropdown
            inline
            dismissOnClick
            arrowIcon={false}
            className="dark:bg-black-rich-tint text-white-powder"
            placement="top-end"
            label={
              <BiDotsHorizontalRounded
                className="text-white-powder"
                size={28}
              />
            }
          >
            <Dropdown.Item onClick={onGoToProfile}>
              <span className="flex items-center truncate text-sm gap-1">
                <HiOutlineUserCircle size={20} />
                Profile
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={onSignout}>
              <span className="flex items-center truncate text-sm gap-1">
                <HiOutlineLogin size={20} />
                Logout
              </span>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
