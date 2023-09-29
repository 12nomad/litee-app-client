import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Loading from "../../components/ui/Loading";
import { socket, useGetAuthUserQuery } from "../../store/features/api.slice";
import { useAppDispatch } from "../../store/store";
import { addUser } from "../../store/features/user.slice";
import { EVENTS } from "../../data/event.constant";

const Guard = () => {
  const { isLoading, data, error, isFetching } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isFetching && data) {
      dispatch(addUser({ user: data }));
      localStorage.setItem("lt-app-key", data.username);
      socket.connect();
      socket.emit<`${EVENTS}`>("CONNECT", { username: data.username });
    } else if (!isLoading && !isFetching && !data) {
      return navigate("/auth", { replace: true });
    }
  }, [data]);

  if (isLoading) return <Loading withNav={false} />;

  if (error) return <Navigate to="/auth" replace />;

  return !isLoading && data ? <Outlet /> : null;
};

export default Guard;
