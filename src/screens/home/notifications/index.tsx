import { Tooltip } from "flowbite-react";
import { BsCheck2All } from "react-icons/bs";

import {
  useDeleteNotifsMutation,
  useGetNotifsQuery,
  useViewedNotifMutation,
} from "../../../store/features/api.slice";
import Loading from "../../../components/ui/Loading";
import ErrorHandler from "../../../components/ui/ErrorHandler";
import NotifType from "./components/NotifType";
import { Link } from "react-router-dom";
import Container from "../../../components/ui/Container";

const Notifications = () => {
  const { data, isLoading, error } = useGetNotifsQuery();
  const [viewedNotif] = useViewedNotifMutation();
  const [deleteNotifs] = useDeleteNotifsMutation();

  if (isLoading) return <Loading />;

  if (error) return <ErrorHandler error={error} />;

  return (
    <Container
      containerClass="w-full md:w-3/4 px-4 md:px-0 mx-auto text-sm"
      tabTitle="Notifications"
    >
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Notifications</h3>
          <Tooltip
            content="mark all notifications as read..."
            placement="bottom-end"
          >
            <BsCheck2All
              size={22}
              className="cursor-pointer"
              onClick={() => deleteNotifs()}
            />
          </Tooltip>
        </div>
        <div className="w-full h-[1px] bg-black-rich-tint mt-1 mb-5"></div>
      </div>

      {!isLoading && data && data.length > 0
        ? data.map((notif) => (
            <Link
              key={notif.id}
              onClick={() => viewedNotif({ notifId: notif.id })}
              to={
                notif.notifType === "FOLLOW"
                  ? `/profile/${notif.notifFrom.username}`
                  : `/posts/${notif.typeId}`
              }
            >
              <div className="flex items-center gap-4 mt-4">
                <div className="relative">
                  <img
                    src={
                      notif.notifFrom.profileImage ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    }
                    alt={(notif.notifFrom.username || "user") + "avatar"}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  {!notif.viewed && (
                    <div className="absolute w-2 h-2 top-0 right-0 bg-purple-eminence rounded-full"></div>
                  )}
                </div>

                <NotifType
                  notifType={notif.notifType}
                  username={notif.notifFrom.username}
                />
              </div>
            </Link>
          ))
        : "Nothing to show for now..."}
    </Container>
  );
};

export default Notifications;
