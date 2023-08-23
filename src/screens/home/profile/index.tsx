import { Tabs } from "flowbite-react";
import { VscFlame } from "react-icons/vsc";
import { BiBookmarkAltPlus } from "react-icons/bi";
import type { CustomFlowbiteTheme } from "flowbite-react";

import {
  socket,
  useGetUserByUsernameQuery,
  useLazyGetRoomByUserIdQuery,
  useLogoutMutation,
  useToggleFollowMutation,
} from "../../../store/features/api.slice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import ErrorHandler from "../../../components/ui/ErrorHandler";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import ProfilePostArticle from "./components/ProfilePostArticle";
import { setPostInputModalOpen } from "../../../store/features/post.slice";
import EditProfileInput from "./components/EditProfileInput";
import { EVENTS } from "../../../data/event.constant";
import { clearUser } from "../../../store/features/user.slice";
import Container from "../../../components/ui/Container";

const customTabsTheme: CustomFlowbiteTheme["tab"] = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      styles: {
        underline: {
          active: {
            on: "text-blue-cerulean rounded-t-lg border-b-2 border-blue-cerulean active dark:text-blue-cerulean dark:border-blue-cerulean",
          },
        },
      },
    },
  },
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);
  const navigate = useNavigate();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [follow, { isLoading: followLoading }] = useToggleFollowMutation();
  const [getRoom, { isLoading: roomLoading }] = useLazyGetRoomByUserIdQuery();

  const { data, isLoading, error } = useGetUserByUsernameQuery({
    username: username || "",
  });

  if (isLoading) return <Loading />;

  if (error) return <ErrorHandler error={error} />;

  const onGetRoom = async () => {
    const result = await getRoom({ userId: data?.id || 0 });

    if (!("error" in result)) {
      navigate(`/messages/${result.data?.id}`);
    }
  };

  const onLogout = async () => {
    const result = await logout();

    if (!("error" in result)) {
      socket.emit<`${EVENTS}`>("DISCONNECT", { username: user?.username });
      socket.disconnect();
      dispatch(clearUser());
      navigate("/auth", { replace: true });
    }
  };

  const userInFollowers = !(
    data && data.followers.findIndex((el) => el.id === user?.id) < 0
  );
  const onFollow = async () => {
    await follow({
      authUserId: user?.id || 0,
      id: data?.id || 0,
      username: data?.username || "",
    });
  };

  const onEdit = () => {
    if (data) {
      dispatch(
        setPostInputModalOpen({
          val: true,
          element: (
            <EditProfileInput
              description={data.description || ""}
              name={data.name || ""}
              username={data.username}
              profileImage={data.profileImage || ""}
            />
          ),
        })
      );
    }
  };

  return !isLoading && data ? (
    <Container
      containerClass="w-full md:w-3/4 px-4 md:px-0 mx-auto text-sm"
      tabTitle={data.username}
    >
      <div className="w-full grid grid-cols-4 md:grid-cols-3 ">
        <img
          src={
            data.profileImage ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          }
          alt={data.username + "profile image"}
          className="w-16 h-16 md:w-32 md:h-32 rounded-full object-cover"
        />
        <div className="col-span-3 md:col-span-2">
          <header className="flex items-center gap-8 md:gap-16">
            <p className="font-medium">{data.username}</p>
            {user?.id === data.id ? (
              <div className="flex items-center gap-4">
                <button
                  className="px-2 py-1 rounded-md bg-black-rich-tint"
                  onClick={onEdit}
                >
                  edit profile
                </button>
                <button
                  className="px-2 py-1 rounded-md bg-black-rich-tint"
                  disabled={logoutLoading}
                  onClick={onLogout}
                >
                  logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  className="px-2 py-1 rounded-md bg-black-rich-tint"
                  disabled={roomLoading}
                  onClick={onGetRoom}
                >
                  message
                </button>
                <button
                  className={`px-2 py-1 rounded-md ${
                    userInFollowers
                      ? "bg-black-rich-tint"
                      : "bg-purple-eminence"
                  } `}
                  disabled={followLoading}
                  onClick={onFollow}
                >
                  {userInFollowers ? "unfollow" : "follow"}
                </button>
              </div>
            )}
          </header>
          <div className="flex items-center gap-4 mt-4">
            <p>
              <span className="font-medium">{data._count.posts}</span> Posts
            </p>
            <p>
              <span className="font-medium">{data._count.following}</span>{" "}
              Following
            </p>
            <p>
              <span className="font-medium">{data._count.followers}</span>{" "}
              Followers
            </p>
          </div>
          <div className="mt-4">
            <p className="font-medium">{data.name}</p>
            <p>{data.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full mx-auto">
        <Tabs.Group
          aria-label="Tabs with underline"
          style="underline"
          theme={customTabsTheme}
        >
          <Tabs.Item active icon={VscFlame} title="Posts">
            {data.posts.map((post) => (
              <Link to={`/posts/${post.id}`} key={post.id}>
                <ProfilePostArticle
                  createdAt={post.createdAt}
                  description={post.description}
                  media={post.media}
                  isRepost={post.isRepost}
                />
              </Link>
            ))}
          </Tabs.Item>
          <Tabs.Item icon={BiBookmarkAltPlus} title="Saved">
            {data.savedPosts.map((post) => (
              <Link to={`/posts/${post.id}`} key={post.id}>
                <ProfilePostArticle
                  createdAt={post.createdAt}
                  description={post.description}
                  media={post.media}
                  isRepost={post.isRepost}
                />
              </Link>
            ))}
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </Container>
  ) : (
    <></>
  );
};

export default Profile;
