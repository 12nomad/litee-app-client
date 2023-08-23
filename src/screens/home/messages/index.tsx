import { LuMessagesSquare } from "react-icons/lu";
import { Tooltip } from "flowbite-react";
import { Link } from "react-router-dom";

import { useGetRoomsQuery } from "../../../store/features/api.slice";
import Loading from "../../../components/ui/Loading";
import ErrorHandler from "../../../components/ui/ErrorHandler";
import { useAppSelector } from "../../../store/store";
import Container from "../../../components/ui/Container";

const MessageInbox = () => {
  const user = useAppSelector((s) => s.user.user);
  const { data, isLoading, error } = useGetRoomsQuery({
    userId: user?.id || 0,
  });

  if (isLoading) return <Loading />;

  if (error) return <ErrorHandler error={error} />;

  return (
    <Container
      containerClass="w-full md:w-3/4 px-4 md:px-0 mx-auto text-sm"
      tabTitle="Messages"
    >
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Inbox</h3>
          <Tooltip content="start messaging..." placement="bottom">
            <Link to="/messages/new">
              <LuMessagesSquare size={22} className="cursor-pointer" />
            </Link>
          </Tooltip>
        </div>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      {!isLoading && data && data.length > 0
        ? data.map((room) => (
            <Link
              to={`/messages/${room.id}`}
              key={room.id}
              className="flex items-center gap-2 mb-3"
            >
              {room.isGroupRoom ? (
                <>
                  <div className="relative w-12">
                    {room.users
                      .filter((el) => el.id !== user?.id)
                      .slice(0, 2)
                      .map((user, idx) => (
                        <img
                          key={user.username}
                          src={
                            user.profileImage ||
                            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                          }
                          alt={user.username + "avatar"}
                          className={`absolute w-6 h-6 ${
                            idx === 1
                              ? "-bottom-[6px] right-2"
                              : "-top-[6px] left-0"
                          } object-cover rounded-full`}
                        />
                      ))}
                  </div>

                  <div>
                    {room.roomName ? (
                      <p className="font-medium">{room.roomName}</p>
                    ) : (
                      <p>
                        {room.users
                          .filter((el) => el.id !== user?.id)
                          .slice(0, 2)
                          .map((user, idx) => (
                            <span key={user.username} className="font-medium">
                              {`${user.username}${idx === 1 ? ", ..." : ", "}`}
                            </span>
                          ))}
                      </p>
                    )}
                    <p className="font-light">
                      {room.seenBy.findIndex((el) => el.id === user?.id) < 0 &&
                        user?.id !== room.latestMessage?.senderId && (
                          <span className="">
                            <span className="bg-purple-eminence w-2 h-2 rounded-full inline-block"></span>
                          </span>
                        )}{" "}
                      {room.latestMessage?.message
                        ? room.latestMessage?.message
                        : "no messages yet"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={
                      (room.users[0].username === user?.username
                        ? room.users[1].profileImage
                        : room.users[0].profileImage) ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    }
                    alt={
                      (room.users[0].username === user?.username
                        ? room.users[1].username
                        : room.users[0].username) + "avatar"
                    }
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="pl-2">
                    <p className="font-medium">
                      {room.roomName ||
                        (room.users[0].username === user?.username
                          ? room.users[1].username
                          : room.users[0].username)}
                    </p>
                    <p className="font-light">
                      {room.seenBy.findIndex((el) => el.id === user?.id) < 0 &&
                        user?.id !== room.latestMessage?.senderId && (
                          <span className="">
                            <span className="bg-purple-eminence w-2 h-2 rounded-full inline-block"></span>
                          </span>
                        )}{" "}
                      {room.latestMessage?.message
                        ? room.latestMessage?.message
                        : "no messages yet"}
                    </p>
                  </div>
                </>
              )}
            </Link>
          ))
        : "Start a conversation first..."}
    </Container>
  );
};

export default MessageInbox;
