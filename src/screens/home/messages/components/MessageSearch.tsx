import { useState } from "react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";

import useSearch from "../../../../hooks/useSearch";
import ErrorHandler from "../../../../components/ui/ErrorHandler";
import RepostHeader from "../../posts-feed/components/shared/RepostHeader";
import { useAppSelector } from "../../../../store/store";
import { useCreateRoomMutation } from "../../../../store/features/api.slice";
import Container from "../../../../components/ui/Container";

const customBadgeTheme: CustomFlowbiteTheme["badge"] = {
  root: {
    color: {
      info: "bg-blue-cerulean text-white-powder dark:bg-blue-cerulean dark:text-white-powder group-hover:bg-blue-cerulean dark:group-hover:bg-blue-cerulean",
    },
  },
};

const MessageSearch = () => {
  const [username, setUsername] = useState("");
  const [usersToChat, setUsersToChat] = useState<string[]>([]);
  const user = useAppSelector((s) => s.user.user);
  const { data, isLoading, error } = useSearch(username);
  const [createRoom, { isLoading: createRoomLoading }] =
    useCreateRoomMutation();
  const navigate = useNavigate();

  if (error) return <ErrorHandler error={error} />;

  const userResult =
    data &&
    data.filter(
      (el) =>
        el.username !== user?.username && !usersToChat.includes(el.username)
    );

  const onSelectUser = (username: string) => {
    setUsersToChat((prev) => [...prev, username]);
    setUsername("");
  };

  const onDeselectUser = (username: string) => {
    setUsersToChat((prev) => prev.filter((el) => el !== username));
  };

  const onCreateChat = async () => {
    const result = await createRoom({ usersArray: usersToChat });

    if (!("error" in result)) {
      navigate("/messages");
    }
  };

  return (
    <Container
      containerClass="min-h-[calc(100vh-110px)] w-full md:w-3/4 pt-6 px-4 md:px-0 mx-auto text-sm"
      tabTitle="New Message"
    >
      <header>
        <h3 className="text-lg font-medium">New Message</h3>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </header>

      <div className="">
        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Find user:
        </label>

        <div className="w-full relative">
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 rounded-lg text-xs focus:ring-blue-cerulean dark:bg-black-rich dark:border-black-rich dark:placeholder-gray-400 dark:text-white-powder dark:focus:ring-blue-cerulean dark:focus:border-blue-cerulean"
            placeholder="username..."
          />

          {username && !isLoading && data && userResult && (
            <div className="absolute overflow-auto top-[40px] md:top-[42px] left-0  bg-black-rich-tint rounded-md w-full pt-2 px-2">
              {userResult.length > 0 ? (
                userResult.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => onSelectUser(user.username)}
                    className="cursor-pointer"
                  >
                    <RepostHeader
                      username={user.username}
                      profileImage={user.profileImage}
                      withCreatedAt={false}
                      usernameClickable={false}
                    />
                  </div>
                ))
              ) : (
                <p className="mb-2">no user found...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {usersToChat.length > 0 && (
        <>
          <div className="mt-3 border border-black-rich-tint rounded-md p-2 flex items-center gap-2">
            {usersToChat.map((username) => (
              <Badge key={username} theme={customBadgeTheme}>
                {username}{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => onDeselectUser(username)}
                >
                  x
                </span>
              </Badge>
            ))}
          </div>
          <button
            type="button"
            disabled={createRoomLoading}
            className="mt-3 px-3 py-2 bg-purple-eminence rounded-md font-medium"
            onClick={onCreateChat}
          >
            Create chat
          </button>
        </>
      )}
    </Container>
  );
};

export default MessageSearch;
