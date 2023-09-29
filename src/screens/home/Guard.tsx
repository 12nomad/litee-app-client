import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Loading from "../../components/ui/Loading";
import { socket, useGetAuthUserQuery } from "../../store/features/api.slice";
import { useAppDispatch } from "../../store/store";
import { addUser } from "../../store/features/user.slice";
import { EVENTS } from "../../data/event.constant";

const Guard = () => {
  const { isLoading, data, error } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!isLoading && data) {
        dispatch(addUser({ user: data }));
        sessionStorage.setItem("lt-app-key", data.username);
        socket.connect();
        socket.emit<`${EVENTS}`>("CONNECT", { username: data.username });
      } else if (!isLoading && error) {
        return navigate("/auth", { replace: true });
      }
    }, 1000);

    return () => {
      clearTimeout(delay);
    };
  }, [error, data]);

  if (isLoading) return <Loading withNav={false} />;

  return !isLoading && !error && data ? <Outlet /> : null;
};

export default Guard;
